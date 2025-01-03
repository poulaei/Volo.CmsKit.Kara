
using System.Linq.Dynamic.Core;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Comments;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Public;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Contents;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.CmsKit.GalleryImages;
using Volo.Abp.Caching;
using System.Linq;
using System;
using Volo.Abp.Application.Dtos;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Public.ContentBoxes;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace CmsKitDemo.Services;
[RequiresFeature(CmsKitFeatures.GalleryImageEnable)]
[RequiresGlobalFeature(typeof(GalleryImageFeature))]
[RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/imageGallery")]
public class GalleryImagePublicController : CmsKitPublicControllerBase, IGalleryImagePublicAppService
{
    protected IGalleryImagePublicAppService GalleryImageAppService { get; }

    public GalleryImagePublicController(IGalleryImagePublicAppService galleryImageAppService)
    {
        GalleryImageAppService = galleryImageAppService;
    }
    [HttpGet]
    [Route("detailedList")]
    public async Task<List<GalleryImageWithDetailsDto>> GetDetailedListAsync()
    {

        return await GalleryImageAppService.GetDetailedListAsync();
    }
    [HttpGet]
    [Route("by-id")]
    public async Task<GalleryImageCommonDto> GetAsync(Guid id)
    {
        return await GalleryImageAppService.GetAsync(id);
    }
    [HttpGet]
    public Task<PagedResultDto<GalleryImageCommonDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        throw new NotImplementedException();
    }
}

