using System;
using System.Collections.Generic;
using Volo.Abp.ObjectExtending;

namespace Volo.CmsKit.ContentBoxes;
[Serializable]
public class ContentBoxCacheItem : ExtensibleObject
{
    public Guid Id { get; set; }
    public Guid? ParentId { get; set; }
    public string Section { get; set; }
    public  string BoxType { get;  set; }
    public  string BoxName { get;  set; }
    public  string Content { get;  set; }
    public string Title { get; set; }
    public string ActionType { get; set; }
    public string Action { get; set; }
    public string ActionUrl { get; set; }
    public string Summary { get; set; }
    public ContentBoxStatus Status { get; set; }
    public string Description { get; set; }
    public string Icon { get;  set; }
    public int Order { get; set; }
    public Guid? MediaId { get; set; }
    public string ConcurrencyStamp { get; set; }
    //public virtual ICollection<ContentBox> ContentBoxes { get; protected set; }

    public static string GetKey(Guid Id)
    {
        return $"CmsContentBox_{Id}";
    }
    public static string GetSectionKey(string section)
    {
        return $"CmsContentBox_{section}";
    }
}
