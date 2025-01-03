using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Public.Blogs;

public class BlogPostGetListInput : PagedAndSortedResultRequestDto
{
    //Added by Poolaei @1403/03/25  For Royan
     public Guid? BlogId { get; set; }
   
    public Guid? AuthorId { get; set; }

    public Guid? TagId { get; set; }

    //Added by Poolaei @1403/03/25  For Royan
    public string TagName { get; set; }
}