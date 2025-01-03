using System;
using System.Collections.Generic;
using Volo.Abp.ObjectExtending;

namespace Volo.CmsKit.Boxes;
[Serializable]
public class BoxCacheItem : ExtensibleObject
{
    public Guid Id { get; set; }

    public string Section { get; set; }
    public string Title { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }
    public string Summary { get; set; }
    public BoxStatus Status { get; set; }
    public string Description { get; set; }
    public ICollection<BoxItemCacheItem> BoxItems { get; set; }

    public static string GetKey(string section)
    {
        return $"CmsBox_{section}";
    }

}
[Serializable]
public class BoxItemCacheItem : ExtensibleObject
{
    public Guid Id { get; set; }
    public Guid BoxId { get; set; }
    public Guid? MediaId { get; set; }
    public string? Title { get; set; }
    public string? Action { get; set; }
    public string? ActionUrl { get; set; }
    public string? Summary { get; set; }
    public string? Icon { get; set; }
    public virtual string? Description { get; set; }

}