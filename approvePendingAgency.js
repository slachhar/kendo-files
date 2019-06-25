$(document).ready(function () {
    GetAgencyData();
});

function GetAgencyData() {
    $.post("/ProfileManagement/Control/GetPendingAgencyList", function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else {
            dData = result;
            BindAgency(dData);
            $("table.jtable").addClass('table-responsive');
        }
    });
}

function BindAgency(dData) {
    $("#grid").kendoGrid({
        dataSource:
                {
                    data: dData,
                    schema: {
                        data: "Data"
                    },
                    //pageSize: 10,
                    serverPaging: false,
                    serverFiltering: false,
                    serverSorting: false
                },
        pageSize: 20,
        filterable: true,
        sortable: true,
        pageable: true,
        columns: [
                    { field: "Name", title: "Agency Name", width: "200px" },
                    { field: "AgencyHolderName", title: "Agency Holder", width: "120px" },
                    { field: "AgencyCode", title: "Agency Code", width: "100px" },
                    { field: "EmailId", title: "Email ID", width: "120px" },
                    { field: "CreatedOn", title: "Registred On", width: "80px", format: "{0:MM/dd/yyyy}", type: "date" },
                    //{ field: "ActivatedForDays", title: "No of Days", width: "80px", template: "<input type='text' style='width:70px' id='NoDay_#=pkAgencyId#' value='#=ActivatedForDays==null?'':ActivatedForDays#' class='NumberField'/>" },
                    { field: "IsApproved", title: "Approved?", width: "75px", template: "#=IsApproved==true?'Yes':'No'#" },
                    { field: "pkAgencyId", title: "Action", filterable: false, template: "<input class='k-button' type='button' id='pkAgencyId' value='Manage Agency'  onclick='ViewDetails(#=pkAgencyId#)'/> <input class='k-button' type='button' id='pkAgencyId' value='Approve'  onclick='ApproveAgency(#=pkAgencyId#)'/>  <input class='k-button' type='button'  value='Block' onclick='BlockAgency(#=pkAgencyId#)'/>", width: "240px" },
        ],
        editable: "inline"
    });
}

function ViewDetails(agencyId) {
    location.href = "AgencyProfile/" + agencyId;
}

function ApproveAgency(agencyId) {
   
  
    var task = "ApproveAgency";  
    showproceedWindowAgency('#confirmationTemplate', 'Are you sure to Approve Agency?', agencyId, task)

}
function BlockAgency(agencyId) {
    var task = "BlockAgency";  
    showproceedWindowAgency('#confirmationTemplate', 'Are you sure to Block Agency?', agencyId,task)
}

function showproceedWindowAgency(template, message, agencyId,task) {
    var dfd = new jQuery.Deferred();
    var result = false;
    $("<div id='popupWindow'></div>")
        .appendTo("body")
        .kendoWindow({
            width: "350px",
            modal: true,
            title: "",
            modal: true,
            visible: false,
            draggable: false,
            resizable: false,
            close: function (e) {
                this.destroy();
                dfd.resolve(result);
            }
        }).data('kendoWindow').content($(template).html()).center().open();

    $('.popupMessage').html(message);

    $('#popupWindow .confirm_yes').val('Yes');
    $('#popupWindow .confirm_no').val('No');

    $('#popupWindow .confirm_no').click(function () {
        $('#popupWindow').data('kendoWindow').close();
    });

    $('#popupWindow .confirm_yes').click(function () {
        $('#popupWindow').data('kendoWindow').close();
        showLoader();
        if (task != "ApproveAgency") {
            $.post("/ProfileManagement/Control/BlockAgency", { pkAgencyId: agencyId }, function (result) {
                if (IsSessionExpired(result)) {
                    ReturnToLogin();
                }
                else if (result.message == "Error") {
                    ReturnToError();
                }
                else if (result.Status == 1) {
                    ShowToaster("User has been Blocked successfully.", "success");
                    GetAgencyData();
                    hideLoader();
                }
                else {
                    ShowToaster("Sorry! An error occured while processed your request.", "error");
                    hideLoader();
                }
            });
        }
        else {
            var nDay = -1;  
            $.post("/ProfileManagement/Control/ApproveAgency", { pkAgencyId: agencyId, approveForDays: nDay }, function (result) {
                if (IsSessionExpired(result)) {
                    ReturnToLogin();
                }
                else if (result.message == "Error") {
                    ReturnToError();
                }
               else if (result.Status == 1) {
                    ShowToaster("User has been approved successfully.", "success");
                    GetAgencyData();
                    hideLoader();
                }
                else {
                    ShowToaster("Sorry! An error occured while processed your request.", "error");
                    hideLoader();
                }
            });
        }

    });

   // $("#btnProceed").removeAttr("id").attr("id", "btnProceedx")

}
