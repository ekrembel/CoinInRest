using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CoinInRest.Data;
using CoinInRest.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoinInRest.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationSettings appSettings;
        private readonly CoinDbContext db;

        public UserController(UserManager<ApplicationUser> userManager,
                                SignInManager<ApplicationUser> signInManager,
                                IOptions<ApplicationSettings> appSettings,
                                CoinDbContext dbContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.appSettings = appSettings.Value;
            db = dbContext;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> CreateAccount(UserModel model)
        {
            if (model != null)
            {
                ApplicationUser newUser = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    EmailConfirmed = true,
                    Fund = 10000
                };

                var result = await userManager.CreateAsync(newUser, model.Password);
                return Ok(result);

            }
            return BadRequest();

        }


    
        [HttpPost]
        [Route("Login")]
        // Post: /api/User/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }
            else
            {
                var user = await userManager.FindByNameAsync(model.UserName);

                if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                       new Claim("Id", user.Id.ToString()),
                       new Claim("Username", user.UserName)
                        }),
                        Expires = DateTime.UtcNow.AddDays(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);
                    return Ok(new { token });
                }
                else
                {
                    return BadRequest(new { message = "Username or password is incorrect!" });
                }
            }
            
        }


        //[HttpGet]
        //[Route("DelAll")]
        //public Object DelAll()
        //{
        //    List<Company> companies = db.Companies.ToList();
        //    if (companies.Count > 0)
        //    {
        //        foreach (Company company in companies)
        //        {
        //            db.Companies.Remove(company);

                    
        //        }
        //        db.SaveChanges();
        //        return new { message = "deleted" };
        //    }
        //    return new { message = "Failed" };
        //}


        //[HttpGet]
        //[Route("Load")]
        //public IActionResult Load()
        //{
        //    List<Company> companies = CompanyData.Companies();
        //    foreach (Company viewModel in companies)
        //    {
        //        Company company = new Company
        //        {
        //            Symbol = viewModel.Name,
        //            Name = viewModel.Symbol
        //        };

        //        db.Companies.Add(company);
        //    }
        //    db.SaveChanges();
        //    return Ok();
        //}

        //[HttpGet]
        //[Route("Del")]
        //public async Task<Object> Del()
        //{
        //    List<Company> companies = db.Companies.ToList();
        //    if (companies.Count > 0)
        //    {
        //        foreach (Company company in companies)
        //        {
        //            using (var client = new HttpClient())
        //            {
        //                client.BaseAddress = new Uri("https://cloud-sse.iexapis.com");
        //                var response = await client.GetAsync($"/stable/stock/{company.Symbol}/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e");

        //                var stringResult = await response.Content.ReadAsStringAsync();
        //                if (stringResult == "Unknown symbol")
        //                {
        //                    db.Companies.Remove(company);
        //                }

        //            }
        //        }
        //        db.SaveChanges();
        //        return Ok(new { message = "deleted" });
        //    }
        //    return BadRequest(new { message = "failed" });
        //}
    }
}
