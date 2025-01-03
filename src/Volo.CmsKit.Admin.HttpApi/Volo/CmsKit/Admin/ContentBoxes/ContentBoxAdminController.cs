using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Permissions;
using static System.Collections.Specialized.BitVector32;

namespace Volo.CmsKit.Admin.ContentBoxes;

//[RequiresFeature(CmsKitFeatures.ContentBoxEnable)]
//[RequiresGlobalFeature(typeof(ContentBoxsFeature))]
[RemoteService(Name = CmsKitAdminRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitAdminRemoteServiceConsts.ModuleName)]
[Authorize(CmsKitAdminPermissions.ContentBoxes.Default)]
[Route("api/cms-kit-admin/contentBoxes")]
public class ContentBoxAdminController : CmsKitAdminController, IContentBoxAdminAppService
{
    protected IContentBoxAdminAppService ContentBoxAdminAppService { get; }

    public ContentBoxAdminController(IContentBoxAdminAppService blogAdminAppService)
    {
        ContentBoxAdminAppService = blogAdminAppService;
    }

    [HttpGet]
    [Route("{id}")]
    public Task<ContentBoxDto> GetAsync(Guid id)
    {
        return ContentBoxAdminAppService.GetAsync(id);
    }

    [HttpGet]
    public Task<PagedResultDto<ContentBoxDto>> GetListAsync(ContentBoxGetListInput input)
    {
        return ContentBoxAdminAppService.GetListAsync(input);
    }
   
    [HttpPost]
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Create)]
    public Task<ContentBoxDto> CreateAsync(CreateContentBoxDto input)
    {
        return ContentBoxAdminAppService.CreateAsync(input);
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Update)]
    public Task<ContentBoxDto> UpdateAsync(Guid id, UpdateContentBoxDto input)
    {
        return ContentBoxAdminAppService.UpdateAsync(id, input);
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Delete)]
    public Task DeleteAsync(Guid id)
    {
        return ContentBoxAdminAppService.DeleteAsync(id);
    }

    [HttpPost]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Delete)]
    [Route("hazf")]
    public Task<bool> HazfAsync(Guid id)
    {
        return ContentBoxAdminAppService.HazfAsync(id);
    }
    [HttpPost]
    [Route("move/{idx}")]
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Update)]
    public Task MoveContentBoxAsync(Guid id, ContentBoxMoveInput input)
    {
        return ContentBoxAdminAppService.MoveContentBoxAsync(id,input);
    }
}
