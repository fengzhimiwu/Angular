using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace ManufactureSys.Web.Host.Startup
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                // 允许服务器
                .UseKestrel().UseUrls("http://*:9091")
                .UseStartup<Startup>()
                .Build();
        }
    }
}
