using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Volo.Abp.Auditing;

namespace Volo.CmsKit.Public.AntiForgery;

[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/[action]")]
[DisableAuditing]
//[RemoteService(false)]
[ApiExplorerSettings(IgnoreApi = false)]
public class AntiForgeryController : CmsKitPublicControllerBase
{
    private readonly IAbpAntiForgeryManager AntiForgeryManager;

    public AntiForgeryController(IAbpAntiForgeryManager antiForgeryManager)
    {
        AntiForgeryManager = antiForgeryManager;



    }

    //public string GenerateToken()
    //{
    //    return AntiForgeryManager.GenerateToken();
    //}

    //public void SetCookie()
    //{
    //    AntiForgeryManager.SetCookie();
    //}

    [HttpGet]
    public virtual void SetCsrfCookie()
    {
        AntiForgeryManager.SetCookie();
    }
}
