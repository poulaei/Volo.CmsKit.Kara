using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Public.Blogs;

[RequiresFeature(CmsKitFeatures.BlogEnable)]
[RequiresGlobalFeature(typeof(BlogsFeature))]
[RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
[Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
[Route("api/cms-kit-public/blogs")]
public class BlogPublicController : CmsKitPublicControllerBase, IBlogPublicAppService
{
    protected IBlogPublicAppService BlogPublicAppService { get; }

    public BlogPublicController(IBlogPublicAppService blogPostPublicAppService)
    {
        BlogPublicAppService = blogPostPublicAppService;
    }

  
    [HttpGet]
    public virtual Task<PagedResultDto<BlogCommonDto>> GetListAsync(BlogGetListInput input)
    {
        return BlogPublicAppService.GetListAsync(input);
    }

   
}