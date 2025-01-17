$(function () {
    var l = abp.localization.getResource("CmsKit");
    
    var $createForm = $('#form-content-box-create');
    var $title = $('#ViewModel_Title');
    volo.cmsKit.admin.web.ImageUploader();
    var $buttonSubmit = $('#button-content-box-create');
    var $buttonReturn = $('#button-content-box-return');
    var widgetModal = new abp.ModalManager({ viewUrl: abp.appPath + "CmsKit/Contents/AddWidgetModal", modalClass: "addWidgetModal" });

    $createForm.data('validator').settings.ignore = ":hidden, [contenteditable='true']:not([name]), .tui-popup-wrapper";

    $createForm.on('submit', function (e) {
        e.preventDefault();

        if ($createForm.valid()) {

            abp.ui.setBusy();
            $createForm.ajaxSubmit({
                success: function (result) {
                    abp.notify.success(l('SuccessfullySaved'));
                    abp.ui.clearBusy();
                    location.href = '/Cms/ContentBoxes/Update/' + result.id;
                },
                error: function (result) {
                    abp.ui.clearBusy();
                    abp.notify.error(result.responseJSON.error.message);
                }
            });
        }
    });

    $buttonSubmit.click(function (e) {
        e.preventDefault();
        $createForm.submit();
    });

    $buttonReturn.click(function (e) {
        e.preventDefault();
        location.href = "/Cms/ContentBoxes";
    });

    function initImageUploader() {
        var fileUploadUri = "/api/cms-kit-admin/media/ContentBox";

        var fileInput = document.getElementById("ImageFile");
        var file;
        var deleteButton = document.getElementById("button-delete-image");
        fileInput.addEventListener('change', function () {
            abp.ui.block();
            //abp.ui.setBusy();
            console.log('fileInput - change ',11111111111);
            beforeChangeImage($("#ViewModel_MediaId").val());
            
            file = fileInput.files[0];

            if (file === undefined) {
                $("#ImageFile").val('');
                return;
            }

            var permittedExtensions = ["jpg", "jpeg", "png", "webp"]
            var fileExtension = $(this).val().split('.').pop();
            if (permittedExtensions.indexOf(fileExtension) === -1) {
                abp.message.error(l('ThisExtensionIsNotAllowed'))
                    .then(() => {
                        $("#ImageFile").val('');
                        file = null;
                    });
            }
            else if (file.size > 1024 * 1024) {
                abp.message.error(l('TheFileIsTooBig'))
                    .then(() => {
                        $('#ImageFile').val('');
                        file = null;
                    });
                return;
            }
            abp.ui.setBusy();
            setTimeout(uploadImage, 5000);

           
            abp.ui.clearBusy();
            abp.ui.unblock();
        });
        deleteButton.addEventListener('click', function(){

            deleteImage($("#ViewModel_MediaId").val())
        })
        function uploadImage() {
            var formData = new FormData();
            formData.append("name", file.name);
            formData.append("file", file);
            abp.ui.setBusy();
            $.ajax(
                {
                    url: fileUploadUri,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: "POST",
                    success: function (data) {
                        console.log("Image_MediaId = ", data.id)
                        $("#ViewModel_MediaId").val(data.id);
                        $("#img-upload").attr("src", "/api/cms-kit/media/" + data.id);
                    },
                    error: function (err) {
                        abp.message.error(err.responseJSON.error.message);
                    }
                }
            );
            abp.ui.clearBusy();
        }

        function deleteImage(id) {
            if (!id) {
                abp.message.error('شناسه فایل نا معتبر است');
                return;
            }
            //abp.ui.block();
            abp.ui.setBusy();
            var formData = new FormData();
            formData.append("name", file.name);
            var fileDeleteUri = "/api/cms-kit-admin/media/" + id;
            $.ajax(
                {
                    url: fileDeleteUri,
                    //data: formData,
                    processData: false,
                    contentType: false,
                    type: "DELETE",
                    success: function (data) {
                        $("#ViewModel_MediaId").val('');
                        $("#ImageFile").val('');
                        file = null;
                    },
                    error: function (err) {
                        console.log(err);
                        abp.message.error(err.responseJSON.error.message);
                        abp.ui.clearBusy();
                    }
                }
            );
            //abp.ui.unblock();
            abp.ui.clearBusy();
        }
        function beforeChangeImage(id) {
            console.log("old Id = ", id);
            if (!id) {
                return;
            }
            var fileDeleteUri = "/api/cms-kit-admin/media/" + id;
            $.ajax(
                {
                    url: fileDeleteUri,
                    processData: false,
                    contentType: false,
                    type: "DELETE",
                    success: function (data) {
                       
                    },
                    error: function (err) {
                        
                        abp.message.error(err.responseJSON.error.message);
                        abp.ui.clearBusy();
                    }
                }
            );
           
        }
    };

});
var classHolder = $(document.documentElement);
var fullscreenChange = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";
$(document).bind(fullscreenChange, $.proxy(classHolder.toggleClass, classHolder, "k-fullscreen"));

function toggleFullScreen() {
    var docEl = document.documentElement;

    var fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

    var requestFullScreen = docEl.requestFullscreen ||
        docEl.msRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullscreen;

    var exitFullScreen = document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen;

    if (!requestFullScreen) {
        return;
    }

    if (!fullscreenElement) {
        requestFullScreen.call(docEl, Element.ALLOW_KEYBOARD_INPUT);
    } else {
        exitFullScreen.call(document);
    }
}
