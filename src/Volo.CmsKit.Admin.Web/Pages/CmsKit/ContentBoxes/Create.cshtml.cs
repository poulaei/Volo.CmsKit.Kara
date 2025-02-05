﻿    using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
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
using static Volo.CmsKit.Admin.Web.Pages.CmsKit.ContentBoxes.UpdateModel;

namespace Volo.CmsKit.Admin.Web.Pages.CmsKit.ContentBoxes;

public class CreateModel : CmsKitAdminPageModel
{
    protected readonly IContentBoxAdminAppService contentBoxAdminAppService;
    [BindProperty(SupportsGet = true)]
    [HiddenInput]
    public Guid? ParentId { get; set; }

    [BindProperty]
    public CreateContentBoxViewModel ViewModel { get; set; }

    public CreateModel(IContentBoxAdminAppService contentBoxAdminAppService)
    {
        this.contentBoxAdminAppService = contentBoxAdminAppService;
        ViewModel = new CreateContentBoxViewModel();
    }
    public async Task OnGetAsync()
    {
        // ViewData["ParentId"] = ParentId;
        
        if (ParentId.HasValue && Guid.TryParse(ParentId.Value.ToString(), out Guid result))
        {
            if (result == Guid.Empty)
                await Task.Run(() => ViewModel.ParentId = null);
            else
            {
                try
                {
                    var dto = await contentBoxAdminAppService.GetAsync(ParentId.Value);
                }
                catch (Exception)
                {

                    throw new EntityNotFoundException();
                }
                await Task.Run(() => ViewModel.ParentId = result);
            }
        }
        else
        {
            throw new FormatException();
        }
      

        //return new OkObjectResult(ParentId);
    }

    //public void OnGetCreate()
    //{
    //    ViewData["ParentId"] = null;
    //}

    //public void OnGetCreateSubItem(int parentId)
    //{
        
    //}

    public async Task<IActionResult> OnPostAsync()
    {
        var createInput = ObjectMapper.Map<CreateContentBoxViewModel, CreateContentBoxDto>(ViewModel);

        var created = await contentBoxAdminAppService.CreateAsync(createInput);

        return new OkObjectResult(created);
    }

    [AutoMap(typeof(CreateContentBoxDto), ReverseMap = true)]
    public class CreateContentBoxViewModel : ExtensibleObject
    {
        [HiddenInput]
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
        [HiddenInput]
        public Guid? MediaId { get; set; }
    }
}
