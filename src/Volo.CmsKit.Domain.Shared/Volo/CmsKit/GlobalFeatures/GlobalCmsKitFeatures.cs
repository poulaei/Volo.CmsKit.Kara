﻿using JetBrains.Annotations;
using Volo.Abp.GlobalFeatures;

namespace Volo.CmsKit.GlobalFeatures;

public class GlobalCmsKitFeatures : GlobalModuleFeatures
{
    public const string ModuleName = "CmsKit";

    public ReactionsFeature Reactions => GetFeature<ReactionsFeature>();

    public CommentsFeature Comments => GetFeature<CommentsFeature>();

    public MediaFeature Media => GetFeature<MediaFeature>();

    public RatingsFeature Ratings => GetFeature<RatingsFeature>();

    public TagsFeature Tags => GetFeature<TagsFeature>();

    public PagesFeature Pages => GetFeature<PagesFeature>();

    public BlogsFeature Blogs => GetFeature<BlogsFeature>();

    public CmsUserFeature User => GetFeature<CmsUserFeature>();

    public MenuFeature Menu => GetFeature<MenuFeature>();

    public GlobalResourcesFeature GlobalResources => GetFeature<GlobalResourcesFeature>();
    
    public BlogPostScrollIndexFeature BlogPostScrollIndex => GetFeature<BlogPostScrollIndexFeature>();

    public GalleryImageFeature Gallery => GetFeature<GalleryImageFeature>();
    public BoxFeature Box => GetFeature<BoxFeature>();
    public ContentBoxFeature ContentBox => GetFeature<ContentBoxFeature>();

    public GlobalCmsKitFeatures([NotNull] GlobalFeatureManager featureManager)
        : base(featureManager)
    {
        AddFeature(new ReactionsFeature(this));
        AddFeature(new MediaFeature(this));
        AddFeature(new CommentsFeature(this));
        AddFeature(new RatingsFeature(this));
        AddFeature(new TagsFeature(this));
        AddFeature(new PagesFeature(this));
        AddFeature(new BlogsFeature(this));
        AddFeature(new CmsUserFeature(this));
        AddFeature(new MenuFeature(this));
        AddFeature(new GlobalResourcesFeature(this));
        AddFeature(new BlogPostScrollIndexFeature(this));
        //Added By Poolaei @ @1402/11/27 
        //افزودن فیچر به لیست سراسری فیچرها
        AddFeature(new GalleryImageFeature(this));
        //Added By Poolaei @1403/04/15 
        //افزودن فیچر به لیست سراسری فیچرها
        AddFeature(new BoxFeature(this));
        AddFeature(new ContentBoxFeature(this));
    }
}
