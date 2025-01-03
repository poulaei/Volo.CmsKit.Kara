using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Caching;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Menus;

namespace Volo.CmsKit.Public.Menus;

[RequiresFeature(CmsKitFeatures.MenuEnable)]
[RequiresGlobalFeature(typeof(MenuFeature))]
public class MenuItemPublicAppService : CmsKitPublicAppServiceBase, IMenuItemPublicAppService
{
    protected IMenuItemRepository MenuItemRepository { get; }
    protected IDistributedCache<List<MenuItemDto>> DistributedCache { get; }
    protected IDistributedCache<List<RoyanMenuItemDto>> DistributedCacheRoyan { get; }
    public MenuItemPublicAppService(
        IMenuItemRepository menuRepository,
        IDistributedCache<List<MenuItemDto>> distributedCache,
        IDistributedCache<List<RoyanMenuItemDto>> distributedCacheRoyan)
    {
        MenuItemRepository = menuRepository;
        DistributedCache = distributedCache;
        DistributedCacheRoyan = distributedCacheRoyan;
    }

    public virtual async Task<List<MenuItemDto>> GetListAsync()
    {
        var cachedMenu = await DistributedCache.GetOrAddAsync(
            MenuApplicationConsts.MainMenuCacheKey,
            async () =>
            {
                var menuItems = await MenuItemRepository.GetListAsync();

                if (menuItems == null)
                {
                    return new();
                }

                return ObjectMapper.Map<List<MenuItem>, List<MenuItemDto>>(menuItems);
            });

        return cachedMenu;
    }

    public virtual async Task<List<HierarchyNode<RoyanMenuItemDto>>> GetHierarchyAsync()
    {

        var cachedMenu = await DistributedCacheRoyan.GetOrAddAsync(MenuApplicationConsts.RoyanMainMenuCacheKey,
            async () =>
            {
                var menuItems = await MenuItemRepository.GetListAsync();

                if (menuItems == null)
                {
                    return new();
                }

                return ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);//.AsHierarchy(m => m.Id, m => m.PageId);
            });
       
        //var menuItems = await MenuItemRepository.GetListAsync();
        //var cachedMenu =  ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);

        var hm = cachedMenu.AsHierarchy(m => m.Id, m => m.ParentId);
        return hm.ToList();// ObjectMapper.Map<List<RoyanMenuItemDto>, List<HierarchyNode<RoyanMenuItemDto>>>(hm);
    }


    public virtual async Task<List<TreeNode>> GetTreeAsync()
    {

        var cachedMenu = await DistributedCacheRoyan.GetOrAddAsync(MenuApplicationConsts.RoyanMainMenuCacheKey,
            async () =>
            {
                var menuItems = await MenuItemRepository.GetListAsync();

                if (menuItems == null)
                {
                    return new();
                }

                return ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);//.AsHierarchy(m => m.Id, m => m.PageId);
            });

        //var menuItems = await MenuItemRepository.GetListAsync();
        //var cachedMenu =  ObjectMapper.Map<List<MenuItem>, List<RoyanMenuItemDto>>(menuItems);

        var tree = LinqToObjectsExtensionMethods.FlatToTree(cachedMenu, null);

        return tree;

    }
}
