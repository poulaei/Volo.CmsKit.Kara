using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Domain.Services;

namespace Volo.CmsKit.Boxes;

public class BoxManager : DomainService
{
    protected IBoxRepository BoxRepository { get; }

    public BoxManager(IBoxRepository boxRepository)
    {
        BoxRepository = boxRepository;
    }

    public virtual async Task<Box> CreateAsync(

        [NotNull] string section,
        string title = null,
        string action = null,
        string actionUrl = null,
        string summary = null,
        BoxStatus status = BoxStatus.Draft,
        string description = null)
    {
        Check.NotNullOrEmpty(section, nameof(section));

        await CheckBoxSectionAsync(section);
        return new Box(GuidGenerator.Create(),
                       section,
                       title,
                       action,
                       actionUrl,
                       summary,
                       status,
                       description);
    }

    public virtual async Task SetSectionAsync(Box Box, [NotNull] string newSection)
    {
        if (Box.Section != newSection)
        {
            await CheckBoxSectionAsync(newSection);
            Box.SetSection(newSection);
        }
    }

    protected virtual async Task CheckBoxSectionAsync(string section)
    {
        if (await BoxRepository.SectionExistsAsync(section))
        {
            throw new BoxSectionAlreadyExistsException(section);
        }
    }
}
