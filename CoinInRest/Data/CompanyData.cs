using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using CoinInRest.Models;

namespace CoinInRest.Data
{
    public class CompanyData
    {

        static private string DataFile = "Data/StockMarketSymbols.csv";
        static bool IsDataLoaded = false;

        static List<Company> CompanyList;

        static public List<Company> Companies()
        {
            LoadData();
            return new List<Company>(CompanyList);
        }

        static private void LoadData()
        {
            if (IsDataLoaded)
            {
                return;
            }

            List<string[]> rows = new List<string[]>();


            using (StreamReader reader = File.OpenText(DataFile))
            {
                while (reader.Peek() >= 0)
                {
                    string line = reader.ReadLine();
                    string[] rowArray = CSVRowToStringArray(line);
                    if (rowArray.Length > 0)
                    {
                        rows.Add(rowArray);
                    }
                }
            }

            string[] headers = rows[0];
            rows.Remove(headers);

            CompanyList = new List<Company>();

            // Parse each row array 
            foreach (string[] row in rows)
            {

                string aName = row[1];
                string aSymbol = row[2];

                Company newCompany = new Company(aName, aSymbol);

                CompanyList.Add(newCompany);
            }

            IsDataLoaded = true;
        }

        private static string[] CSVRowToStringArray(string row, char fieldSeparator = ',', char stringSeparator = '\"')
        {
            bool isBetweenQuotes = false;
            StringBuilder valueBuilder = new StringBuilder();
            List<string> rowValues = new List<string>();

            // Loop through the row string one char at a time
            foreach (char c in row.ToCharArray())
            {
                if ((c == fieldSeparator && !isBetweenQuotes))
                {
                    rowValues.Add(valueBuilder.ToString());
                    valueBuilder.Clear();
                }
                else
                {
                    if (c == stringSeparator)
                    {
                        isBetweenQuotes = !isBetweenQuotes;
                    }
                    else
                    {
                        valueBuilder.Append(c);
                    }
                }
            }

            // Add the final value
            rowValues.Add(valueBuilder.ToString());
            valueBuilder.Clear();

            return rowValues.ToArray();
        }

        public CompanyData()
        {
        }
    }
}
