using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Data;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Menus;

namespace Volo.CmsKit;

// Stefan Cruysberghs, July 2008, http://www.scip.be
/// <summary>
/// AsHierarchy extension methods for LINQ to Objects IEnumerable
/// </summary>
public static class LinqToObjectsExtensionMethods
{
    private static IEnumerable<HierarchyNode<TEntity>>
      CreateHierarchy<TEntity, TProperty>(
        IEnumerable<TEntity> allItems,
        TEntity parentItem,
        Func<TEntity, TProperty> idProperty,
        Func<TEntity, TProperty> parentIdProperty,
        object rootItemId,
        int maxDepth,
        int depth) where TEntity : class
    {
        IEnumerable<TEntity> childs;

        if (rootItemId != null)
        {
            childs = allItems.Where(i => idProperty(i).Equals(rootItemId));
        }
        else
        {
            if (parentItem == null)
            {
                childs = allItems.Where(i => parentIdProperty(i).Equals(default(TProperty)));
            }
            else
            {
                childs = allItems.Where(i => parentIdProperty(i).Equals(idProperty(parentItem)));
            }
        }

        if (childs.Count() > 0)
        {
            depth++;

            if ((depth <= maxDepth) || (maxDepth == 0))
            {
                foreach (var item in childs)
                    yield return
                      new HierarchyNode<TEntity>()
                      {
                          Item = item,
                          SubItems =
                            CreateHierarchy(allItems.AsEnumerable(), item, idProperty, parentIdProperty, null, maxDepth, depth),
                          Depth = depth,
                          Parent = parentItem
                      };
            }
        }
    }

    /// <summary>
    /// LINQ to Objects (IEnumerable) AsHierachy() extension method
    /// </summary>
    /// <typeparam name="TEntity">Entity class</typeparam>
    /// <typeparam name="TProperty">Property of entity class</typeparam>
    /// <param name="allItems">Flat collection of entities</param>
    /// <param name="idProperty">Func delegete to Id/Key of entity</param>
    /// <param name="parentIdProperty">Func delegete to parent Id/Key</param>
    /// <returns>Hierarchical structure of entities</returns>
    public static IEnumerable<HierarchyNode<TEntity>> AsHierarchy<TEntity, TProperty>(
      this IEnumerable<TEntity> allItems,
      Func<TEntity, TProperty> idProperty,
      Func<TEntity, TProperty> parentIdProperty) where TEntity : class
    {
        return CreateHierarchy(allItems, default(TEntity), idProperty, parentIdProperty, null, 0, 0);
    }

    /// <summary>
    /// LINQ to Objects (IEnumerable) AsHierachy() extension method
    /// </summary>
    /// <typeparam name="TEntity">Entity class</typeparam>
    /// <typeparam name="TProperty">Property of entity class</typeparam>
    /// <param name="allItems">Flat collection of entities</param>
    /// <param name="idProperty">Func delegete to Id/Key of entity</param>
    /// <param name="parentIdProperty">Func delegete to parent Id/Key</param>
    /// <param name="rootItemId">Value of root item Id/Key</param>
    /// <returns>Hierarchical structure of entities</returns>
    public static IEnumerable<HierarchyNode<TEntity>> AsHierarchy<TEntity, TProperty>(
      this IEnumerable<TEntity> allItems,
      Func<TEntity, TProperty> idProperty,
      Func<TEntity, TProperty> parentIdProperty,
      object rootItemId) where TEntity : class
    {
        return CreateHierarchy(allItems, default(TEntity), idProperty, parentIdProperty, rootItemId, 0, 0);
    }

    /// <summary>
    /// LINQ to Objects (IEnumerable) AsHierachy() extension method
    /// </summary>
    /// <typeparam name="TEntity">Entity class</typeparam>
    /// <typeparam name="TProperty">Property of entity class</typeparam>
    /// <param name="allItems">Flat collection of entities</param>
    /// <param name="idProperty">Func delegete to Id/Key of entity</param>
    /// <param name="parentIdProperty">Func delegete to parent Id/Key</param>
    /// <param name="rootItemId">Value of root item Id/Key</param>
    /// <param name="maxDepth">Maximum depth of tree</param>
    /// <returns>Hierarchical structure of entities</returns>
    public static IEnumerable<HierarchyNode<TEntity>> AsHierarchy<TEntity, TProperty>(
      this IEnumerable<TEntity> allItems,
      Func<TEntity, TProperty> idProperty,
      Func<TEntity, TProperty> parentIdProperty,
      object rootItemId,
      int maxDepth) where TEntity : class
    {
        return CreateHierarchy(allItems, default(TEntity), idProperty, parentIdProperty, rootItemId, maxDepth, 0);
    }


    public static List<TreeNode> FlatToTree(List<RoyanMenuItemDto> data, Guid? parentId = null)
    {
        List<TreeNode> tree = new List<TreeNode>();


        foreach (var item in data)
        {
            if (item.ParentId == parentId)
            {
                TreeNode node = new TreeNode
                {
                    Id = item.Id,
                    ParentId=item.ParentId,
                    Title = item.DisplayName,
                    Link = item.Url,
                    Children = FlatToTree(data, item.Id),
                    ExtraProperties = item.ExtraProperties
                };
                tree.Add(node);
            }
        }

        return tree;
    }

    /// <summary>
    /// بدون محتوی
    /// ContentBoxTree.Content
    /// </summary>
    /// <param name="data"></param>
    /// <param name="parentId"></param>
    /// <returns></returns>
    public static List<ContentBoxTree> FlatToTree(List<ContentBoxCommonDto> data, Guid? parentId = null)
    {
        List<ContentBoxTree> tree = new List<ContentBoxTree>();
        foreach (var item in data)
        {
            if (item.ParentId == parentId)
            {
                ContentBoxTree node = new ContentBoxTree
                {
                    Id = item.Id,
                    ParentId = item.ParentId,
                    Section = item.Section,
                    BoxType = item.BoxType,
                    BoxName = item.BoxName,
                    Title = item.Title,
                    ActionType = item.ActionType,
                    Action = item.Action,
                    ActionUrl = item.ActionUrl,
                    Summary = item.Summary,
                    Status = item.Status,
                    Icon = item.Icon,
                    Description = item.Description,
                    MediaId = item.MediaId,
                   // ConcurrencyStamp = item.ConcurrencyStamp,
                    Children = FlatToTree(data, item.Id),
                    ExtraProperties = item.ExtraProperties
                };
                tree.Add(node);
            }
        }
        return tree;
    }

    public static List<ContentBoxTree> FlatToTree1(List<ContentBoxCommonDto> data, Guid? parentId = null)
    {
        List<ContentBoxTree> tree = new List<ContentBoxTree>();
        foreach (var item in data)
        {
            if (item.ParentId == parentId)
            {
                ContentBoxTree node = new ContentBoxTree
                {
                    Id = item.Id,
                    ParentId = item.ParentId,
                    Section = item.Section,
                    BoxType = item.BoxType,
                    BoxName = item.BoxName,
                    Content= item.Content,
                    Title = item.Title,
                    ActionType = item.ActionType,
                    Action = item.Action,
                    ActionUrl = item.ActionUrl,
                    Summary = item.Summary,
                    Status = item.Status,
                    Icon = item.Icon,
                    Description = item.Description,
                    MediaId = item.MediaId,
                    //ConcurrencyStamp = item.ConcurrencyStamp,
                    Children = FlatToTree1(data, item.Id),
                    ExtraProperties = item.ExtraProperties
                };
                tree.Add(node);
            }
        }
        return tree;
    }

    public static List<ContentBoxTree> FlatToTree(List<ContentBoxCommonDto> data)
    {
        List<ContentBoxTree> tree = new List<ContentBoxTree>();
        var parentId= data[0].ParentId;
        foreach (var item in data)
        {
            if (item.ParentId == parentId)
            {
                ContentBoxTree node = new ContentBoxTree
                {
                    Id = item.Id,
                    ParentId = item.ParentId,
                    Section = item.Section,
                    BoxType = item.BoxType,
                    BoxName = item.BoxName,
                    Content = item.Content,
                    Title = item.Title,
                    ActionType = item.ActionType,
                    Action = item.Action,
                    ActionUrl = item.ActionUrl,
                    Summary = item.Summary,
                    Status = item.Status,
                    Icon = item.Icon,
                    Description = item.Description,
                    MediaId = item.MediaId,
                   // ConcurrencyStamp = item.ConcurrencyStamp,
                    Children = FlatToTree(data, item.Id),
                    ExtraProperties = item.ExtraProperties
                };
                tree.Add(node);
            }
        }
        return tree;
    }

    public static List<ContentBoxTree> HierarchyToTree(List<HierarchyNode<ContentBoxCommonDto>> data)
    {
        List<ContentBoxTree> tree = new List<ContentBoxTree>();
        foreach (var d in data)
        {
                ContentBoxTree node = new ContentBoxTree
                {
                    Id = d.Item.Id,
                    ParentId = d.Item.ParentId,
                    Section = d.Item.Section,
                    BoxType = d.Item.BoxType,
                    BoxName = d.Item.BoxName,
                    Content = d.Item.Content,
                    Title = d.Item.Title,
                    ActionType = d.Item.ActionType,
                    Action = d.Item.Action,
                    ActionUrl = d.Item.ActionUrl,
                    Summary = d.Item.Summary,
                    Status = d.Item.Status,
                    Icon = d.Item.Icon,
                    Description = d.Item.Description,
                    MediaId = d.Item.MediaId,
                   // ConcurrencyStamp = d.Item.ConcurrencyStamp,
                    Children = HierarchyToTree(d.SubItems.ToList()),
                    ExtraProperties = d.Item.ExtraProperties
                };
                tree.Add(node);
        }
        return tree;
    }
}
