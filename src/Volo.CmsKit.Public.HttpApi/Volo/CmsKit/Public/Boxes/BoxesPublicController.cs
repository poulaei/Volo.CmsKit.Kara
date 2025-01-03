using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using static System.Collections.Specialized.BitVector32;

namespace Volo.CmsKit.Public.Boxes;

//[RequiresFeature(CmsKitFeatures.BoxEnable)]
//[RequiresGlobalFeature(typeof(BoxesFeature))]
[RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/boxes")]
public class BoxesPublicController : CmsKitPublicControllerBase, IBoxPublicAppService
{
    protected IBoxPublicAppService BoxAppService { get; }

    public BoxesPublicController(IBoxPublicAppService boxAppService)
    {
        BoxAppService = boxAppService;
    }

    [HttpGet]
    [Route("by-section")]
    public virtual Task<BoxDto> FindBySectionAsync([FromQuery] string section)
    {
        return BoxAppService.FindBySectionAsync(section);
    }
    [HttpGet]
    [Route("box-items-by-boxId")]
    public Task<ListResultDto<BoxDto>> GetBoxItemsAsync(Guid boxId)
    {
        return BoxAppService.GetBoxItemsAsync(boxId);
    }
    [HttpGet]
    [Route("box-by-section")]
    public Task<BoxDto> GetBySectionAsync(string section)
    {
        return BoxAppService.GetBySectionAsync(section);
    }
    [HttpGet]
    [Route("all")]
    public Task<PagedResultDto<BoxDto>> GetListAsync(BoxGetListInput input)
    {
        return BoxAppService.GetListAsync(input);
    }
}
