using System;
namespace CoinInRest.Models
{
    public class QuoteModel
    {
        public string Symbol { get; set; }
        public string companyName { get; set; }
        public double latestPrice { get; set; }

        public QuoteModel(string symbol, string name, double price)
        {
            Symbol = symbol;
            companyName = name;
            latestPrice = price;
        }

        public QuoteModel()
        {
        }
    }
}