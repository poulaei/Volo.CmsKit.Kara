using System;
using System.Collections.Generic;
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

namespace Volo.CmsKit.Admin.GalleryImages;

[RequiresFeature(CmsKitFeatures.GalleryImageEnable)]
[RequiresGlobalFeature(typeof(GalleryImageFeature))]
[RemoteService(Name = CmsKitAdminRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitAdminRemoteServiceConsts.ModuleName)]
[Authorize(CmsKitAdminPermissions.GalleryImages.Default)]
[Route("api/cms-kit-admin/imageGallery")]
public class GalleryImagesAdminController : CmsKitAdminController, IGalleryImageAdminAppService
{
    protected readonly IGalleryImageAdminAppService GalleryImageAdminAppService;

    public GalleryImagesAdminController(IGalleryImageAdminAppService pageAdminAppService)
    {
        GalleryImageAdminAppService = pageAdminAppService;
    }
    [HttpPost]
    [Authorize(CmsKitAdminPermissions.GalleryImages.Create)]
    public Task<GalleryImageDto> CreateAsync(GalleryImageCreateUpdateDto input)
    {
        return GalleryImageAdminAppService.CreateAsync(input);
    }

    [HttpGet]
    [Route("{id}")]
    public Task<GalleryImageDto> GetAsync(Guid id)
    {
        return GalleryImageAdminAppService.GetAsync(id);
    }
    
    [HttpGet]
    public Task<PagedResultDto<GalleryImageDto>> GetListAsync(GalleryImageGetListInputDto input)
    {
        return GalleryImageAdminAppService.GetListAsync(input);
    }
    [HttpPost]
    [Route("{id}")]
    [Authorize(CmsKitAdminPermissions.GalleryImages.Update)]
    public Task<GalleryImageDto> UpdateAsync(Guid id, GalleryImageCreateUpdateDto input)
    {
        return GalleryImageAdminAppService.UpdateAsync(id, input);
    }
    [HttpDelete]
    [Authorize(CmsKitAdminPermissions.GalleryImages.Delete)]
    [Route("{id}")]
    public virtual Task DeleteAsync(Guid id)
    {
        return GalleryImageAdminAppService.DeleteAsync(id);
    }
}
