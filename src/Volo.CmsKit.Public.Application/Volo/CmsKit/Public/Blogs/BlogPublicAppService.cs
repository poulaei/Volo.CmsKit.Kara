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
//Added by Poolaei @1403/03/25  For Royan
[RequiresFeature(CmsKitFeatures.BlogEnable)]
[RequiresGlobalFeature(typeof(BlogsFeature))]
public class BlogPublicAppService : CmsKitPublicAppServiceBase, IBlogPublicAppService
{
    protected IBlogRepository BlogRepository { get; }

    protected IBlogPostRepository BlogPostRepository { get; }

    protected ITagRepository TagRepository { get; }

    public BlogPublicAppService(
        IBlogRepository blogRepository,
        IBlogPostRepository blogPostRepository,
        ITagRepository tagRepository)
    {
        BlogRepository = blogRepository;
        BlogPostRepository = blogPostRepository;
        TagRepository = tagRepository;
    }

    public virtual async Task<PagedResultDto<BlogCommonDto>> GetListAsync(BlogGetListInput input)
    {
        var totalCount = await BlogRepository.GetCountAsync(input.Filter);

        var blogs = await BlogRepository.GetListAsync(
            input.Filter,
            input.Sorting,
            input.MaxResultCount,
            input.SkipCount);

        return new PagedResultDto<BlogCommonDto>(totalCount, ObjectMapper.Map<List<Blog>, List<BlogCommonDto>>(blogs));


    }


    //public virtual async Task<BlogPostCommonDto> GetAsync(
    //   [NotNull] string blogSlug, [NotNull] string blogPostSlug)
    //{
    //    var blog = await BlogRepository.GetBySlugAsync(blogSlug);

    //    var blogPost = await BlogPostRepository.GetBySlugAsync(blog.Id, blogPostSlug);

    //    return ObjectMapper.Map<BlogPost, BlogPostCommonDto>(blogPost);
    //}
    //public virtual async Task<PagedResultDto<CmsUserDto>> GetAuthorsHasBlogPostsAsync(BlogPostFilteredPagedAndSortedResultRequestDto input)
    //{
    //    var authors = await BlogPostRepository.GetAuthorsHasBlogPostsAsync(input.SkipCount, input.MaxResultCount, input.Sorting, input.Filter);
    //    var authorDtos = ObjectMapper.Map<List<CmsUser>, List<CmsUserDto>>(authors);

    //    return new PagedResultDto<CmsUserDto>(
    //        await BlogPostRepository.GetAuthorsHasBlogPostsCountAsync(input.Filter),
    //        authorDtos);
    //}

    //public virtual async Task<CmsUserDto> GetAuthorHasBlogPostAsync(Guid id)
    //{
    //    var author = await BlogPostRepository.GetAuthorHasBlogPostAsync(id);

    //    return ObjectMapper.Map<CmsUser, CmsUserDto>(author);
    //}

    //[Authorize]
    //public virtual async Task DeleteAsync(Guid id)
    //{
    //    var rating = await BlogPostRepository.GetAsync(id);

    //    if (rating.CreatorId != CurrentUser.GetId())
    //    {
    //        throw new AbpAuthorizationException();
    //    }

    //    await BlogPostRepository.DeleteAsync(id);
    //}

    //public async Task<string> GetTagNameAsync([NotNull] Guid tagId)
    //{
    //    var tag = await TagRepository.GetAsync(tagId);

    //    return tag.Name;
    //}
}
