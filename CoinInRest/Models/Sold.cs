using System;
namespace CoinInRest.Models
{
    public class Sold
    {
        public int Id { get; set; }
        public DateTime DateAndTime { get; set; }
        public string Symbol { get; set; }
        public string companyName { get; set; }
        public int NumOfShare { get; set; }
        public double latestPrice { get; set; }
        public double Cost { get; set; }
        public double Profit { get; set; }
        public string AspNetUserId { get; set; }
        public ApplicationUser AspNetUser { get; set; }


        public Sold(string symbol, string company, int share, double price, double cost, double profit, DateTime dateTime)
        {
            DateAndTime = dateTime;
            Symbol = symbol;
            companyName = company;
            NumOfShare = share;
            latestPrice = price;
            Cost = cost;
            Profit = profit;
        }

        public Sold()
        {
        }
    }
}