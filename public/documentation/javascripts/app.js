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

function downloadZip() {
    // Replace this with the actual path to your zip file
    window.location.href = '/Rubicks/Rubicks.zip'; // Adjust the path as necessary
}
