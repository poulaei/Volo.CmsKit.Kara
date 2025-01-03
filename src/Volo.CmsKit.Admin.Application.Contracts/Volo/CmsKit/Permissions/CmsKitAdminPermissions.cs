namespace Volo.CmsKit.Permissions;

public static class CmsKitAdminPermissions
{
    public const string GroupName = "CmsKit";

    public static class Comments
    {
        public const string Default = GroupName + ".Comments";
        public const string Delete = Default + ".Delete";
    }

    public static class Tags
    {
        public const string Default = GroupName + ".Tags";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }

    public static class Contents
    {
        public const string Default = GroupName + ".Contents";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }

    public static class Pages
    {
        public const string Default = GroupName + ".Pages";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
        public const string SetAsHomePage = Default + ".SetAsHomePage";
    }

    public static class Blogs
    {
        public const string Default = GroupName + ".Blogs";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
        public const string Features = Default + ".Features";
    }

    public static class BlogPosts
    {
        public const string Default = GroupName + ".BlogPosts";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
        public const string Publish = Default + ".Publish";
    }

    public static class Menus
    {
        public const string Default = GroupName + ".Menus";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }

    public static class GlobalResources
    {
        public const string Default = GroupName + ".GlobalResources";
    }
    //Added by poolaei @1402/12/21==========================
    public static class GalleryImages
    {
        public const string Default = GroupName + ".GalleryImages";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }
    
    public static class Boxes
    {
        public const string Default = GroupName + ".Boxes";

        //public const string Management = Default + ".Management";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }
    public static class BoxItems
    {
        public const string Default = GroupName + ".BoxItems";

       // public const string Management = Root + ".Management";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }
    //===================================================


    //Added by poolaei @1403/04/13==========================
    public static class ContentBoxes
    {
        public const string Default = GroupName + ".ContentBoxes";

        //public const string Management = Default + ".Management";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }
    //===================================================

}
