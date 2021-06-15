using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaTrader.Custom
{
    public class SpeedometerParameter
    {
        //Speedo Settings
        public string Name { get; set; }
        public float MinValue { get; set; }
        public float MaxValue { get; set; }

        //Speedo Value
        public float Value { get; set; }
    }
}
