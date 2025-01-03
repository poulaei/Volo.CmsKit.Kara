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

namespace Volo.CmsKit.Admin.Boxes;

//[RequiresFeature(CmsKitFeatures.BlogEnable)]
//[RequiresGlobalFeature(typeof(BlogsFeature))]
[RemoteService(Name = CmsKitAdminRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitAdminRemoteServiceConsts.ModuleName)]
[Authorize(CmsKitAdminPermissions.BoxItems.Default)]
[Route("api/cms-kit-admin/boxes/box-items")]
public class BoxItemAdminController : CmsKitAdminController, IBoxItemAdminAppService
{
    protected readonly IBoxItemAdminAppService BoxItemAdminAppService;

    public BoxItemAdminController(IBoxItemAdminAppService blogPostAdminAppService)
    {
        BoxItemAdminAppService = blogPostAdminAppService;
    }

    [HttpPost]
    [Authorize(CmsKitAdminPermissions.BoxItems.Create)]
    public virtual Task<BoxItemDto> CreateAsync(CreateBoxItemDto input)
    {
        return BoxItemAdminAppService.CreateAsync(input);
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.BoxItems.Delete)]
    public virtual Task DeleteAsync(Guid id)
    {
        return BoxItemAdminAppService.DeleteAsync(id);
    }

    [HttpGet]
    [Route("{id:Guid}")]
    [Authorize(CmsKitAdminPermissions.BoxItems.Default)]
    public virtual Task<BoxItemDto> GetAsync(Guid id)
    {
        return BoxItemAdminAppService.GetAsync(id);
    }

    [HttpGet]
    [Authorize(CmsKitAdminPermissions.BoxItems.Default)]
    public virtual Task<PagedResultDto<BoxItemDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        return BoxItemAdminAppService.GetListAsync(input);
    }


    [HttpPost]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.BoxItems.Delete)]
    [Route("hazf")]
    public Task<bool> HazfAsync(Guid id)
    {
        return BoxItemAdminAppService.HazfAsync(id);

    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.BoxItems.Update)]
    public virtual Task<BoxItemDto> UpdateAsync(Guid id, UpdateBoxItemDto input)
    {
        return BoxItemAdminAppService.UpdateAsync(id, input);
    }

    

   
}