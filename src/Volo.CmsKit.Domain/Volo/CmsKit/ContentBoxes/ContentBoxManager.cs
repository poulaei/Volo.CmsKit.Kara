using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Services;
using Volo.Abp.Uow;
using Volo.CmsKit.Menus;

namespace Volo.CmsKit.ContentBoxes;

public class ContentBoxManager : DomainService
{
    protected IContentBoxRepository ContentBoxRepository { get; }

    public ContentBoxManager(IContentBoxRepository boxRepository)
    {
        ContentBoxRepository = boxRepository;
    }

    public virtual async Task<ContentBox> CreateAsync(

        [NotNull] string section,
        Guid? parentId ,
        [NotNull] string boxType,
        [NotNull] string boxName,
        [CanBeNull] string content = null,
        string title = null,
        string actionType = null,
        string action = null,
        string actionUrl = null,
        string summary = null,
        ContentBoxStatus status = ContentBoxStatus.Draft,
        string description = null,
        string icon = null,
        int order = 0,
        Guid? mediaId = null)
    {
        Check.NotNullOrEmpty(section, nameof(section));

        await CheckSectionAsync(section);
        return new ContentBox(GuidGenerator.Create(),
                       parentId,
                       section,
                       boxType,
                       boxName,
                       content,
                       title,
                       action,
                       actionType,
                       actionUrl,
                       summary,
                       status,
                       description,
                       icon,
                       order,
                       mediaId);
    }

    public virtual async Task SetSectionAsync(ContentBox ContentBox, [NotNull] string newSection)
    {
        if (ContentBox.Section != newSection)
        {
            await CheckSectionAsync(newSection);
            ContentBox.SetSection(newSection);
        }
    }

    protected virtual async Task CheckSectionAsync(string section)
    {
        if (await ContentBoxRepository.SectionExistsAsync(section))
        {
            throw new ContentBoxSectionAlreadyExistsException(section);
        }
    }

    [UnitOfWork]
    public virtual async Task MoveAsync(Guid id, Guid? newParentId, int position = 0)
    {
        var items = await ContentBoxRepository.GetListAsync();

        var movedItem = items.FirstOrDefault(x => x.Id == id)
                       ?? throw new EntityNotFoundException(typeof(ContentBox), id);

        if (newParentId.HasValue && !items.Any(a => a.Id == newParentId.Value))
        {
            throw new EntityNotFoundException(typeof(ContentBox), newParentId);
        }

        movedItem.SetParent(newParentId);
        movedItem.SetOrder(position);

        OrganizeTreeOrderForContentBox(items, movedItem);

        await ContentBoxRepository.UpdateManyAsync(items);
    }

    public virtual void OrganizeTreeOrderForContentBox(List<ContentBox> items, ContentBox item)
    {
        var sameTree = items.Where(x => x.ParentId == item.ParentId).OrderBy(x => x.Order).ToList();

        sameTree.Remove(item); // Remove if exists to prevent misordering with same order number

        sameTree.Insert(item.Order, item);

        for (int i = 0; i < sameTree.Count; i++)
        {
            //sameTree[i].Order = i;
            sameTree[i].SetOrder(i);
        }
    }
}
