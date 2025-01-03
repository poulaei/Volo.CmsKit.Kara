using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.ContentBoxes;

namespace Volo.CmsKit.Admin.ContentBoxes;

[Serializable]
public class UpdateContentBoxDto : ExtensibleObject, IHasConcurrencyStamp
{
    public Guid? ParentId { get;  set; }
    [Required]
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.SectionMaxLength))]
    public required string Section { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxTypeMaxLength))]
    public required string BoxType { get;  set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxNameMaxLength))]
    public required string BoxName { get;  set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ContentMaxLength))]
    public  string Content { get;  set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.TitleMaxLength))]
    public string? Title { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionTypeMaxLength))]
    public virtual string ActionType { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionMaxLength))]
    public string? Action { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionUrlMaxLength))]
    public string? ActionUrl { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.SummaryMaxLength))]
    public string? Summary { get; set; }
    public ContentBoxStatus Status { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.IconMaxLength))]
    public string? Icon { get; set; }
    [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.DescriptionMaxLength))]
    public string? Description { get; set; }
    public int Order { get; set; }
    public Guid? MediaId { get; set; }
    public string ConcurrencyStamp { get; set; }
}
