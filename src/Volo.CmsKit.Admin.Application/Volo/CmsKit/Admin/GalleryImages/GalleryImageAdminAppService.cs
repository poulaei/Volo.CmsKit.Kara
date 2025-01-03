using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectMapping;
using Volo.CmsKit;
using Volo.CmsKit.Admin.GalleryImages;
using Volo.CmsKit.Admin.Pages;
using Volo.CmsKit.Comments;
using Volo.CmsKit.Features;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Permissions;
using Volo.CmsKit.Reactions;

namespace Volo.CmsKit.Admin.GalleryImages;
/// <summary>
/// Added By Poolaei @1402/11/27
/// </summary>
[RequiresFeature(CmsKitFeatures.GalleryImageEnable)]
[RequiresGlobalFeature(typeof(GalleryImageFeature))]
[Authorize(CmsKitAdminPermissions.GalleryImages.Default)]
public class GalleryImageAdminAppService : CmsKitAdminAppServiceBase, IGalleryImageAdminAppService
{
    protected IGalleryImageRepository GalleryImageRepository { get; }
    protected GalleryImageManager GalleryImageManager { get; }
    protected ICommentRepository CommentRepository { get; }
    protected IUserReactionRepository UserReactionRepository { get; }

    public GalleryImageAdminAppService(IGalleryImageRepository galleryImageRepository,GalleryImageManager galleryImageManager)
    {
       // CreatePolicyName = CmsKitDemoPermissions.GalleryImage.Create;
        //UpdatePolicyName = CmsKitDemoPermissions.GalleryImage.Update;
        //DeletePolicyName = CmsKitDemoPermissions.GalleryImage.Delete;
        GalleryImageRepository = galleryImageRepository;
        GalleryImageManager = galleryImageManager;
    }

    [Authorize(CmsKitAdminPermissions.GalleryImages.Create)]
    public virtual async Task<GalleryImageDto> CreateAsync(GalleryImageCreateUpdateDto input)
    {
        var galleryImage = await GalleryImageManager.CreateAsync(input.CoverImageMediaId, input.Description);


        input.MapExtraPropertiesTo(galleryImage);
        await GalleryImageRepository.InsertAsync(galleryImage);

        //await GalleryImageCache.RemoveAsync(GalleryImageCacheItem.GetKey(galleryImage.Slug));

        return ObjectMapper.Map<GalleryImage, GalleryImageDto>(galleryImage);
    }


    [Authorize(CmsKitAdminPermissions.GalleryImages.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var galleryImage = await GalleryImageRepository.GetAsync(id);
       
        await GalleryImageRepository.DeleteAsync(galleryImage);
        //await GalleryImageCache.RemoveAsync(GalleryImageCacheItem.GetKey(galleryImage.Slug));
    }

    public virtual async Task<GalleryImageDto> GetAsync(Guid id)
    {
        var galleryImage = await GalleryImageRepository.GetAsync(id);
        return ObjectMapper.Map<GalleryImage, GalleryImageDto>(galleryImage);
    }

    public virtual async Task<PagedResultDto<GalleryImageDto>> GetListAsync(GalleryImageGetListInputDto input)
    {
        var count = await GalleryImageRepository.GetCountAsync();

        var galleryImages = await GalleryImageRepository.GetListAsync();

        return new PagedResultDto<GalleryImageDto>(
            count,
            ObjectMapper.Map<List<GalleryImage>, List<GalleryImageDto>>(galleryImages)
        );
    }


    [Authorize(CmsKitAdminPermissions.GalleryImages.Update)]
    public virtual async Task<GalleryImageDto> UpdateAsync(Guid id, GalleryImageCreateUpdateDto input)
    {
        var galleryImage = await GalleryImageRepository.GetAsync(id);
       
        //await GalleryImageCache.RemoveAsync(GalleryImageCacheItem.GetKey(galleryImage.Slug));

       input.MapExtraPropertiesTo(galleryImage);

        await GalleryImageRepository.UpdateAsync(galleryImage);

        return ObjectMapper.Map<GalleryImage, GalleryImageDto>(galleryImage);
    }


}

