using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using static System.Collections.Specialized.BitVector32;

namespace Volo.CmsKit.Public.ContentBoxes;

//[RequiresFeature(CmsKitFeatures.ContentBoxEnable)]
//[RequiresGlobalFeature(typeof(ContentBoxesFeature))]
[RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/contentBoxes")]
public class ContentBoxesPublicController : CmsKitPublicControllerBase, IContentBoxPublicAppService
{
    protected IContentBoxPublicAppService ContentBoxAppService { get; }

    public ContentBoxesPublicController(IContentBoxPublicAppService boxAppService)
    {
        ContentBoxAppService = boxAppService;
    }

    //[HttpGet]
    //[Route("box-items-by-boxId")]
    //public Task<ListResultDto<ContentBoxDto>> GetContentBoxItemsAsync(Guid boxId)
    //{
    //    return ContentBoxAppService.GetAsync(boxId);
    //}
    [HttpGet]
    [Route("by-section")]
    public Task<ContentBoxCommonDto> GetBySectionAsync(string section)
    {
        return ContentBoxAppService.GetBySectionAsync(section);
    }
    [HttpGet]
    public Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync(ContentBoxGetListInput input)
    {
        return ContentBoxAppService.GetListAsync(input);
    }
    [HttpGet]
    [Route("by-id")]
    public Task<ContentBoxCommonDto> GetAsync(Guid id)
    {
        return ContentBoxAppService.GetAsync(id);
    }
    [HttpGet]
    [Route("by-parent")]
    public Task<ListResultDto<ContentBoxCommonDto>> GetByParentAsync(Guid? parentId)
    {
        return ContentBoxAppService.GetByParentAsync(parentId);
    }
    [HttpGet]
    [Route("all")]
    public Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync()
    {
        return ContentBoxAppService.GetListAsync();
    }
    [HttpGet]
    [Route("get-hierarchy")]
    public Task<List<HierarchyNode<ContentBoxCommonDto>>> GetHierarchyAsync()
    {
        return ContentBoxAppService.GetHierarchyAsync();
    }
    
    [HttpGet]
    [Route("get-tree")]
    public Task<List<ContentBoxTree>> GetTreeAsync()
    {
        return ContentBoxAppService.GetTreeAsync();
    }
    [HttpGet]
    [Route("get-tree-by-id")]
    public Task<List<ContentBoxTree>> GetTreeAsync(Guid id)
    {
        return ContentBoxAppService.GetTreeAsync(id);
    }
    [HttpGet]
    [Route("get-tree-by-section")]
    public Task<List<ContentBoxTree>> GetTreeBySectionAsync([NotNull] string section)
    {
        return ContentBoxAppService.GetTreeBySectionAsync(section);
    }
}
