using Microsoft.AspNetCore.Antiforgery;
using ManufactureSys.Controllers;

namespace ManufactureSys.Web.Host.Controllers
{
    public class AntiForgeryController : ManufactureSysControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
