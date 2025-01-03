using System;
using System.Collections.Generic;
using Volo.Abp.Data;
using Volo.Abp.ObjectExtending;
using Volo.CmsKit.Boxes;

namespace Volo.CmsKit;

/// <summary>
/// Hierarchy node class which contains a nested collection of hierarchy nodes
/// </summary>
/// <typeparam name="T">Entity</typeparam>
/// 
[Serializable]
public class HierarchyNode<T> where T : class
{
    public T Item { get; set; }
    public IEnumerable<HierarchyNode<T>>? SubItems { get; set; }
    public int Depth { get; set; }
    public T? Parent { get; set; }
}

[Serializable]
public class TreeNode
{
    public Guid Id { get; set; }
    public Guid? ParentId { get; set; }
    public string Title { get; set; }
    public string Link { get; set; }
    public List<TreeNode> Children { get; set; }
    public ExtraPropertyDictionary ExtraProperties { get; set; }
}

[Serializable]
public class ContentBoxTree
{
    public Guid Id { get; set; }
    public Guid? ParentId { get; set; }
    public required string Section { get; set; }
    public required string BoxType { get; set; }
    public required string BoxName { get; set; }
    public string Content { get; set; }
    public string Title { get; set; }
    public string ActionType { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }
    public string Summary { get; set; }
    public BoxStatus Status { get; set; }
    public string? Icon { get; set; }
    public string Description { get; set; }
    public Guid? MediaId { get; set; }
    public string ConcurrencyStamp { get; set; }
    public List<ContentBoxTree> Children { get; set; }
    public ExtraPropertyDictionary ExtraProperties { get; set; }
}