﻿using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Admin.ContentBoxes;

[Serializable]
public class ContentBoxGetListInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
}