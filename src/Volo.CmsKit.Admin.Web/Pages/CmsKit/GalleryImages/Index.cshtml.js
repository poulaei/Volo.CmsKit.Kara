$(function () {
    var l = abp.localization.getResource('CmsKit');
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'CmsKit/GalleryImages/CreateModal',
        modalClass: "ImageManagementCreate"
    });
    var imageGalleryService = volo.cmsKit.admin.galleryImages.galleryImagesAdmin;

    var dataTable = $("#ImagesTable").DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[1, "asc"]],
            searching: false,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(imageGalleryService.getList),
            columnDefs: [
                {
                    title: l('Actions'),
                    rowAction: {
                        items:
                            [
                                {
                                    text: l('Edit'),
                                    visible: abp.auth.isGranted('CmsKit.GalleryImages.Edit'),
                                    action: function (data) {
                                        editModal.open({ id: data.record.id });
                                    }
                                },
                                {
                                    text: l('Delete'),
                                    visible: abp.auth.isGranted('CmsKit.GalleryImages.Delete'),
                                    confirmMessage: function (data) {
                                        return l('ImageDeletionConfirmationMessage', data.record.name);
                                    },
                                    action: function (data) {
                                        imageGalleryService
                                            .delete(data.record.id)
                                            .then(function () {
                                                abp.notify.info(l('SuccessfullyDeleted'));
                                                dataTable.ajax.reload();
                                            });
                                    }
                                }
                            ]
                    }
                },
                {
                    title: l("Description"),
                    data: "description"
                },
                {
                    title: l("CreationTime"),
                    data: "creationTime",
                    dataFormat: "datetime"
                }
            ]
        })
    );

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $('#NewImageButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });
});