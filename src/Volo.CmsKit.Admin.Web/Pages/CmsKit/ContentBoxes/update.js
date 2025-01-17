$(function () {
    var l = abp.localization.getResource("CmsKit");
    var $formUpdate = $('#form-content-box-update');
    volo.cmsKit.admin.web.ImageUploader();
    var $buttonSubmit = $('#button-content-box-update');
    var $buttonReturn = $('#button-content-box-return');
    var widgetModal = new abp.ModalManager({ viewUrl: abp.appPath + "CmsKit/Contents/AddWidgetModal", modalClass: "addWidgetModal" });
    $formUpdate.data('validator').settings.ignore = ":hidden, [contenteditable='true']:not([name]), .tui-popup-wrapper";

    $formUpdate.on('submit', function (e) {
        e.preventDefault();

        if ($formUpdate.valid()) {

            abp.ui.setBusy();
            $formUpdate.ajaxSubmit({
                success: function (result) {
                    abp.notify.success(l('SuccessfullySaved'));
                    abp.ui.clearBusy();
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
        $formUpdate.submit();
    });
    $buttonReturn.click(function (e) {
        e.preventDefault();
        location.href = "/Cms/ContentBoxes";
    });
    // -----------------------------------
    function createAddWidgetButton() {
        const button = document.createElement('button');

        button.className = 'toastui-editor-toolbar-icons last dropdown';
        button.style.backgroundImage = 'none';
        button.style.margin = '0';
        button.innerHTML = `W`;
        button.addEventListener('click', (event) => {
            event.preventDefault();
            widgetModal.open();
        });

        return button;
    }
  
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
