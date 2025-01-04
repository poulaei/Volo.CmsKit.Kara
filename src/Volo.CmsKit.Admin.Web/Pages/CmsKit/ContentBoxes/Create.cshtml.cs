using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.Admin.ContentBoxes;
using Volo.CmsKit.Admin.Pages;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Pages;

namespace Volo.CmsKit.Admin.Web.Pages.CmsKit.ContentBoxes;

public class CreateModel : CmsKitAdminPageModel
{
    protected readonly IContentBoxAdminAppService contentBoxAdminAppService;

    [BindProperty]
    public CreateContentBoxViewModel ViewModel { get; set; }

    public CreateModel(IContentBoxAdminAppService contentBoxAdminAppService)
    {
        this.contentBoxAdminAppService = contentBoxAdminAppService;
        ViewModel = new CreateContentBoxViewModel();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var createInput = ObjectMapper.Map<CreateContentBoxViewModel, CreateContentBoxDto>(ViewModel);

        var created = await contentBoxAdminAppService.CreateAsync(createInput);

        return new OkObjectResult(created);
    }

    [AutoMap(typeof(CreateContentBoxDto), ReverseMap = true)]
    public class CreateContentBoxViewModel : ExtensibleObject
    {
        public Guid? ParentId { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.SectionMaxLength))]
        public  string Section { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxTypeMaxLength))]
        public  string BoxType { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxNameMaxLength))]
        public  string BoxName { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ContentMaxLength))]
        public string Content { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.TitleMaxLength))]
        public string? Title { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionTypeMaxLength))]
        public virtual string? ActionType { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionMaxLength))]
        public string? Action { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.ActionUrlMaxLength))]
        public string? ActionUrl { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.SummaryMaxLength))]
        public string? Summary { get; set; }
        public ContentBoxStatus Status { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.IconMaxLength))]
        public string? Icon { get; set; }
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.DescriptionMaxLength))]
        public string? Description { get; set; }
        public int Order { get; set; }
        public Guid? MediaId { get; set; }
    }
}
