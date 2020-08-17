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
    [Authorize]
    public class BoughtController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly CoinDbContext db;

        public BoughtController(UserManager<ApplicationUser> userManager, CoinDbContext dbContext)
        {
            this.userManager = userManager;
            db = dbContext;
        }

        [HttpGet]
        public ActionResult GetShareDetails()
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            List<Bought> boughts = db.Boughts.Where(b => b.AspNetUserId == userId).Where(b => b.IsOwned == true).ToList();
            if (boughts.Count() > 0)
            {
                return Ok(boughts);
            }
            else
            {
                return BadRequest(new { message = "You have no shares!" });
            }

        }


    }
}