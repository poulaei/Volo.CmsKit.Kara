using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp;
using JetBrains.Annotations;
using System;
using System.Collections.Generic;

namespace Volo.CmsKit.Boxes
{
    public class Box : FullAuditedAggregateRoot<Guid>
    {
        [NotNull]
        public virtual string Section { get; protected set; }
        public virtual string Title { get; protected set; }
        public virtual string Action { get; protected set; }
        public virtual string ActionUrl { get; protected set; }
        public virtual string Summary { get; protected set; }
        public virtual BoxStatus Status { get; protected set; }
        public virtual string Description { get; protected set; }
        public virtual ICollection<BoxItem> BoxItems { get; protected set; }

        protected Box()
        {

        }
        internal Box(Guid id, [NotNull] string section, string title = null, string action = null, string actionUrl = null, string summary = null, BoxStatus status = BoxStatus.Draft, string description = null) : base(id)
        {
            Check.NotNullOrWhiteSpace(section, nameof(section), maxLength: BoxConsts.SectionMaxLength);
            Check.Length(title, nameof(title), BoxConsts.TitleMaxLength);
            Check.Length(action, nameof(action), BoxConsts.ActionMaxLength);
            Check.Length(actionUrl, nameof(actionUrl), BoxConsts.ActionUrlMaxLength);
            Check.Length(summary, nameof(summary), BoxConsts.SummaryMaxLength);
            Check.Length(description, nameof(description), BoxConsts.DescriptionMaxLength);
            Id = id;
            BoxItems = new List<BoxItem>();
            Section = section;
            Title = title;
            Action = action;
            ActionUrl = actionUrl;
            Summary = summary;
            Status = status;
            Description = description;
        }

        internal virtual void SetSection(string section)
        {
            Section = Check.NotNullOrEmpty(section, nameof(section), BoxConsts.SectionMaxLength);
        }
        public virtual void SetTitle(string title)
        {
            Title = Check.Length(title, nameof(title), BoxConsts.TitleMaxLength);
        }
        public virtual void SetAction(string action)
        {
            Action = Check.Length(action, nameof(action), BoxConsts.ActionMaxLength);
        }
        public virtual void SetActionUrl(string url)
        {
            ActionUrl = Check.Length(url, nameof(url), BoxConsts.ActionUrlMaxLength);
        }

        public virtual void SetSummary(string summary)
        {
            Summary = Check.Length(summary, nameof(summary), BoxConsts.SummaryMaxLength);
        }

        public virtual void SetStatus(BoxStatus status)
        {
            Status = status;
        }
        public virtual void SetDescription(string description)
        {
            Description = Check.Length(description, nameof(description), BoxConsts.DescriptionMaxLength);
        }
        //public Box(Guid id, Guid coverImageMediaId, [NotNull] string description) : base(id)
        //{
        //    Description = Check.NotNullOrWhiteSpace(description, nameof(description), maxLength: CmsKitDemoConsts.MaxDescriptionLength);
        //}
    }
}
