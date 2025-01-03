using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Caching;
using Volo.Abp.Data;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectMapping;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Permissions;
using Volo.CmsKit.Pages;

namespace Volo.CmsKit.Admin.Menus;

//[RequiresFeature(CmsKitFeatures.MenuEnable)]
//[RequiresGlobalFeature(typeof(MenuFeature))]
//[Authorize(AngularMaterialPermissions.Menus.Default)]
public class MenuItemAdminAppService : CmsKitAdminAppServiceBase, IMenuItemAdminAppService
{
    protected MenuItemManager MenuManager { get; }
    protected IMenuItemRepository MenuItemRepository { get; }
    protected IPageRepository PageRepository { get; }
    protected IDistributedCache<List<MenuItemDto>> DistributedCache { get; }
    protected IDistributedCache<List<RoyanMenuItemDto>> DistributedCacheRoyan { get; }

    public MenuItemAdminAppService(
        MenuItemManager menuManager,
        IMenuItemRepository menuRepository,
         IDistributedCache<List<MenuItemDto>> distributedCache,
         IDistributedCache<List<RoyanMenuItemDto>> distributedCacheRoyan,
         IPageRepository pageRepository
        )
    {

        MenuManager = menuManager;
        MenuItemRepository = menuRepository;
        DistributedCache = distributedCache;
        DistributedCacheRoyan = distributedCacheRoyan;
        PageRepository = pageRepository;
    }

    public virtual async Task<ListResultDto<MenuItemDto>> GetListAsync()
    {
        var menuItems = await MenuItemRepository.GetListAsync();

        return new ListResultDto<MenuItemDto>(
                ObjectMapper.Map<List<MenuItem>, List<MenuItemDto>>(menuItems)
        );
    }

    public virtual async Task<MenuItemDto> GetAsync(Guid id)
    {
        var menu = await MenuItemRepository.GetAsync(id);
        return ObjectMapper.Map<MenuItem, MenuItemDto>(menu);
    }

    [Authorize(CmsKitAdminPermissions.Menus.Create)]
    public virtual async Task<MenuItemDto> CreateAsync(MenuItemCreateInput input)
    {
        var menuItem = new MenuItem(
                GuidGenerator.Create(),
                input.DisplayName,
                input.Url.IsNullOrEmpty() ? "#" : input.Url,
                input.IsActive,
                input.ParentId,
                input.Icon,
                input.Order,
                input.Target,
                input.ElementId,
                input.CssClass,
                CurrentTenant.Id
            );

        if (input.PageId.HasValue)
        {
            MenuManager.SetPageUrl(menuItem, await PageRepository.GetAsync(input.PageId.Value));
        }
        input.MapExtraPropertiesTo(menuItem);
        await MenuItemRepository.InsertAsync(menuItem);
        await DistributedCache.RemoveAsync(MenuApplicationConsts.MainMenuCacheKey);
        await DistributedCacheRoyan.RemoveAsync(MenuApplicationConsts.RoyanMainMenuCacheKey);
        return ObjectMapper.Map<MenuItem, MenuItemDto>(menuItem);
    }

    [Authorize(CmsKitAdminPermissions.Menus.Update)]
    public virtual async Task<MenuItemDto> UpdateAsync(Guid id, MenuItemUpdateInput input)
    {
        var menuItem = await MenuItemRepository.GetAsync(id);

        if (input.PageId.HasValue)
        {
            MenuManager.SetPageUrl(menuItem, await PageRepository.GetAsync(input.PageId.Value));
        }
        else
        {
            menuItem.SetUrl(input.Url);
        }

        menuItem.SetDisplayName(input.DisplayName);
        menuItem.IsActive = input.IsActive;
        menuItem.Icon = input.Icon;
        menuItem.Target = input.Target;
        menuItem.ElementId = input.ElementId;
        menuItem.CssClass = input.CssClass;
        menuItem.SetConcurrencyStampIfNotNull(input.ConcurrencyStamp);
        input.MapExtraPropertiesTo(menuItem);
        await MenuItemRepository.UpdateAsync(menuItem);
        await DistributedCache.RemoveAsync(MenuApplicationConsts.MainMenuCacheKey);
        await DistributedCacheRoyan.RemoveAsync(MenuApplicationConsts.RoyanMainMenuCacheKey);
        return ObjectMapper.Map<MenuItem, MenuItemDto>(menuItem);
    }

    [Authorize(CmsKitAdminPermissions.Menus.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        await MenuItemRepository.DeleteAsync(id);
        await DistributedCache.RemoveAsync(MenuApplicationConsts.MainMenuCacheKey);
        await DistributedCacheRoyan.RemoveAsync(MenuApplicationConsts.RoyanMainMenuCacheKey);
    }

    [Authorize(CmsKitAdminPermissions.Menus.Update)]
    public virtual async Task MoveMenuItemAsync(Guid id, MenuItemMoveInput input)
    {
        await MenuManager.MoveAsync(id, input.NewParentId, input.Position);
        await DistributedCache.RemoveAsync(MenuApplicationConsts.MainMenuCacheKey);
        await DistributedCacheRoyan.RemoveAsync(MenuApplicationConsts.RoyanMainMenuCacheKey);
    }

    public virtual async Task<PagedResultDto<PageLookupDto>> GetPageLookupAsync(PageLookupInputDto input)
    {
        var count = await PageRepository.GetCountAsync(input.Filter);

        var pages = await PageRepository.GetListAsync(
            input.Filter,
            input.MaxResultCount,
            input.SkipCount,
            input.Sorting
        );

        return new PagedResultDto<PageLookupDto>(
            count,
            ObjectMapper.Map<List<Page>, List<PageLookupDto>>(pages)
        );
    }

    //public virtual async Task<List<HierarchyNode<RoyanMenuItemDto>>> GetHierarchyAsync()
    //{

    //    var cachedMenu = await DistributedCache.GetOrAddAsync(MenuApplicationConsts.MainMenuCacheKey,
    //        async () =>
    //        {
    //            var menuItems = await MenuItemRepository.GetListAsync();

    //            if (menuItems == null)
    //            {
    //                return new();
    //            }

    //            return ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);//.AsHierarchy(m => m.Id, m => m.PageId);
    //        });

    //    //var menuItems = await MenuItemRepository.GetListAsync();
    //    //var cachedMenu =  ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);

    //    var hm = cachedMenu.AsHierarchy(m => m.Id, m => m.ParentId);
    //    return hm.ToList();// ObjectMapper.Map<List<RoyanMenuItemDto>, List<HierarchyNode<RoyanMenuItemDto>>>(hm);
    //}
}
