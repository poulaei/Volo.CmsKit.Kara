using JetBrains.Annotations;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.CmsKit.Contents;

namespace Volo.CmsKit.Public.Boxes;

public interface IBoxPublicAppService : IApplicationService
{
    Task<ListResultDto<BoxDto>> GetBoxItemsAsync(Guid boxId);

    Task<PagedResultDto<BoxDto>> GetListAsync(BoxGetListInput input);
    Task<BoxDto> GetBySectionAsync(string section);
    Task<BoxDto> FindBySectionAsync([NotNull] string section);
  
}
