using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoinInRest.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoinInRest.Controllers
{
    [Route("api/[controller]")]
    public class BoughtsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly CoinDbContext db;

        public BoughtsController(UserManager<ApplicationUser> userManager, CoinDbContext dbContext)
        {
            this.userManager = userManager;
            db = dbContext;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            List<Company> companies = db.Companies.OrderBy(c => c.Symbol).ToList();

            if (companies != null)
            {
                return Ok(new { message = "Success"});
            }
            else
            {
                return BadRequest(new { message = "Unable to retrive data from database." });
            }
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
