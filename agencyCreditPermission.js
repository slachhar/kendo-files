var tooltip = null;

$(document).ready(function () {
    GetAllModulesForAgency();


    tooltip = $("#AdminPermissionGrid").kendoTooltip({
        filter: "span a",
        width: 120,
        position: "top"
    }).data("kendoTooltip");
    $(function () {
        $(".userCredentialTemplateModal .close").click();
    });

});

//show tooltip message
if (tooltip != null) {
    tooltip.show($("#Add"));
}

function GetAllModulesForAgency() {
    $.post("/CMS/Control/GetAgencyCreditPermission", { agencyId: parseInt($('#hdnAgencyId').val()) }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else {
            moduleData = result;
            BindModulesForAdmin(moduleData, $('#hdnAgencyId').val());
        }
    });
}

//Bind Modules
function BindModulesForAdmin(moduleData, userId) {
    $('#AdminPermissionGrid').kendoGrid({
        dataSource:
        {
            data: moduleData,
            schema: {
                data: "Data"
            },
            //pageSize: 10,
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false,
        },
        height: 350,
        pageSize: 10,
        filterable: true,
        sortable: true,
        pageable: true,
        columns: [
            { field: "ModuleName", title: "Modules", width: "150px", filterable: false },
            { field: "", width: "150px", filterable: false, footerTemplate: "<input class='btn button_orange m-0' type='button' id='pkUserId' value='Save' onclick='addUpdatePermission()'/>", headerTemplate: "Credit Permission <span style='padding-left:10px'><a href='javascript:void(0)' title='Agency can take credit on bookings.' id='Read'><span class='fa fa-info'></span></a></span>", template: "<input type='checkbox' id='chk_Add_#=fkAppModuleId#_#=pkCreditBalancePermissionId#' class='chkbx'   #=Permission == true ? 'checked' : '' # />" },
        ],
        editable: "inline"
    });
}

//add update permissions for user
function addUpdatePermission() {
    var agencyId = parseInt($('#hdnAgencyId').val());
    var arrayPermission = [];
    var arrayModuleId = [];
    var arrayModulePermissionId = [];

    $("#AdminPermissionGrid").find('.k-grid-content tbody tr').each(function () {
        var permission = "";

        var addChk = $(this).find("[id^='chk_Add']");
        if (addChk.is(':checked')) {
            permission = permission + "1";
        }
        else {
            permission = permission + "0";
        }
        arrayPermission.push(permission);
        arrayModuleId.push($(this).find("[id^='chk_Add']").attr("id").split('_')[2]);
        arrayModulePermissionId.push($(this).find("[id^='chk_']").attr("id").split('_')[3]);
    });

    $.post("/CMS/Control/CreateUpdateCreditPermission", { fkagencyId: agencyId, arrayPermission: arrayPermission, arrayModuleId: arrayModuleId, arrayModulePermissionId: arrayModulePermissionId }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else if (result.Status == 1) {
            ShowToaster("Agency credit permissions saved successfully.", "success");
            GetAllModulesForAgency();
        }             
        else {
            ShowToaster("Sorry! An error occured while processed your request.", "error");
        }
    });

}
