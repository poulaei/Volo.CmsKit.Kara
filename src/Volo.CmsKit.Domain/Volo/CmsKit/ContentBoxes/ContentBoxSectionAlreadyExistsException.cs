using System;
using System.Runtime.Serialization;
using JetBrains.Annotations;
using Volo.Abp;

namespace Volo.CmsKit.ContentBoxes;

[Serializable]
public class ContentBoxSectionAlreadyExistsException : BusinessException
{
    public ContentBoxSectionAlreadyExistsException([NotNull] string section)
    {
        Code = CmsKitErrorCodes.ContentBoxes.SectionAlreadyExist;
        WithData(nameof(ContentBox.Section), section);
    }
}
