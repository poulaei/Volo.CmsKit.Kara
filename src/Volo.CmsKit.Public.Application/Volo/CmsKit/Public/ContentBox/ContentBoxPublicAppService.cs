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
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Public.ContentBoxes;
using Volo.Abp.Application.Dtos;
using System.Collections.Generic;
using Volo.CmsKit.Menus;
using Volo.Abp.ObjectMapping;
using Volo.CmsKit.Boxes;
using System.Linq;

namespace Volo.CmsKit.Public.ContentBoxes;

[RequiresFeature(CmsKitFeatures.ContentBoxEnable)]
[RequiresGlobalFeature(typeof(ContentBoxFeature))]
public class ContentBoxPublicAppService : CmsKitPublicAppServiceBase, IContentBoxPublicAppService
{
    protected IContentBoxRepository ContentBoxRepository { get; }
    protected IDistributedCache<ContentBoxCacheItem> ContentBoxCache { get; }
    protected IDistributedCache<List<ContentBoxCommonDto>> DistributedCache { get; }
    public ContentBoxPublicAppService(
        IContentBoxRepository contentBoxRepository,
        IDistributedCache<ContentBoxCacheItem> boxCache,
        IDistributedCache<List<ContentBoxCommonDto>> distributedCache)
    {
        ContentBoxRepository = contentBoxRepository;
        ContentBoxCache = boxCache;
        DistributedCache = distributedCache;
    }

    public  async Task<ContentBoxCommonDto> GetAsync(Guid id)
    {
        var cachedContentBox = await FindAndCacheByIdAsync(id);
        if (cachedContentBox == null)
        {
            return null;
        }
        return ObjectMapper.Map<ContentBoxCacheItem, ContentBoxCommonDto>(cachedContentBox);
    }

    public async Task<ListResultDto<ContentBoxCommonDto>> GetByParentAsync(Guid? parentId)
    {
        var items = await ContentBoxRepository.GetByParentAsync(parentId, includeDetails: true);

        return new ListResultDto<ContentBoxCommonDto>(ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items));
    }
   
    public async Task<ContentBoxCommonDto> GetBySectionAsync(string section)
    {
        var cachedContentBox = await FindAndCacheBySectionAsync(section);
        //var cachedContentBox = await ContentBoxRepository.GetBySectionAsync(section);

        if (cachedContentBox == null)
        {
            return null;
        }

        return ObjectMapper.Map<ContentBoxCacheItem, ContentBoxCommonDto>(cachedContentBox);
       // return ObjectMapper.Map<ContentBox, ContentBoxDto>(cachedContentBox);
    }

    internal virtual async Task<ContentBoxCacheItem> FindAndCacheByIdAsync(Guid  id)
    {
        var boxCacheItem = await ContentBoxCache.GetOrAddAsync(ContentBoxCacheItem.GetKey(id), async () =>
        {
            var box = await ContentBoxRepository.GetAsync(id);
            // If box is not found, cache it as null to prevent further queries.
            if (box is null)
            {
                return null;
            }

            return ObjectMapper.Map<ContentBox, ContentBoxCacheItem>(box);
        });

        return boxCacheItem;
    }
    internal virtual async Task<ContentBoxCacheItem> FindAndCacheBySectionAsync(string section)
    {
        var boxCacheItem = await ContentBoxCache.GetOrAddAsync(ContentBoxCacheItem.GetSectionKey(section), async () =>
        {
            var box = await ContentBoxRepository.GetBySectionAsync(section, includeDetails: true);
            // If box is not found, cache it as null to prevent further queries.
            if (box is null)
            {
                return null;
            }

            return ObjectMapper.Map<ContentBox, ContentBoxCacheItem>(box);
        });

        return boxCacheItem;
    }

     public async Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync()
    {

        var cachedItems = await DistributedCache.GetOrAddAsync(
           ContentBoxApplicationConsts.ContentBoxCacheKey,
           async () =>
           {
               var items = await ContentBoxRepository.GetListAsync();

               if (items == null)
               {
                   return new();
               }

               return ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items);
           });
        var count = await ContentBoxRepository.GetCountAsync();
       
        return new PagedResultDto<ContentBoxCommonDto>(count, cachedItems);

    }

    public async Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync(ContentBoxGetListInput input)
    {

        var count = await ContentBoxRepository.GetCountAsync(input.Filter);
        var items = await ContentBoxRepository.GetListAsync(
            input.Filter,
            input.MaxResultCount,
            input.SkipCount,
            input.Sorting
           // includeDetails: true
        );
        return new PagedResultDto<ContentBoxCommonDto>(count, ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items));

    }

    public async Task<List<HierarchyNode<ContentBoxCommonDto>>> GetHierarchyAsync()
    {
        var cachedItem = await DistributedCache.GetOrAddAsync(ContentBoxApplicationConsts.ContentBoxCacheKey,
            async () =>
            {
                var items = await ContentBoxRepository.GetListAsync();

                if (items == null)
                {
                    return new();
                }

                return ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items);//.AsHierarchy(m => m.Id, m => m.PageId);
            });

        //var menuItems = await MenuItemRepository.GetListAsync();
        //var cachedMenu =  ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);

        var hm = cachedItem.AsHierarchy(m => m.Id, m => m.ParentId);
        return hm.ToList();// ObjectMapper.Map<List<RoyanMenuItemDto>, List<HierarchyNode<RoyanMenuItemDto>>>(hm);
    }
    /// <summary>
    /// همه کانتنت باکس ها با ساختار درختی بدون فیلد محتوا
    /// </summary>
    /// <returns></returns>
    public async Task<List<ContentBoxTree>> GetTreeAsync()
    {
        var cachedItem = await DistributedCache.GetOrAddAsync(ContentBoxApplicationConsts.ContentBoxCacheKey,
            async () =>
            {
                var items = await ContentBoxRepository.GetListAsync();

                if (items == null)
                {
                    return new();
                }

                return ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items);
            });

        var tree = LinqToObjectsExtensionMethods.FlatToTree(cachedItem, null);
        return tree;
    }

    

    public async Task<List<ContentBoxTree>> GetTreeAsync(Guid id)
    {
        //var cachedItem = await DistributedCache.GetOrAddAsync(ContentBoxApplicationConsts.ContentBoxCacheKey,
        //    async () =>
        //    {
        //        var items = await ContentBoxRepository.GetListAsync(id);

        //        if (items == null)
        //        {
        //            return new();
        //        }

        //        return ObjectMapper.Map<List<ContentBox>, List<ContentBoxDto>>(items);//.AsHierarchy(m => m.Id, m => m.PageId);
        //    });

        var items = await ContentBoxRepository.GetHierarchyAsync(id);
        var cachedItem = ObjectMapper.Map<List<HierarchyNode<ContentBox>>, List<HierarchyNode<ContentBoxCommonDto>>>(items);
        var tree = LinqToObjectsExtensionMethods.HierarchyToTree(cachedItem);
        return tree;
    }

    public async Task<List<ContentBoxTree>> GetTreeBySectionAsync([NotNull] string section)
    {
        var items = await ContentBoxRepository.GetHierarchyBySectionAsync(section);
        var cachedItem = ObjectMapper.Map<List<HierarchyNode<ContentBox>>, List<HierarchyNode<ContentBoxCommonDto>>>(items);
        var tree = LinqToObjectsExtensionMethods.HierarchyToTree(cachedItem);
        return tree;
    }
    public async Task<List<ContentBoxTree>> GetTreeAsync_Bad(Guid id)
    {
        var items = await ContentBoxRepository.GetListAsync();
        var cachedItem = ObjectMapper.Map<List<ContentBox>, List<ContentBoxCommonDto>>(items);
        var tree = LinqToObjectsExtensionMethods.FlatToTree1(cachedItem, null);
        return tree.Where(t => t.Id == id).ToList();
    }

   
}
