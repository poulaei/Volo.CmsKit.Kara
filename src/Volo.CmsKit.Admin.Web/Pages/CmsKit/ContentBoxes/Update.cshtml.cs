using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using Volo.Abp.Domain.Entities;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.Admin.ContentBoxes;
using Volo.CmsKit.Admin.Pages;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Pages;

namespace Volo.CmsKit.Admin.Web.Pages.CmsKit.ContentBoxes;

public class UpdateModel : CmsKitAdminPageModel
{
    [BindProperty(SupportsGet = true)]
    [HiddenInput]
    public Guid Id { get; set; }

    [BindProperty]
    public UpdateContentBoxViewModel ViewModel { get; set; }

    protected readonly IContentBoxAdminAppService contentBoxAdminAppService;

    public UpdateModel(IContentBoxAdminAppService contentBoxAdminAppService)
    {
        this.contentBoxAdminAppService = contentBoxAdminAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await contentBoxAdminAppService.GetAsync(Id);

        ViewModel = ObjectMapper.Map<ContentBoxDto, UpdateContentBoxViewModel>(dto);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var updateInput = ObjectMapper.Map<UpdateContentBoxViewModel, UpdateContentBoxDto>(ViewModel);

        await contentBoxAdminAppService.UpdateAsync(Id, updateInput);
        return new OkObjectResult(Id);
    }

    [AutoMap(typeof(ContentBoxDto))]
    [AutoMap(typeof(UpdateContentBoxDto), ReverseMap = true)]
    public class UpdateContentBoxViewModel : ExtensibleObject, IHasConcurrencyStamp
    {
        public Guid? ParentId { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.SectionMaxLength))]
        public string Section { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxTypeMaxLength))]
        public string BoxType { get; set; }
        [Required]
        [DynamicMaxLength(typeof(ContentBoxConsts), nameof(ContentBoxConsts.BoxNameMaxLength))]
        public string BoxName { get; set; }
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

        [HiddenInput]
        public string ConcurrencyStamp { get; set; }
    }
}
