using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Assess_23_10_24_Backend.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }

}
