$(function () {
    var l = abp.localization.getResource("CmsKit");
    
    var $createForm = $('#form-content-box-create');
    var $title = $('#ViewModel_Title');
    var $buttonSubmit = $('#button-content-box-create');

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
                    location.href = "../ContentBoxes";
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
