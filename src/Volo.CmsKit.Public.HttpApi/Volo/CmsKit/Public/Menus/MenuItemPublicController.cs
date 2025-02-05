using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Menus;

namespace Volo.CmsKit.Public.Menus;

[RequiresFeature(CmsKitFeatures.MenuEnable)]
[RequiresGlobalFeature(typeof(MenuFeature))]
[RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/menu-items")]
public class MenuItemPublicController : CmsKitPublicControllerBase, IMenuItemPublicAppService
{
    protected IMenuItemPublicAppService MenuPublicAppService { get; }

    public MenuItemPublicController(IMenuItemPublicAppService menuPublicAppService)
    {
        MenuPublicAppService = menuPublicAppService;
    }

    [HttpGet]
    public Task<List<MenuItemDto>> GetListAsync()
    {
        return MenuPublicAppService.GetListAsync();
    }

    [HttpGet]
    [Route("get-hierarchy")]
    public Task<List<HierarchyNode<RoyanMenuItemDto>>> GetHierarchyAsync()
    {
        return MenuPublicAppService.GetHierarchyAsync();
    }
    [HttpGet]
    [Route("get-tree")]
    public Task<List<TreeNode>> GetTreeAsync()
    {
        return MenuPublicAppService.GetTreeAsync();
    }

}
