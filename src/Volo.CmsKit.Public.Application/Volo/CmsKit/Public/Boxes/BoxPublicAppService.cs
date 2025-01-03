using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.Extensions.Caching.Distributed;
using Volo.Abp.Caching;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Public.Boxes;
using Volo.Abp.Application.Dtos;
using System.Collections.Generic;

namespace Volo.CmsKit.Public.Boxes;

//[RequiresFeature(CmsKitFeatures.BoxEnable)]
//[RequiresGlobalFeature(typeof(BoxFeature))]
public class BoxPublicAppService : CmsKitPublicAppServiceBase, IBoxPublicAppService
{
    protected IBoxRepository BoxRepository { get; }
   // protected BoxManager BoxManager { get; }

    protected IDistributedCache<BoxCacheItem> BoxCache { get; }

    public BoxPublicAppService(
        IBoxRepository pageRepository,
        BoxManager pageManager,
        IDistributedCache<BoxCacheItem> pageCache)
    {
        BoxRepository = pageRepository;
       // BoxManager = pageManager;
        BoxCache = pageCache;
    }

    public virtual async Task<BoxDto> FindBySectionAsync(string section)
    {
        var cachedBox = await FindAndCacheBySectionAsync(section);

        if (cachedBox == null)
        {
            return null;
        }

        return ObjectMapper.Map<BoxCacheItem, BoxDto>(cachedBox);
    }

    
    public async Task<ListResultDto<BoxDto>> GetBoxItemsAsync(Guid boxId)
    {
        var box = await BoxRepository.FindAsync(boxId, includeDetails: true);
        var boxes = new List<Box>();
        if (box == null)
        {
            return new ListResultDto<BoxDto>();
        }
        boxes.Add(box);

        return new ListResultDto<BoxDto>(ObjectMapper.Map<List<Box>, List<BoxDto>>(boxes));
    }

    public async Task<BoxDto> GetBySectionAsync(string section)
    {
        var cachedBox = await FindAndCacheBySectionAsync(section);

        if (cachedBox == null)
        {
            return null;
        }

        return ObjectMapper.Map<BoxCacheItem, BoxDto>(cachedBox);
    }
    internal async Task<BoxCacheItem> FindAndCacheBySectionAsync2(string section)
    {
        var box = await BoxRepository.GetBySectionAsync(section, includeDetails: true);
        //var boxCacheItem1 = await BoxCache.GetAsync(BoxCacheItem.GetKey(section));
        var boxCacheItem = ObjectMapper.Map<Box, BoxCacheItem>(box);

        //var boxCacheItem = await BoxCache.GetOrAddAsync(BoxCacheItem.GetKey(section), async () =>
        //{
        //    var box = await BoxRepository.GetBySectionAsync(section, includeDetails: true);
        //    // If box is not found, cache it as null to prevent further queries.
        //    if (box is null)
        //    {
        //        return null;
        //    }

        //    return ObjectMapper.Map<Box, BoxCacheItem>(box);
        //});

        return boxCacheItem;
    }
    internal virtual async Task<BoxCacheItem> FindAndCacheBySectionAsync(string section)
    {
        var boxCacheItem = await BoxCache.GetOrAddAsync(BoxCacheItem.GetKey(section), async () =>
        {
            var box = await BoxRepository.GetBySectionAsync(section, includeDetails: true);
            // If box is not found, cache it as null to prevent further queries.
            if (box is null)
            {
                return null;
            }

            return ObjectMapper.Map<Box, BoxCacheItem>(box);
        });

        return boxCacheItem;
    }

    public async Task<PagedResultDto<BoxDto>> GetListAsync(BoxGetListInput input)
    {
        var count = await BoxRepository.GetCountAsync(input.Filter);

        var boxes = await BoxRepository.GetListAsync(
            input.Filter,
            input.MaxResultCount,
            input.SkipCount,
            input.Sorting,
            includeDetails: true
        );

        return new PagedResultDto<BoxDto>(
            count,
            ObjectMapper.Map<List<Box>, List<BoxDto>>(boxes)
        );
    }
}
