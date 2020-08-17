using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CoinInRest.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoinInRest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly CoinDbContext db;

        public TransactionController(UserManager<ApplicationUser> userManager, CoinDbContext dbContext)
        {
            this.userManager = userManager;
            db = dbContext;
        }



        [HttpGet]
        [Route("Companies")]
        public ActionResult Companies()
        {
            List<Company> companies = db.Companies.OrderBy(c => c.Symbol).ToList();

            if (companies.Count > 0)
            {
                return Ok(companies);
            }
            else
            {
                return BadRequest(new { message = "Unable to retrive data from database." });
            }
        }


        [HttpGet]
        [Route("Search")]
        public ActionResult Search(string name)
        {
            List<Company> companies = db.Companies.ToList();
            List<Company> foundCompanies = new List<Company>();
            if (companies.Count > 0)
            {
                foreach (Company company in companies)
                {

                    if (company.Name.ToLower().Contains(name.ToLower()))
                    {
                        Company newCompany = new Company
                        {
                            Symbol = company.Symbol,
                            Name = company.Name
                        };
                        foundCompanies.Add(newCompany);
                    };
                }
                return Ok(foundCompanies);
            }
            return BadRequest(new { message = "Company does not exists in out list." });
        }


        [HttpPost]
        [Route("Buy")]
        public async Task<ActionResult> Buy(BuyModel model)
        {
            using (var client = new HttpClient())
            {
                try
                {

                    client.BaseAddress = new Uri("https://cloud-sse.iexapis.com");
                    var response = await client.GetAsync($"/stable/stock/{model.Symbol}/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e");
                    response.EnsureSuccessStatusCode();

                    var stringResult = await response.Content.ReadAsStringAsync();
                    var rawShare = JsonConvert.DeserializeObject<Bought>(stringResult);
                    string userId = User.Claims.First(c => c.Type == "Id").Value;
                    var user = db.ApplicationUsers.Where(au => au.Id == userId).ToList();

                    double total = 0;
                    List<Bought> shares = db.Boughts.Where(s => s.AspNetUserId == userId).Where(s => s.IsOwned == true).ToList();
                    foreach (Bought item in shares)
                    {
                        total += (item.latestPrice * item.NumOfShare);
                    }

                    double cash = user[0].Fund - total;

                    double cost = rawShare.latestPrice * model.Share;

                    if (cash >= cost)
                    {
                        DateTime date = DateTime.Now;

                        Bought share = new Bought
                        {
                            TransactionType = "Buy",
                            DateAndTime = date,
                            Symbol = model.Symbol.ToUpper(),
                            companyName = rawShare.companyName,
                            latestPrice = rawShare.latestPrice,
                            NumOfShare = model.Share,
                            IsOwned = true,
                            AspNetUserId = userId
                        };


                        db.Boughts.Add(share);
                        await db.SaveChangesAsync();
                        string message = "Bought";
                        return Ok(new { message });

                    }
                    string errorMessage = "Failed. Total cost exceeds your available cash.";
                    return BadRequest(new { errorMessage });


                }
                catch (HttpRequestException httpRequestException)
                {
                    return BadRequest(new { httpRequestException.Message });
                }
            }

        }

        [HttpPost]
        [Route("AddCompany")]
        public async Task<ActionResult> AddCompany(Company model)
        {
            string message;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://cloud-sse.iexapis.com");
                var response = await client.GetAsync($"/stable/stock/{model.Symbol}/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e");

                var stringResult = await response.Content.ReadAsStringAsync();
                //var rawShare = JsonConvert.DeserializeObject<Bought>(stringResult);
                List<Company> companies = db.Companies.ToList();
                List<string> symbols = new List<string>();
                foreach (Company company in companies)
                {
                    symbols.Add(company.Symbol);
                }

                if (!symbols.Contains(model.Symbol.ToUpper()) && !stringResult.Contains("Unknown"))
                {
                    Company newCompany = new Company
                    {
                        Symbol = model.Symbol.ToUpper(),
                        Name = model.Name
                    };
                    db.Companies.Add(newCompany);
                    db.SaveChanges();
                    message = "New company has been added!";
                    return Ok(new { message });
                }

            }
            message = "This company does not exist in this stock market!";
            return BadRequest(new { message });

        }

        [HttpPost]
        [Route("Sell")]
        public async Task<ActionResult> Sell(Sold model)
        {
            string message;
            using (var client = new HttpClient())
            {
                try
                {

                    client.BaseAddress = new Uri("https://cloud-sse.iexapis.com");
                    var response = await client.GetAsync($"/stable/stock/{model.Symbol}/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e");
                    response.EnsureSuccessStatusCode();

                    var stringResult = await response.Content.ReadAsStringAsync();
                    var rawShare = JsonConvert.DeserializeObject<Sold>(stringResult);

                    string userId = User.Claims.First(c => c.Type == "Id").Value;
                    var user = db.ApplicationUsers.Where(au => au.Id == userId).ToList();


                    List<Bought> shareList = db.Boughts.Where(s => s.Symbol == model.Symbol).Where(s => s.NumOfShare == model.NumOfShare).Where(s => s.IsOwned == true).ToList();

                    shareList[0].IsOwned = false;
                    db.Boughts.Update(shareList[0]);

                    DateTime date = DateTime.Now;

                    Sold share = new Sold
                    {
                        DateAndTime = date,
                        Symbol = shareList[0].Symbol,
                        companyName = shareList[0].companyName,
                        latestPrice = rawShare.latestPrice,
                        NumOfShare = shareList[0].NumOfShare,
                        Cost = shareList[0].latestPrice,
                        Profit = rawShare.latestPrice - shareList[0].latestPrice,
                        AspNetUserId = user[0].Id
                    };

                    user[0].Fund = user[0].Fund + model.NumOfShare * (rawShare.latestPrice - shareList[0].latestPrice);

                    await userManager.UpdateAsync(user[0]);

                    db.Solds.Add(share);
                    db.SaveChanges();
                    message = "Sold!";

                    return Ok(new { message });
                }
                catch (HttpRequestException httpRequestException)
                {
                    return BadRequest(new { httpRequestException.Message });
                }
            }
        }

        [HttpGet]
        [Route("SoldShares")]
        public ActionResult SoldShares()
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            List<Sold> sharesSold = db.Solds.Where(s => s.AspNetUserId == userId).ToList();
            if (sharesSold != null)
            {
                return Ok(sharesSold);
            }
            return Ok(new { message = "You haven't sold any shares yet!" });
        }
    }
}