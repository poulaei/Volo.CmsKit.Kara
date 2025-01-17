using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Caching;
using Volo.Abp.Data;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.ObjectExtending;
using Volo.Abp.UI.Navigation;
using Volo.CmsKit.Admin.MediaDescriptors;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Permissions;

namespace Volo.CmsKit.Admin.ContentBoxes;

//[RequiresFeature(CmsKitFeatures.ContentBoxEnable)]
//[RequiresGlobalFeature(typeof(ContentBoxFeature))]
[Authorize(CmsKitAdminPermissions.ContentBoxes.Default)]
public class ContentBoxAdminAppService : CmsKitAdminAppServiceBase, IContentBoxAdminAppService
{
    private IContentBoxRepository ContentBoxRepository { get; }
    protected ContentBoxManager ContentBoxManager { get; }
    protected IDistributedCache<ContentBoxCacheItem> ContentBoxCache { get; }
    protected IDistributedCache<List<ContentBoxDto>> DistributedCache { get; }
    protected IMediaDescriptorAdminAppService MediaDescriptorAdminAppService { get; }
    public ContentBoxAdminAppService(IContentBoxRepository boxItemRepository, 
        ContentBoxManager boxManager,
        IDistributedCache<ContentBoxCacheItem> boxCache,
        IDistributedCache<List<ContentBoxDto>> distributedCache,
        IMediaDescriptorAdminAppService mediaDescriptorAdminAppService)
    {
        ContentBoxRepository = boxItemRepository;
        ContentBoxManager = boxManager;
        ContentBoxCache = boxCache;
        DistributedCache = distributedCache;
        MediaDescriptorAdminAppService = mediaDescriptorAdminAppService;
    }

   
    public async Task<ContentBoxDto> GetAsync(Guid id)
    {
        var page = await ContentBoxRepository.GetAsync(id, includeDetails: true);
        return ObjectMapper.Map<ContentBox, ContentBoxDto>(page);
    }
    public async Task<PagedResultDto<ContentBoxDto>> GetListAsync(ContentBoxGetListInput input)
    {
        var count = await ContentBoxRepository.GetCountAsync(input.Filter);

        var boxes = await ContentBoxRepository.GetListAsync(
            input.Filter,
            input.MaxResultCount,
            input.SkipCount,
            input.Sorting
           // includeDetails:true
        );

        return new PagedResultDto<ContentBoxDto>(
            count,
            ObjectMapper.Map<List<ContentBox>, List<ContentBoxDto>>(boxes)
        );
    }
   

    [Authorize(CmsKitAdminPermissions.ContentBoxes.Create)]
    public async Task<ContentBoxDto> CreateAsync(CreateContentBoxDto input)
    {
        var box = await ContentBoxManager.CreateAsync(input.Section,input.ParentId,input.BoxType,input.BoxName,input.Content,
            input.Title, input.ActionType, input.Action, input.ActionUrl, input.Summary, input.Status, input.Description,
            input.Icon,input.Order,input.MediaId);
        input.MapExtraPropertiesTo(box);
        await ContentBoxRepository.InsertAsync(box);

        await ContentBoxCache.RemoveAsync(ContentBoxCacheItem.GetKey(box.Id));
        await DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);

        return ObjectMapper.Map<ContentBox, ContentBoxDto>(box);
    }
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Update)]
    public async Task<ContentBoxDto> UpdateAsync(Guid id, UpdateContentBoxDto input)
    {
        var box = await ContentBoxRepository.GetAsync(id);

        await ContentBoxCache.RemoveAsync(ContentBoxCacheItem.GetKey(box.Id));

        await ContentBoxManager.SetSectionAsync(box, input.Section);
        //TODO:انتقال فانکشن های تنظیم مقادیر به کلاس منیجر مربوطه و تغییر مودفایر به اینترنال در کلاس انتیتی
        box.SetBoxType(input.BoxType);
        box.SetBoxName(input.BoxName);
        box.SetContent(input.Content);
        box.SetTitle(input.Title);
        box.SetActionType(input.ActionType);
        box.SetAction(input.Action);
        box.SetActionUrl(input.ActionUrl);
        box.SetSummary(input.Summary);
        box.SetIcon(input.Icon);
        box.SetDescription(input.Description);
        box.SetStatus(input.Status);
        box.SetOrder(input.Order);
        box.SetConcurrencyStampIfNotNull(input.ConcurrencyStamp);

        if (box.MediaId != null && input.MediaId == null)
        {
            //ممکن است به هر دلیلی مدیا پاک شده  ولی شناسه مدیا در جدول مورد نظر وجود داشته باشد
            //بنابراین حذف مدیا با خطا مواجه شده در نتیجه به روززسانی موجودیت موردنظر هم انجام نحواهد شد
            //برای جلوگیری از این اتفاق خطای  حذف شناسه گرفته می شود
            //TODO:  راهکار بهتر
           try
            {
                await MediaDescriptorAdminAppService.DeleteAsync(box.MediaId.Value);
            }
            catch (Exception)
            {

            }
           
        }
        box.MediaId = input.MediaId;


        input.MapExtraPropertiesTo(box);

        await ContentBoxRepository.UpdateAsync(box);
        await DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);

        return ObjectMapper.Map<ContentBox, ContentBoxDto>(box);
    }

    [Authorize(CmsKitAdminPermissions.ContentBoxes.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        var box = await ContentBoxRepository.GetAsync(id);
        await ContentBoxRepository.DeleteAsync(box);
        await ContentBoxCache.RemoveAsync(ContentBoxCacheItem.GetKey(box.Id));
        await DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
    }
    [Authorize(CmsKitAdminPermissions.ContentBoxes.Delete)]
    public async Task<bool> HazfAsync(Guid id)
    {
        var box = await ContentBoxRepository.GetAsync(id);
        await ContentBoxRepository.DeleteAsync(box);
        await ContentBoxCache.RemoveAsync(ContentBoxCacheItem.GetKey(box.Id));
        await DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
        return true;
    }

    public virtual async Task MoveContentBoxAsync(Guid id, ContentBoxMoveInput input)
    {
        await ContentBoxManager.MoveAsync(id, input.NewParentId, input.Position);
        await DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
    }
}

