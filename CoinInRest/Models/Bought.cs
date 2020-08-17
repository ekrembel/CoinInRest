using System;
using System.ComponentModel.DataAnnotations;

namespace CoinInRest.Models
{
    public class Bought
    {
        [Key]
        public int Id { get; set; }
        public string TransactionType { get; set; }
        public DateTime DateAndTime { get; set; }
        public string Symbol { get; set; }
        public string companyName { get; set; }
        public int NumOfShare { get; set; }
        public double latestPrice { get; set; }
        public bool IsOwned { get; set; }
        public string AspNetUserId { get; set; }
        public ApplicationUser AspNetUser { get; set; }

        public Bought(string symbol, string company, int share, double price, bool isOwned, string type, DateTime dateTime)
        {
            TransactionType = type;
            DateAndTime = dateTime;
            Symbol = symbol;
            companyName = company;
            NumOfShare = share;
            latestPrice = price;
            IsOwned = isOwned;
        }

        public Bought()
        {
        }
    }
}
