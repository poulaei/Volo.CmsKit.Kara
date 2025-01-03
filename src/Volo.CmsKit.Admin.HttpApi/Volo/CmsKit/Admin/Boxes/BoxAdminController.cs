using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Permissions;
using static System.Collections.Specialized.BitVector32;

namespace Volo.CmsKit.Admin.Boxes;

//[RequiresFeature(CmsKitFeatures.BoxEnable)]
//[RequiresGlobalFeature(typeof(BoxsFeature))]
[RemoteService(Name = CmsKitAdminRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitAdminRemoteServiceConsts.ModuleName)]
[Authorize(CmsKitAdminPermissions.Boxes.Default)]
[Route("api/cms-kit-admin/boxes")]
public class BoxAdminController : CmsKitAdminController, IBoxAdminAppService
{
    protected IBoxAdminAppService BoxAdminAppService { get; }

    public BoxAdminController(IBoxAdminAppService blogAdminAppService)
    {
        BoxAdminAppService = blogAdminAppService;
    }

    [HttpGet]
    [Route("{id}")]
    public Task<BoxDto> GetAsync(Guid id)
    {
        return BoxAdminAppService.GetAsync(id);
    }

    [HttpGet]
    public Task<PagedResultDto<BoxDto>> GetListAsync(BoxGetListInput input)
    {
        return BoxAdminAppService.GetListAsync(input);
    }
   
    [HttpPost]
    [Authorize(CmsKitAdminPermissions.Boxes.Create)]
    public Task<BoxDto> CreateAsync(CreateBoxDto input)
    {
        return BoxAdminAppService.CreateAsync(input);
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.Boxes.Update)]
    public Task<BoxDto> UpdateAsync(Guid id, UpdateBoxDto input)
    {
        return BoxAdminAppService.UpdateAsync(id, input);
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.Boxes.Delete)]
    public Task DeleteAsync(Guid id)
    {
        return BoxAdminAppService.DeleteAsync(id);
    }

    [HttpPost]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.Boxes.Delete)]
    [Route("hazf")]
    public Task<bool> HazfAsync(Guid id)
    {
        return BoxAdminAppService.HazfAsync(id);
    }
}
