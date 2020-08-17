using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoinInRest.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoinInRest.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly CoinDbContext db;

        public UserProfileController(UserManager<ApplicationUser> userManager, CoinDbContext dbContext, SignInManager<ApplicationUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            db = dbContext;
        }

        [HttpGet]
        public async Task<Object> GetUserProfile()
        {

            string userId = User.Claims.First(c => c.Type == "Id").Value;
            var user = await userManager.FindByIdAsync(userId);
            if (user != null)
            {
                return new
                {
                    user.UserName,
                    user.Email,
                    user.Fund
                };
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("AddFund")]
        public async Task<Object> AddFund(ApplicationUser model)
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            List<ApplicationUser> users = db.ApplicationUsers.Where(au => au.Id == userId).ToList();
            if (users.Count() > 0)
            {
                ApplicationUser user = users[0];
                user.Fund = user.Fund + model.Fund;
                var result = await userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    string messageSuccess = "The amount has been added to your fund.";
                    return Ok(new { messageSuccess });
                }
                else
                {
                    return BadRequest(new { message = "Failed while adding" });
                }
            }
            return BadRequest(new { message = "Unable to find the user info." });
        }

        [HttpPost]
        [Route("UpdatePassword")]
        public async Task<Object> UpdatePassword(UserModel model)
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            List<ApplicationUser> users = db.ApplicationUsers.Where(au => au.Id == userId).ToList();
            ApplicationUser theUser = users[0];
            var result = await userManager.CheckPasswordAsync(theUser, model.Password);

            if (result)
            {
                var resultUpdate = await userManager.ChangePasswordAsync(theUser, model.Password, model.NewPassword);
                if (resultUpdate.Succeeded)
                {

                    string message = "Congrats! Your password has been updated.";
                    return Ok(new { message });
                }
                else
                {
                    return BadRequest(new { message = "Failed while updating." });
                }
            }
            return BadRequest(new { message = "Unable to authenticate the user" });
        }

        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<Object> ForgotPassword(UserModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user != null && await userManager.IsEmailConfirmedAsync(user))
            {
                string email = model.Email;
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResetLink = Url.Action("SetPassword", "Sell", new { email = email, token = token }, Request.Scheme);

                string[] data = { email, token };
                return Ok(new { data });

            }
            else
            {

                string message = "Your email has not been confirmed yet.";
                return BadRequest(new { message });
            }
        }

        [HttpPost]
        [Route("ResetPassword")]
        public async Task<Object> ResetPassword(UserModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {

                string message = "Congrats! Your password has been reset.";
                return Ok(new { message });
            }
            else
            {
                return BadRequest(new { message = "Failed. Unable to authenticate the user." });
            }
        }

        [HttpPost]
        [Route("DeleteAccount")]
        public async Task<Object> DeleteAccount(UserModel model)
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            List<ApplicationUser> users = db.ApplicationUsers.Where(au => au.Id == userId).ToList();
            if (users.Count() > 0)
            {
                Feedback feedback = new Feedback
                {
                    Reason = model.Feedback
                };
                db.Feedbacks.Add(feedback);

                ApplicationUser user = users[0];

                List<Bought> boughts = db.Boughts.Where(b => b.AspNetUserId == userId).ToList();
                foreach (Bought share in boughts)
                {
                    db.Boughts.Remove(share);
                }

                List<Sold> solds = db.Solds.Where(b => b.AspNetUserId == userId).ToList();
                foreach (Sold share in solds)
                {
                    db.Solds.Remove(share);
                }
                db.ApplicationUsers.Remove(user);
                db.SaveChanges();
                await signInManager.SignOutAsync();
                string message = "We're sorry to see you go!";
                return Ok(new { message });
            }
            else
            {
                return BadRequest(new { message = "Failed. Please try again." });
            }
        }
    }
}
