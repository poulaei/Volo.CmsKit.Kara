using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp;
using JetBrains.Annotations;
using System.Security.Principal;
using Volo.Abp.Auditing;
using System;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;

namespace Volo.CmsKit.Boxes
{
    public class BoxItem : FullAuditedEntity<Guid>, IHasEntityVersion , IHasExtraProperties//, IHasConcurrencyStamp
    {

        public Guid BoxId { get; protected set; }   
        public Guid? MediaId { get; set; }
        public string? Title { get; protected set; }
        public string? Action { get; protected set; }
        public string? ActionUrl { get; protected set; }
        public string? Summary { get; protected set; }
        public string? Icon { get; protected set; }
        public virtual string? Description { get; protected set; }

        public virtual int EntityVersion { get; protected set; }

        public ExtraPropertyDictionary ExtraProperties { get; protected set; }

       // public string ConcurrencyStamp { get;  set; }

        protected BoxItem()
        {

        }
        protected internal BoxItem(Guid id, Guid boxId, string title, string action, string actionUrl, string summary, string icon, string description, Guid? mediaId = null)
        {
            Check.Length(title, nameof(title), BoxItemConsts.TitleMaxLength);
            Check.Length(action, nameof(action), BoxItemConsts.ActionMaxLength);
            Check.Length(actionUrl, nameof(actionUrl), BoxItemConsts.ActionUrlMaxLength);
            Check.Length(summary, nameof(summary), BoxItemConsts.SummaryMaxLength);
            Check.Length(icon, nameof(icon), BoxItemConsts.IconMaxLength);
            Check.Length(description, nameof(description), BoxItemConsts.DescriptionMaxLength);
            Id = id;
            BoxId = boxId;
            Title = title;
            Action = action;
            ActionUrl = actionUrl;
            Summary = summary;
            Icon = icon;
            Description = description;
            MediaId = mediaId;
        }


    }
}
    