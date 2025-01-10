$(function () {
    var l = abp.localization.getResource("CmsKit");

    var contentBoxesService = volo.cmsKit.admin.contentBoxes.contentBoxAdmin;

    var getFilter = function () {
        return {
            filter: $('#CmsKitConetntBoxesWrapper input.page-search-filter-text').val()
        };
    };

    var _dataTable = $("#ContentBoxesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollCollapse: true,
        scrollX: true,
        ordering: true,
        order: [[4, "desc"]],
        ajax: abp.libs.datatables.createAjax(contentBoxesService.getList, getFilter),
        columnDefs: [
            {
                title: l("Details"),
                targets: 0,
                rowAction: {
                    items: [
                        {
                            text: l('Edit'),
                            visible: abp.auth.isGranted('CmsKit.ContentBoxes.Update'),
                            action: function (data) {
                                location.href = 'ContentBoxes/Update/' + data.record.id;
                            }
                        },
                        {
                            text: l('Delete'),
                            visible: abp.auth.isGranted('CmsKit.ContentBoxes.Delete'),
                            confirmMessage: function (data) {
                                return l("ContentBoxDeletionConfirmationMessage")
                            },
                            action: function (data) {
                                contentBoxesService
                                    .delete(data.record.id)
                                    .then(function () {
                                        _dataTable.ajax.reloadEx();
                                        abp.notify.success(l('SuccessfullyDeleted'));
                                    });
                            }
                        },
                        {
                            text: l('CreateSubContentBox'),
                            visible: abp.auth.isGranted('CmsKit.ContentBoxes.Create'),
                            action: function (data) {
                                contentBoxesService
                                    .setAsHomePage(data.record.id)
                                    .then(function () {

                                        _dataTable.ajax.reloadEx();
                                        data.record.isHomePage ?
                                            abp.notify.warn(l('RemovedSettingAsHomePage'))
                                            : abp.notify.success(l('CompletedSettingAsHomePage'));
                                    });
                            }
                        }
                    ]
                }
            },
            {
                title: l("Title"),
                orderable: true,
                data: "title"
            },
            {
                title: l("Section"),
                orderable: true,
                data: "section"
            },
            {
                title: l("BoxType"),
                orderable: true,
                data: "boxType"
            },
            {
                title: l("BoxName"),
                orderable: true,
                data: "boxName"
            },
            {
                title: l("Status"),
                orderable: true,
                data: "status"
            },
            {
                title: l("CreationTime"),
                orderable: true,
                data: 'creationTime',
                dataFormat: "datetime"
            },
            {
                title: l("LastModificationTime"),
                orderable: true,
                data: 'lastModificationTime',
                dataFormat: "datetime"
            }
        ]
    }));

    $('#CmsKitConetntBoxesWrapper form.page-search-form').submit(function (e) {
        e.preventDefault();
        _dataTable.ajax.reloadEx();
    });

    $('#AbpContentToolbar button[name=CreateContentBox]').on('click', function (e) {
        e.preventDefault();
        window.location.href = "ContentBoxes/Create"
    });
});