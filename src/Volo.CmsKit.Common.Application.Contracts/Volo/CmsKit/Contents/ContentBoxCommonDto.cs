using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit.Contents;


public class ContentBoxCommonDto : ExtensibleEntityDto<Guid>
{
    public Guid? ParentId { get; set; }
    public required string Section { get; set; }
    public string BoxType { get; set; }
    public string BoxName { get; set; }
    public string Content { get; set; }
    public string Title { get; set; }
    public string ActionType { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }
    public string Summary { get; set; }
    public BoxStatus Status { get; set; }
    public string Icon { get; set; }
    public string Description { get; set; }
    public Guid? MediaId { get; set; }


}
