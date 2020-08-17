using System;
namespace CoinInRest.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }

        public Company(string symbol, string name)
        {
            Symbol = symbol;
            Name = name;
        }

        public Company()
        {
        }
    }
}
