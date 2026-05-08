using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;




namespace App_test
{
    public class HSK
    {
        public string simplified { get; set; }
        public int frequency { get; set; }

    }
    
    internal class Load_hsk
    {
        string file = "complete.json";
        List<HSK> listhsk = new List<HSK>();

        public  List<HSK> GetHSK()
        {
           
            var jsondata = File.ReadAllText(file);
            Console.Write(GetType(jsondata[0]));
            var option = new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
            };
            listhsk = JsonSerializer.Deserialize<List<HSK>>(jsondata, option);

 
            
            return listhsk;
        }

    }
} 
