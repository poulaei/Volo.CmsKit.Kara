using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Volo.CmsKit.Admin.ContentBoxes;

[Serializable]
public class ContentBoxMoveInput
{
    public Guid? NewParentId { get; set; }

    public int Position { get; set; }
}
