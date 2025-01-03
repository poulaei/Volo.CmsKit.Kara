using System;
using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.CmsKit.Pages;

namespace Volo.CmsKit.GalleryImages;

    public class GalleryImage : CreationAuditedAggregateRoot<Guid>
    {
        public string Description { get; set; }

        public Guid CoverImageMediaId { get; set; }

        protected GalleryImage()
        {
        }

        public GalleryImage(Guid id, Guid coverImageMediaId, [NotNull] string description) : base(id)
        {
            CoverImageMediaId = coverImageMediaId;
            Description = Check.NotNullOrWhiteSpace(description, nameof(description), maxLength: GalleryImageConsts.MaxDescriptionLength);
        }
    }

