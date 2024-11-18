function showAlertModal() {
    Rubicks.showAlert({
        title: "Alert",
        message: "This is an alert modal!",
        okText: "Close",
        callback: () => alert("Alert modal closed")
    });
}

function showConfirmModal() {
    Rubicks.showConfirm({
        title: "Confirm",
        message: "Do you confirm this action?",
        okText: "Yes",
        cancelText: "No",
        callback: (result) => alert(result ? "Confirmed" : "Canceled")
    });
}

function showAjaxModal() {
    Rubicks.showAjax({
        title: "AJAX Content",
        url: "./ajax.html",
        okText: "Close"
    });
}