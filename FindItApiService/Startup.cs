using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(FindItApiService.Startup))]

namespace FindItApiService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureMobileApp(app);
        }
    }
}