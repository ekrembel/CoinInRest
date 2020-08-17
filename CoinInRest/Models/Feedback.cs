using System;
namespace CoinInRest.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public string Reason { get; set; }

        public Feedback(string reason)
        {
            Reason = reason;
        }

        public Feedback()
        {
        }
    }
}
