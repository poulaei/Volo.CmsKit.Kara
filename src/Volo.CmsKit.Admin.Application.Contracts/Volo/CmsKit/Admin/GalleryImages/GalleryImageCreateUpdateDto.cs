using JetBrains.Annotations;
using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Content;
using Volo.Abp.Validation;
using Volo.CmsKit.GalleryImages;

namespace Volo.CmsKit.Admin.GalleryImages;
[Serializable]
public class GalleryImageCreateUpdateDto : ExtensibleAuditedEntityDto<Guid>
{
    [NotNull]
    [DynamicMaxLength(typeof(GalleryImageConsts), nameof(GalleryImageConsts.MaxDescriptionLength))]
    public string Description { get; set; }

    public Guid CoverImageMediaId { get; set; }
}

