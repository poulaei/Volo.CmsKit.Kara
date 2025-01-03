using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class BoxItemDto : EntityDto<Guid>//, IHasConcurrencyStamp//, IHasCreationTime, IHasModificationTime
{
    public Guid BoxId { get; set; }
    public string? Title { get; set; }
    public string? Action { get; set; }
    public string? ActionUrl { get; set; }
    public string? Summary { get; set; }
    public string? Icon { get; set; }
    public string? Description { get; set; }
    //public string ConcurrencyStamp { get; set; }
    public Guid? MediaId { get; set; }

    //public DateTime CreationTime => throw new NotImplementedException();

    //public DateTime? LastModificationTime => throw new NotImplementedException();
}
