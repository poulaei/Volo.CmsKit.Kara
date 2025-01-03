using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Public.Blogs;
//Added by Poolaei @1403/03/25  For Royan
public class BlogGetListInput : PagedAndSortedResultRequestDto
{
    public string Filter { get; set; }
}