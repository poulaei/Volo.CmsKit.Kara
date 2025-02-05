﻿using System;
using System.Threading.Tasks;
using Shouldly;
using Volo.CmsKit.Public.Boxes;
using Volo.CmsKit.Public.Pages;
using Xunit;

namespace Volo.CmsKit.Pages;

public class PagePublicAppService_Tests : CmsKitApplicationTestBase
{
    private readonly CmsKitTestData _data;
    private readonly IPagePublicAppService _pageAppService;

    public PagePublicAppService_Tests()
    {
        _data = GetRequiredService<CmsKitTestData>();
        _pageAppService = GetRequiredService<IPagePublicAppService>();
    }

    [Fact]
    public async Task ShouldFindByUrlAsync()
    {
        var page = await _pageAppService.FindBySlugAsync(_data.Page_1_Slug);

        page.ShouldNotBeNull();
        page.Title.ShouldBe(_data.Page_1_Title);
    }

    [Fact]
    public async Task ShouldNotGetByUrlAsync()
    {
        var page = await _pageAppService.FindBySlugAsync("not-exist-url");

        page.ShouldBeNull();
    }

    [Fact]
    public async Task DoesSlugExistAsync_ShouldReturnTrue_WhenExists()
    {
        var result = await _pageAppService.DoesSlugExistAsync(_data.Page_1_Slug);

        result.ShouldBeTrue();
    }

    [Fact]
    public async Task DoesSlugExistAsync_ShouldReturnFalse_WhenDoesNotExist()
    {
        var result = await _pageAppService.DoesSlugExistAsync("not-exist-url");

        result.ShouldBeFalse();
    }
}
