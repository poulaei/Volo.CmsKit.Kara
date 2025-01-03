
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

namespace CmsKitDemo.Services;
[RequiresFeature(CmsKitFeatures.GalleryImageEnable)]
[RequiresGlobalFeature(typeof(GalleryImageFeature))]
public class GalleryImagePublicAppService : CmsKitPublicAppServiceBase, IGalleryImagePublicAppService
{
    protected IGalleryImageRepository GalleryImageRepository { get; }
    protected ICommentRepository CommentRepository { get; }
    protected IUserReactionRepository UserReactionRepository { get; }
    public GalleryImagePublicAppService(
        IGalleryImageRepository galleryImageRepository,
        ICommentRepository  commentRepository,
        IUserReactionRepository userReactionRepository 
        //IDistributedCache<ContentBoxCacheItem> boxCache,
        //IDistributedCache<List<ContentBoxDto>> distributedCache
        )
    {
        GalleryImageRepository = galleryImageRepository;
        CommentRepository = commentRepository;
        UserReactionRepository  = userReactionRepository;
        // ContentBoxCache = boxCache;
        // DistributedCache = distributedCache;
    }
    public async Task<List<GalleryImageWithDetailsDto>> GetDetailedListAsync()
    {
        var images = await GalleryImageRepository.GetListAsync();
        return images.Select(x => new GalleryImageWithDetailsDto
        {
            Id = x.Id,
            Description = x.Description,
            CoverImageMediaId = x.CoverImageMediaId,
            CommentCount = (int)Task.Run(() => CommentRepository.GetCountAsync(entityType: GalleryImageConsts.EntityType, entityId: x.Id.ToString())).Result,
            LikeCount = (int)Task.Run(() => UserReactionRepository.GetCountAsync(entityType: GalleryImageConsts.EntityType, entityId: x.Id.ToString())).Result,

        }).ToList();
    }

    public async Task<GalleryImageCommonDto> GetAsync(Guid id)
    {
        var image = await GalleryImageRepository.GetAsync(id);
        if (image is null)
        {
            return null;
        }

        return ObjectMapper.Map<GalleryImage, GalleryImageCommonDto>(image);
    }

    public Task<PagedResultDto<GalleryImageCommonDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        throw new NotImplementedException();
    }
}

