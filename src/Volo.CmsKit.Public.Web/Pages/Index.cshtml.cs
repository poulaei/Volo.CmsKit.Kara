using AutoMapper;
using CmsKitDemo.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Public.ContentBoxes;

namespace Volo.CmsKit.Pages;

public class IndexModel : AbpPageModel
{
    private readonly IGalleryImagePublicAppService _imageGalleryAppService;
    private readonly IContentBoxPublicAppService _contentBoxPublicAppService;

    public ContentBoxViewModel BannerViewModel { get; set; }
    public ContentBoxViewModel AboutViewModel { get; set; }
    public ContentBoxViewModel CounterViewModel { get; set; }
    public ContentBoxViewModel VideoViewModel { get; set; } = new ContentBoxViewModel();
    public ContentBoxViewModel PartnerSliderViewModel { get; set; }
    public ContentBoxViewModel ServiceSliderViewModel { get; set; }
    public ContentBoxViewModel ProjectViewModel { get; set; }
    public ContentBoxViewModel TeamViewModel { get; set; }
    public ContentBoxViewModel TestimonialViewModel { get; set; }
    public ContentBoxViewModel BlogViewModel { get; set; }
    public ContentBoxViewModel SubscribeViewModel { get; set; }
    //public GalleryImageCommonDto Image { get; set; }
    public IndexModel(IGalleryImagePublicAppService imageGalleryAppService, IContentBoxPublicAppService contentBoxPublicAppService)
    {
        _imageGalleryAppService = imageGalleryAppService;
        _contentBoxPublicAppService = contentBoxPublicAppService;
    }
    public async Task OnGetAsync()
    {
        //Image = await _imageGalleryAppService.GetAsync(Guid.Parse("7f98c48b-3e5a-e138-9fb8-3a16c84da585"));
        var banner = await _contentBoxPublicAppService.GetTreeBySectionAsync("Banner");
        BannerViewModel = ObjectMapper.Map<ContentBoxTree, ContentBoxViewModel>(banner.First());
        var about = await _contentBoxPublicAppService.GetTreeBySectionAsync("About");
        AboutViewModel = ObjectMapper.Map<ContentBoxTree, ContentBoxViewModel>(about.First());
        //var counter = await _contentBoxPublicAppService.GetTreeBySectionAsync("Counter");
        //CounterViewModel = ObjectMapper.Map<ContentBoxTree, ContentBoxViewModel>(counter.First());
        var video = await _contentBoxPublicAppService.GetTreeBySectionAsync("Video");
       VideoViewModel = ObjectMapper.Map<ContentBoxTree, ContentBoxViewModel>(video.First());
    }
    public class HomePageViewModel
    {
        public Guid? MediaId { get; set; }
    }
    [AutoMap(typeof(ContentBoxTree))]
    public class ContentBoxViewModel : ExtensibleObject
    {
        public Guid? ParentId { get; set; }
        public string Section { get; set; }
        public string BoxType { get; set; }
        public string BoxName { get; set; }
        public string Content { get; set; }
        public string? Title { get; set; }
        public virtual string? ActionType { get; set; }
        public string? Action { get; set; }
        public string? ActionUrl { get; set; }
        public string? Summary { get; set; }
        public ContentBoxStatus Status { get; set; }
        public string? Icon { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public Guid? MediaId { get; set; }
        public List<ContentBoxViewModel> Children { get; set; }

    }
}