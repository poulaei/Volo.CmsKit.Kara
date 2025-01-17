$(function () {
    volo.cmsKit.admin.web.ImageUploader = function initImageUploader() {
        var fileUploadUri = "/api/cms-kit-admin/media/ContentBox";
        var id = $("#ViewModel_MediaId").val();
        if (id) {
            abp.ui.setBusy();
            $("#img-upload").attr("src", "/api/cms-kit/media/" + id);
            abp.ui.clearBusy();
        }
       
        var fileInput = document.getElementById("ImageFile");
        var file;
        var deleteButton = document.getElementById("button-delete-image");
        fileInput.addEventListener('change', function () {
            abp.ui.block();
            //abp.ui.setBusy();
            beforeChangeImage($("#ViewModel_MediaId").val());

            file = fileInput.files[0];

            if (file === undefined) {
                $("#ImageFile").val('');
                return;
            }

            var permittedExtensions = ["jpg", "jpeg", "png", "webp","mp4","webm","ogg"]
            var fileExtension = $(this).val().split('.').pop();
            if (permittedExtensions.indexOf(fileExtension) === -1) {
                abp.message.error(l('ThisExtensionIsNotAllowed'))
                    .then(() => {
                        $("#ImageFile").val('');
                        file = null;
                    });
            }
            else if (file.size > 1024 * 1024 * 5) {
                abp.message.error(l('TheFileIsTooBig'))
                    .then(() => {
                        $('#ImageFile').val('');
                        file = null;
                    });
                return;
            }
            abp.ui.setBusy();
            setTimeout(uploadImage, 1000);


            abp.ui.clearBusy();
            abp.ui.unblock();
        });
        deleteButton.addEventListener('click', function () {

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
            //var formData = new FormData();
            //formData.append("id", id);
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
                        $("#img-upload").attr("src", "/images/no-image.png");
                        $("#ImageFile").val('');
                        file = null;
                    },
                    error: function (err) {
                        $("#ViewModel_MediaId").val('');
                        $("#img-upload").attr("src", "/images/no-image.png");
                        $("#ImageFile").val('');
                        file = null;
                        abp.message.error(err.responseJSON.error.message);
                        abp.ui.clearBusy();
                    }
                }
            );
            //abp.ui.unblock();
            abp.ui.clearBusy();
        }
        function beforeChangeImage(id) {
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

