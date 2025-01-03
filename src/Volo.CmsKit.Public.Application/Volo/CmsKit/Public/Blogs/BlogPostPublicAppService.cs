using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Users;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Tags;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Public.Blogs;

[RequiresFeature(CmsKitFeatures.BlogEnable)]
[RequiresGlobalFeature(typeof(BlogsFeature))]
public class BlogPostPublicAppService : CmsKitPublicAppServiceBase, IBlogPostPublicAppService
{
    protected IBlogRepository BlogRepository { get; }

    protected IBlogPostRepository BlogPostRepository { get; }

    protected ITagRepository TagRepository { get; }

    protected TagManager TagManager { get; }

    public BlogPostPublicAppService(
        IBlogRepository blogRepository,
        IBlogPostRepository blogPostRepository,
        ITagRepository tagRepository,
        TagManager tagManager)
    {
        BlogRepository = blogRepository;
        BlogPostRepository = blogPostRepository;
        TagRepository = tagRepository;
        TagManager = tagManager;    
    }

    public virtual async Task<BlogPostCommonDto> GetAsync(
        [NotNull] string blogSlug, [NotNull] string blogPostSlug)
    {
        var blog = await BlogRepository.GetBySlugAsync(blogSlug);

        var blogPost = await BlogPostRepository.GetBySlugAsync(blog.Id, blogPostSlug);

        return ObjectMapper.Map<BlogPost, BlogPostCommonDto>(blogPost);
    }

    //Added by Poolaei @1403/03/25  For Royan
    public virtual async Task<BlogPostCommonDto> GetAsync(Guid id)
    {
        var blogPost = await BlogPostRepository.GetAsync(id);

        return ObjectMapper.Map<BlogPost, BlogPostCommonDto>(blogPost);
    }
    //Added by Poolaei @1403/03/25  For Royan
    public virtual async Task<PagedResultDto<BlogPostCommonNoContentDto>> GetListWithOutContentAsync(BlogPostGetListInput input)
    {
        var blogPosts = await BlogPostRepository.GetListWithOutContentAsync(null, input.BlogId, input.AuthorId, input.TagName,
            BlogPostStatus.Published, input.MaxResultCount,
            input.SkipCount, input.Sorting);
        Guid? tagId = null;
        if (!input.TagName.IsNullOrEmpty())
        {
           var  tag = await TagManager.GetOrAddAsync(BlogPostConsts.EntityType, input.TagName);
            if (tag != null)
                tagId = tag.Id;
        }
        return new PagedResultDto<BlogPostCommonNoContentDto>(
            await BlogPostRepository.GetCountAsync(blogId: input.BlogId, tagId: tagId,
                statusFilter: BlogPostStatus.Published, authorId: input.AuthorId),
            ObjectMapper.Map<List<BlogPost>, List<BlogPostCommonNoContentDto>>(blogPosts));
    }

    public virtual async Task<PagedResultDto<BlogPostCommonDto>> GetListAsync([NotNull] string blogSlug, BlogPostGetListInput input)
    {
        var blog = await BlogRepository.GetBySlugAsync(blogSlug);

        var blogPosts = await BlogPostRepository.GetListAsync(null, blog.Id, input.AuthorId, input.TagId,
            BlogPostStatus.Published, input.MaxResultCount,
            input.SkipCount, input.Sorting);

        return new PagedResultDto<BlogPostCommonDto>(
            await BlogPostRepository.GetCountAsync(blogId: blog.Id, tagId: input.TagId,
                statusFilter: BlogPostStatus.Published, authorId: input.AuthorId),
            ObjectMapper.Map<List<BlogPost>, List<BlogPostCommonDto>>(blogPosts));
    }

    public virtual async Task<PagedResultDto<CmsUserDto>> GetAuthorsHasBlogPostsAsync(BlogPostFilteredPagedAndSortedResultRequestDto input)
    {
        var authors = await BlogPostRepository.GetAuthorsHasBlogPostsAsync(input.SkipCount, input.MaxResultCount, input.Sorting, input.Filter);
        var authorDtos = ObjectMapper.Map<List<CmsUser>, List<CmsUserDto>>(authors);

        return new PagedResultDto<CmsUserDto>(
            await BlogPostRepository.GetAuthorsHasBlogPostsCountAsync(input.Filter),
            authorDtos);
    }

    public virtual async Task<CmsUserDto> GetAuthorHasBlogPostAsync(Guid id)
    {
        var author = await BlogPostRepository.GetAuthorHasBlogPostAsync(id);

        return ObjectMapper.Map<CmsUser, CmsUserDto>(author);
    }

    [Authorize]
    public virtual async Task DeleteAsync(Guid id)
    {
        var rating = await BlogPostRepository.GetAsync(id);

        if (rating.CreatorId != CurrentUser.GetId())
        {
            throw new AbpAuthorizationException();
        }

        await BlogPostRepository.DeleteAsync(id);
    }

    public async Task<string> GetTagNameAsync([NotNull] Guid tagId)
    {
        var tag = await TagRepository.GetAsync(tagId);

        return tag.Name;
    }
}
