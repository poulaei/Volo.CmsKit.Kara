using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class CreateBoxDto : ExtensibleObject
{
    [Required]
    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.SectionMaxLength))]
    public required string Section { get; set; }

    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.TitleMaxLength))]
    public string? Title { get; set; }
    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.ActionMaxLength))]
    public string? Action { get; set; }
    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.ActionUrlMaxLength))]
    public string? ActionUrl { get; set; }
    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.SummaryMaxLength))]
    public string? Summary { get; set; }
    public BoxStatus Status { get; set; }
    [DynamicMaxLength(typeof(BoxConsts), nameof(BoxConsts.DescriptionMaxLength))]
    public string? Description { get; set; }
}
