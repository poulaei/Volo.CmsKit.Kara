using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp;
using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp.Data;
using System.Threading.Tasks.Dataflow;

namespace Volo.CmsKit.ContentBoxes
{
    public class ContentBox : FullAuditedAggregateRoot<Guid>
    {
        public Guid? ParentId { get; protected set; }
        [NotNull]
        public virtual string Section { get; protected set; }
        public virtual string BoxType { get; protected set; }
        public virtual string BoxName { get; protected set; }
        public virtual string Content { get; protected set; }
        public virtual string Title { get; protected set; }
        public virtual string ActionType { get; protected set; }
        public virtual string Action { get; protected set; }
        public virtual string ActionUrl { get; protected set; }
        public virtual string Summary { get; protected set; }
        public virtual ContentBoxStatus Status { get; protected set; }
        public virtual string Description { get; protected set; }
        public virtual string Icon { get; protected set; }
        public Guid? MediaId { get;  set; }

        public int Order { get; protected set; }
        //public virtual ICollection<ContentBox> ContentBoxes { get; protected set; }

        public ContentBox()
        {

        }
        public ContentBox(Guid id,
                            Guid? parentId,
                            [NotNull] string section,
                             [CanBeNull] string boxType,
                             [CanBeNull] string boxName,
                            [CanBeNull] string content=null,
                            [CanBeNull] string title = null,
                            [CanBeNull] string action = null, 
                            [CanBeNull] string actionType = null, 
                            [CanBeNull] string actionUrl = null,
                            [CanBeNull] string summary = null, 
                            ContentBoxStatus status = ContentBoxStatus.Draft, 
                            [CanBeNull] string description = null,
                            [CanBeNull] string icon=null,
                            int order = 0,
                            [CanBeNull] Guid? mediaId = null) : base(id)
        {

            Id = id;
            //ContentBoxes = new List<ContentBox>();
            ParentId = parentId;
            SetSection(section);
            SetBoxType(boxType);
            SetBoxName(boxName);
            SetContent(content);
            SetTitle(title);
            SetAction(action);
            SetActionType(actionType);
            SetActionUrl(actionUrl);
            SetSummary(summary);
            SetStatus(status);
            SetDescription(description);
            SetIcon(icon);
            SetOrder(order);
            MediaId = mediaId;
        }
        internal virtual void SetParent(Guid? parentId)
        {
            ParentId = parentId;
        }
        public virtual void SetBoxType(string boxType)
        {
            BoxType = Check.Length(boxType, nameof(boxType), ContentBoxConsts.BoxTypeMaxLength);
        }public virtual void SetBoxName(string boxName)
        {
            BoxName = Check.Length(boxName, nameof(boxName), ContentBoxConsts.BoxNameMaxLength);
        }public virtual void SetContent(string content)
        {
            Content = Check.Length(content, nameof(content), ContentBoxConsts.ContentMaxLength);
        }
        public virtual void SetSection(string section)
        {
            Section = Check.NotNullOrWhiteSpace(section, nameof(section), ContentBoxConsts.SectionMaxLength);
        }
        public virtual void SetTitle(string title)
        {
            Title = Check.Length(title, nameof(title), ContentBoxConsts.TitleMaxLength);
        }
        public virtual void SetActionType(string actionType)
        {
            ActionType = Check.Length(actionType, nameof(actionType), ContentBoxConsts.ActionTypeMaxLength);
        }
        public virtual void SetAction(string action)
        {
            Action = Check.Length(action, nameof(action), ContentBoxConsts.ActionMaxLength);
        }
        public virtual void SetActionUrl(string actionUrl)
        {
            ActionUrl = Check.Length(actionUrl, nameof(actionUrl), ContentBoxConsts.ActionUrlMaxLength);
        }

        public virtual void SetSummary(string summary)
        {
            Summary = Check.Length(summary, nameof(summary), ContentBoxConsts.SummaryMaxLength);
        }

        public virtual void SetStatus(ContentBoxStatus status)
        {
            Status = status;
        }
        public virtual void SetIcon(string icon)
        {
            Icon = Check.Length(icon, nameof(icon), ContentBoxConsts.IconMaxLength);
        }
        public virtual void SetDescription(string description)
        {
            Description = Check.Length(description, nameof(description), ContentBoxConsts.DescriptionMaxLength);
        }
        public virtual void SetOrder(int order=0)
        {
            Order = order;
        }

    }
}
