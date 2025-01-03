using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Linq;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Hosting;
using Kendo.Mvc.Infrastructure;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace Volo.CmsKit.Admin.Web.Editor;

[Route("api/[controller]")]
[ApiController]
public class UploadController : Controller
{
    private readonly ILogger<UploadController> _logger;
    private readonly IDirectoryBrowser directoryBrowser;
    private readonly IDirectoryPermission permission;
    private const string contentFolderRoot = "shared/";
    private const string folderName = "Images/";
    private static readonly string[] foldersToCopy = new[] { "shared/images/users" };

    protected readonly IHostingEnvironment HostingEnvironment;

    public  string ContentPath
    {
        get
        {
           // return  CreateContentFolder("");
            return CreateUserFolder();
        }
    }
    public UploadController(IHostingEnvironment hostingEnvironment, ILogger<UploadController> logger)
            : this(DI.Current.Resolve<IDirectoryBrowser>(),
                  DI.Current.Resolve<IDirectoryPermission>(),
                  hostingEnvironment, logger)
    {
    }
    public UploadController(
           IDirectoryBrowser directoryBrowser,
           IDirectoryPermission permission,
           IHostingEnvironment hostingEnvironment,
           ILogger<UploadController> logger)
    {
        this.directoryBrowser = directoryBrowser;
        this.directoryBrowser.HostingEnvironment = hostingEnvironment;
        this.permission = permission;
        HostingEnvironment = hostingEnvironment;
        _logger = logger;
    }

    
    [HttpPost]
    [IgnoreAntiforgeryToken()]
    //[Route("Old-upload")]
    public async Task<IActionResult> Upload()
    {

        var formCollection = await Request.ReadFormAsync();
        var file = formCollection.Files.First();
        var path = formCollection["path"];
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }
        var savePath = NormalizePath(path);
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        var filePath = Path.Combine(savePath, fileName);
        var saveVirtualPath = NormalizeVirtualPath(path)+"/";
        var virtualFilePath = Path.Combine(saveVirtualPath, fileName);
        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        catch (Exception ex )
        {

            throw ex;
        }
       

        return Ok(new { filePath= virtualFilePath, fileName });
    }

    [HttpDelete("{fileName}")]
    public IActionResult Remove(string fileName)
    {
        var filePath = Path.Combine("uploads", fileName);

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
            return Ok();
        }

        return NotFound();
    }



    [HttpPost]
    [IgnoreAntiforgeryToken()]
    [Route("new-upload")]
    public virtual async Task<ActionResult> Upload( IFormFile file, string path)
    {
        var fullPath = NormalizePath(path);
        var formCollection =  await Request.ReadFormAsync();
        file = formCollection.Files.First();
        if (AuthorizeUpload(fullPath, file))
        {
            var virtualFullPath = SaveFile(file, fullPath);

            var result = new FileBrowserEntry
            {
                Size = file.Length,
                Name = virtualFullPath// GetFileName(file)
            };
            //Added  By Poolaei @1403/04/05
            //این آپشن برای تغییر 
            //خروجی سریالیاز  و شکل حروف پراپرتی های خروجی
            //افزوده شد که با تنظیمات کلی پروژه متفاوت است
            var jsonOptions = new System.Text.Json.JsonSerializerOptions
            {
                // PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.SnakeCaseLower
            };
            return Json(result, jsonOptions);
        }

        throw new Exception("Forbidden");
    }

    private  bool AuthorizeThumbnail(string path)
    {
        return CanAccess(path);
    }

    
    private  bool AuthorizeUpload(string path, IFormFile file)
    {
        return CanAccess(path) && IsValidFile(GetFileName(file));
    }
    protected virtual string SaveFile(IFormFile file, string pathToSave)
    {
        try
        {
            var path = Path.Combine(pathToSave, GetFileName(file));
            using (var stream = System.IO.File.Create(path))
            {
                file.CopyTo(stream);
            }
            return path;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    private bool IsValidFile(string fileName)
    {
        var extension = Path.GetExtension(fileName);
        var allowedExtensions = Filter.Split(',');

        return allowedExtensions.Any(e => e.Equals("*.*") || e.EndsWith(extension, StringComparison.OrdinalIgnoreCase));
    }
    public  string Filter
    {
        get
        {
            return EditorImageBrowserSettings.DefaultFileTypes;
        }
    }
    private  string GetFileName(IFormFile file)
    {
        var fileContent = ContentDispositionHeaderValue.Parse(file.ContentDisposition);
        return Path.GetFileName(fileContent.FileName.ToString().Trim('"'));
    }
    protected string NormalizeVirtualPath(string path)
    {
        if (string.IsNullOrEmpty(path))
        {
            return Path.Combine(contentFolderRoot, folderName);
        }
        else
        {
            return Path.Combine(contentFolderRoot, folderName, path);
        }
    }
    protected string NormalizePath(string path)
    {
        if (string.IsNullOrEmpty(path))
        {
            return Path.GetFullPath(Path.Combine(HostingEnvironment.WebRootPath, ContentPath));
        }
        else
        {
            return Path.GetFullPath(Path.Combine(HostingEnvironment.WebRootPath, CreateContentFolder(path)));
        }
        
    }
    protected virtual bool CanAccess(string path)
    {
        var rootPath = Path.GetFullPath(Path.Combine(HostingEnvironment.WebRootPath, ContentPath));

        return permission.CanAccess(rootPath, path);
    }
    private string CreateContentFolder(string subFolder)
    {
        var virtualPath = Path.Combine(contentFolderRoot, folderName, subFolder);
        var path = HostingEnvironment.WebRootFileProvider.GetFileInfo(virtualPath).PhysicalPath;

        if (path != null && !Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            foreach (var sourceFolder in foldersToCopy)
            {
                CopyFolder(HostingEnvironment.WebRootFileProvider.GetFileInfo(sourceFolder).PhysicalPath, path);
            }
        }
        return virtualPath;
    }
    private string CreateUserFolder()
    {
        var virtualPath = Path.Combine(contentFolderRoot, "UserFiles", folderName);
        var path = HostingEnvironment.WebRootFileProvider.GetFileInfo(virtualPath).PhysicalPath;
        if (path != null && !Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            foreach (var sourceFolder in foldersToCopy)
            {
                CopyFolder(HostingEnvironment.WebRootFileProvider.GetFileInfo(sourceFolder).PhysicalPath, path);
            }
        }
        return virtualPath;
    }

    private void CopyFolder(string source, string destination)
    {
        if (!Directory.Exists(destination))
        {
            Directory.CreateDirectory(destination);
        }

        foreach (var file in Directory.EnumerateFiles(source))
        {
            var dest = Path.Combine(destination, Path.GetFileName(file));
            System.IO.File.Copy(file, dest);
        }

        foreach (var folder in Directory.EnumerateDirectories(source))
        {
            var dest = Path.Combine(destination, Path.GetFileName(folder));
            CopyFolder(folder, dest);
        }
    }
}


