using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Volo.CmsKit.Menus;
//این اینترفیس برای کلاسی است که  جنبه آموزش و تحقیق دارد
public interface IRoyanMenuItemAppService : IApplicationService
{
    Task<List<HierarchyNode<RoyanMenuItemDto>>> GetHierarchyAsync1111111111();
}
