using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit.Contents;

[Serializable]
public class BoxDto : ExtensibleEntityDto<Guid>
{
    public required string Section { get; set; }
    public string Title { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }

    public string Summary { get; set; }
    public BoxStatus Status { get; set; }
    public string Description { get; set; }
    [CanBeNull]
    public ICollection<BoxItemDto> BoxItems { get; set; }


}
