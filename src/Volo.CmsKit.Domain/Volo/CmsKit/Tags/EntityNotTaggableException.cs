using System;
using System.Runtime.Serialization;
using Volo.Abp;

namespace Volo.CmsKit.Tags;

[Serializable]
public class EntityNotTaggableException : BusinessException
{
    public EntityNotTaggableException(string entityType)
    {
        Code = CmsKitErrorCodes.Tags.EntityNotTaggable;
        WithData(nameof(Tag.EntityType), entityType);
    }
}
