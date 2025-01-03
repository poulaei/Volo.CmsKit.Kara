using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class BoxDto : ExtensibleEntityDto<Guid>, IHasConcurrencyStamp
{
    public required string Section { get; set; }
    public string Title { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }

    public string Summary { get; set; }
    public BoxStatus Status { get; set; }
    public string Description { get; set; }
    public string ConcurrencyStamp { get; set; }
    [CanBeNull]
    public ICollection<BoxItemDto>? BoxItems { get; set; }


}
