using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class CreateBoxItemDto : EntityDto //ExtensibleObject
{
    [Required]
    public  Guid BoxId { get;  set; }

    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.TitleMaxLength))]
    public string? Title { get; set; }
    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.ActionMaxLength))]
    public string? Action { get; set; }
    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.ActionUrlMaxLength))]
    public string? ActionUrl { get; set; }
    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.SummaryMaxLength))]
    public string? Summary { get; set; }
    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.IconMaxLength))]
    public string? Icon { get; set; }
    [DynamicMaxLength(typeof(BoxItemConsts), nameof(BoxItemConsts.DescriptionMaxLength))]
    public string? Description { get; set; }
    public Guid? MediaId { get; set; }
}
