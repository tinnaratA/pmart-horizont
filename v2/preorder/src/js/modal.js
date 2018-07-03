$(document).ready(()=> {
    $("body").prepend(`
        <div class="modal">
            <div class="modal-container">
            <div class="modal-title" id="modal-title"></div>
            <div class="divider"></div>
            <div class="modal-content" id="modal-content"></div>
            <div class="modal-action">
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="modal-action">
                OK
                </button>
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect" style="margin-left: 8px;" onclick="closeModal()" id="modal-close">
                Close
                </button>
            </div>
            </div>
        </div>
        <div class="modal-obfuscator"></div>
    `);

    $(".modal-obfuscator").click(function() {
        closeModal();
    });
});

function refreshMDL() {
    componentHandler.upgradeDom();
}

function closeModal() {
    $(".modal").removeClass("modal-active");
    $(".modal-obfuscator").removeClass("ob-active");
}

function openModal(title, isText, content, action, action_func, isClosable) {
    var modal_title = $("#modal-title");
    var modal_content = $("#modal-content");
    var modal_action = $("#modal-action");
    var modal_close = $("#modal-close");

    modal_title.empty();
    modal_content.empty();
    modal_action.empty();
    modal_action.off("click");

    modal_title.text(title);
    if (isText) {
        modal_content.html(content);
    } else {
        modal_content.append(content);
    }
    
    modal_action.text(action);
    modal_action.click(action_func);

    if (isClosable) {
        modal_close.removeClass("modal-btn-hide");
    } else {
        modal_close.addClass("modal-btn-hide");
    }

    $(".modal").addClass("modal-active");
    $(".modal-obfuscator").addClass("ob-active");

    refreshMDL();
}