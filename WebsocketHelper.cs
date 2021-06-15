using System;
using System.Linq;
using System.Runtime.CompilerServices;
using Newtonsoft.Json.Linq;
using WebSocketSharp.Server;

namespace NinjaTrader.Custom
{
    class WebsocketHelper
    {
        public static event EventHandler<SpeedometerParameter> NewMessage;
        private static bool wasInitialized = false;

        private static void Init()
        {
            var wsEndpoint = "ws://127.0.0.1:1111";

            var server = new WebSocketServer(int.Parse(wsEndpoint.Split(':').Last()));
            server.AddWebSocketService<SpeedoWebService>("/WService");
            server.Start();
        }

        public static void SendMessage(SpeedometerParameter value)
        {
            if (!wasInitialized)
            {
                Init();
            }

            if (NewMessage != null)
            {
                NewMessage.Invoke(value, value);
            }
        }

    }


    public class SpeedoWebService : WebSocketBehavior
    {
        private static bool alreadyConnected = false;

        public SpeedoWebService()
        {
            if (!alreadyConnected)
            {
                alreadyConnected = true;
                WebsocketHelper.NewMessage += NewMessageReceived;
            }
        }

        protected override void OnOpen()
        {

        }

        private void NewMessageReceived(object sender, SpeedometerParameter e)
        {
            try
            {
                if (this.State == WebSocketSharp.WebSocketState.Open)
                {                    
                    this.Send(JObject.FromObject(e).ToString());
                }
            }
            catch (Exception)
            {

            }
        }
    }
}
