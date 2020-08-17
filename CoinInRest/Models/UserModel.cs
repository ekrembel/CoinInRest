using System;
namespace CoinInRest.Models
{
    public class UserModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
        public string Feedback { get; set; }




        public UserModel()
        {
        }
    }
}
