using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Caching;
using Volo.Abp.Data;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.ObjectExtending;
using Volo.CmsKit.Admin;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Permissions;

namespace Volo.CmsKit.Admin.Boxes;

//[RequiresFeature(CmsKitFeatures.BoxEnable)]
//[RequiresGlobalFeature(typeof(BoxFeature))]
[Authorize(CmsKitAdminPermissions.Boxes.Default)]
public class BoxAdminAppService : CmsKitAdminAppServiceBase, IBoxAdminAppService
{
    private IBoxRepository BoxRepository { get; }
    protected BoxManager BoxManager { get; }
    protected IDistributedCache<BoxCacheItem> BoxCache { get; }
    public BoxAdminAppService(IBoxRepository boxItemRepository, BoxManager boxManager, IDistributedCache<BoxCacheItem> boxCache)
    {
        BoxRepository = boxItemRepository;
        BoxManager = boxManager;
        BoxCache = boxCache;
    }

    //TODO: به سرویس پابلیک منتقل شود=======================================
    //public async Task<ListResultDto<BoxDto>> GetDetailedListAsync()
    //{

    //    var boxes = await BoxRepository.GetListAsync(includeDetails: true);

    //    return new ListResultDto<BoxDto>(ObjectMapper.Map<List<Box>, List<BoxDto>>(boxes));
    //}

    //===============================================================
    public async Task<BoxDto> GetAsync(Guid id)
    {
        var page = await BoxRepository.GetAsync(id, includeDetails: true);
        return ObjectMapper.Map<Box, BoxDto>(page);
    }
    public async Task<PagedResultDto<BoxDto>> GetListAsync(BoxGetListInput input)
    {
        var count = await BoxRepository.GetCountAsync(input.Filter);

        var boxes = await BoxRepository.GetListAsync(
            input.Filter,
            input.MaxResultCount,
            input.SkipCount,
            input.Sorting,
            includeDetails:true
        );

        return new PagedResultDto<BoxDto>(
            count,
            ObjectMapper.Map<List<Box>, List<BoxDto>>(boxes)
        );
    }
   

    [Authorize(CmsKitAdminPermissions.Boxes.Create)]
    public async Task<BoxDto> CreateAsync(CreateBoxDto input)
    {
        var box = await BoxManager.CreateAsync(input.Section,
            input.Title, input.Action, input.ActionUrl, input.Summary, input.Status, input.Description);
        input.MapExtraPropertiesTo(box);
        await BoxRepository.InsertAsync(box);

        await BoxCache.RemoveAsync(BoxCacheItem.GetKey(box.Section));

        return ObjectMapper.Map<Box, BoxDto>(box);
    }
    [Authorize(CmsKitAdminPermissions.Boxes.Update)]
    public async Task<BoxDto> UpdateAsync(Guid id, UpdateBoxDto input)
    {
        var box = await BoxRepository.GetAsync(id);

        await BoxCache.RemoveAsync(BoxCacheItem.GetKey(box.Section));

        await BoxManager.SetSectionAsync(box, input.Section);

        box.SetTitle(input.Title);
        box.SetAction(input.Action);
        box.SetActionUrl(input.ActionUrl);
        box.SetSummary(input.Summary);
        box.SetDescription(input.Description);
        box.SetStatus(input.Status);
        box.SetConcurrencyStampIfNotNull(input.ConcurrencyStamp);
        input.MapExtraPropertiesTo(box);

        await BoxRepository.UpdateAsync(box);

        return ObjectMapper.Map<Box, BoxDto>(box);
    }

    [Authorize(CmsKitAdminPermissions.Boxes.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        var box = await BoxRepository.GetAsync(id);
        await BoxRepository.DeleteAsync(box);
        await BoxCache.RemoveAsync(BoxCacheItem.GetKey(box.Section));
    }
    [Authorize(CmsKitAdminPermissions.Boxes.Delete)]
    public async Task<bool> HazfAsync(Guid id)
    {
        var box = await BoxRepository.GetAsync(id);
        await BoxRepository.DeleteAsync(box);
        await BoxCache.RemoveAsync(BoxCacheItem.GetKey(box.Section));
        return true;
    }
    
}

