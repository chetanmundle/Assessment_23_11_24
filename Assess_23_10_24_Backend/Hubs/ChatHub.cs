using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Assess_23_10_24_Backend.Hubs
{

    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine("User : " + user);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }

}
