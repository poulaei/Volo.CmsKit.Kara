using System;
using Volo.Abp.Application.Dtos;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Contents;

//Added by Poolaei @1403/03/25  For Royan
[Serializable]
public class BlogCommonDto : ExtensibleEntityDto<Guid>
{
    public string Name { get; set; }

    public string Slug { get; set; }
    public string ConcurrencyStamp { get; set; }
}