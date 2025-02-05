// This file is automatically generated by ABP framework to use MVC Controllers from CSharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.ClientProxying;
using Volo.Abp.Http.Modeling;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Public.Blogs;
using Volo.CmsKit.Users;

// ReSharper disable once CheckNamespace
namespace Volo.CmsKit.Public.Blogs;

[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IBlogPostPublicAppService), typeof(BlogPostPublicClientProxy))]
public partial class BlogPostPublicClientProxy : ClientProxyBase<IBlogPostPublicAppService>, IBlogPostPublicAppService
{
    public virtual async Task<BlogPostCommonDto> GetAsync(string blogSlug, string blogPostSlug)
    {
        return await RequestAsync<BlogPostCommonDto>(nameof(GetAsync), new ClientProxyRequestTypeValue
        {
            { typeof(string), blogSlug },
            { typeof(string), blogPostSlug }
        });
    }

    public virtual async Task<PagedResultDto<BlogPostCommonDto>> GetListAsync(string blogSlug, BlogPostGetListInput input)
    {
        return await RequestAsync<PagedResultDto<BlogPostCommonDto>>(nameof(GetListAsync), new ClientProxyRequestTypeValue
        {
            { typeof(string), blogSlug },
            { typeof(BlogPostGetListInput), input }
        });
    }

    public virtual async Task<PagedResultDto<CmsUserDto>> GetAuthorsHasBlogPostsAsync(BlogPostFilteredPagedAndSortedResultRequestDto input)
    {
        return await RequestAsync<PagedResultDto<CmsUserDto>>(nameof(GetAuthorsHasBlogPostsAsync), new ClientProxyRequestTypeValue
        {
            { typeof(BlogPostFilteredPagedAndSortedResultRequestDto), input }
        });
    }

    public virtual async Task<CmsUserDto> GetAuthorHasBlogPostAsync(Guid id)
    {
        return await RequestAsync<CmsUserDto>(nameof(GetAuthorHasBlogPostAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), id }
        });
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        await RequestAsync(nameof(DeleteAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), id }
        });
    }

    public virtual async Task<string> GetTagNameAsync(Guid tagId)
    {
        return await RequestAsync<string>(nameof(GetTagNameAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), tagId }
        });
    }

    public Task<BlogPostCommonDto> GetAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<PagedResultDto<BlogPostCommonNoContentDto>> GetListWithOutContentAsync(BlogPostGetListInput input)
    {
        throw new NotImplementedException();
    }
}
