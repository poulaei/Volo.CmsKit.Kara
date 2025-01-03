using System;
using System.Runtime.Serialization;
using JetBrains.Annotations;
using Volo.Abp;

namespace Volo.CmsKit.Boxes;

[Serializable]
public class BoxSectionAlreadyExistsException : BusinessException
{
    public BoxSectionAlreadyExistsException([NotNull] string section)
    {
        Code = CmsKitErrorCodes.Boxes.SectionAlreadyExist;
        WithData(nameof(Box.Section), section);
    }

 }
