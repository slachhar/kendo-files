var tooltip = null;

$(document).ready(function () {
    // on Update bind Again Team Lead
    var UserRoleId = $("#UserRoleId").val();
    if (UserRoleId == 1 || UserRoleId == 0) {
        $("#divTeamLeadId").hide();
    }
    else {
        $("#divTeamLeadId").show();
        if (UserRoleId != undefined) {
            OnUserRoleSelection(UserRoleId);
        }
    }
    BindUserRolebyDepartment(); // bind UserRole According to Selected Department  Sushil Saini 26 Sep 2017
    //GetAdminUserList();
    GetAllModules();
    GetAllModulesForAdmin();

    tooltip = $("#permissionGrid").kendoTooltip({
        filter: "span a",
        width: 120,
        position: "top"
    }).data("kendoTooltip");
    $(function () {
        $(".userCredentialTemplateModal .close").click();
    });

    //tooltip = $("#AdminPermissionGrid").kendoTooltip({
    //    filter: "span a",
    //    width: 120,
    //    position: "top"
    //}).data("kendoTooltip");
    //$(function () {
    //    $(".userCredentialTemplateModal .close").click();
    //});

    $("#UserRoleId").on("change", function () {
        $("#UserRole").val($("#UserRoleId option:selected").text());
    });




});

function OnDepartmentChange(departmentId) {

    $("#fkDepartmentId").val(departmentId);
    $('#ddlTeamLead').empty();
    $('#UserRoleId option[value=""]').attr('selected', 'selected');
    BindUserRolebyDepartment();
}

function BindUserRolebyDepartment() {
    var departmentId = $("#fkDepartmentId").val();
    if (departmentId == 0) {
        $("#UserRoleId option[value*='1']").prop('disabled', true);
        $("#UserRoleId option[value*='2']").prop('disabled', true);
        $("#UserRoleId option[value*='3']").prop('disabled', true);
        $("#divTeamLeadId").hide();
    }
    else {
        $("#UserRoleId option[value*='1']").prop('disabled', false);
        $("#UserRoleId option[value*='2']").prop('disabled', false);
        $("#UserRoleId option[value*='3']").prop('disabled', false);

    }
    if (departmentId != 0) {
        $("#UserRoleId option[value*='0']").prop('disabled', true);
    }
    else {
        $("#UserRoleId option[value*='0']").prop('disabled', false);
    }


}


function OnUserRoleSelection(UserRoleId) {
    if (UserRoleId == 0 || UserRoleId == 1) {  // If select Executive then bind TeamLeads except on Select TeamLead
        $("#TeamLeadId").val("0");
        $("#divTeamLeadId").hide();
    }
    else {
        $("#divTeamLeadId").show();
        var departmentId = $("#fkDepartmentId").val();
        $.post("/CMS/ManageUser/GetTeamLead", { departmentId: departmentId }, function (result) {

            if (IsSessionExpired(result)) {
                ReturnToLogin();
            }
            else if (result.message == "Error") {
                ReturnToError();
            }
            else {
                $('#ddlTeamLead').empty();
                var optionhtml1 = '<option value="0">' + "--Select TeamLead--" + '</option>';
                $("#ddlTeamLead").append(optionhtml1);
                $.each(result.data, function (index, item) {
                    var optionhtml = '<option value="' + item.TeamLeadId + '">' + item.TeamLeadName + '</option>';
                    $("#ddlTeamLead").append(optionhtml);
                });
                $("#ddlTeamLead").val($("#TeamLeadId").val());

            }
        });

    }
}
function OnTeamLeadSelection(TeamLeadId) {
    $("#TeamLeadId").val(TeamLeadId);
}


//---------------------------------------Manage Admin Section------------------------------------------



//Bind Admin User List
//function BindAdminData(dData) {
//    var rs = "";
//    $("#grid").kendoGrid({
//        dataSource:
//                {
//                    data: dData,
//                    schema: {
//                        data: "Data"
//                    },
//                    //pageSize: 10,
//                    serverPaging: false,
//                    serverFiltering: false,
//                    serverSorting: false
//                },
//        pageSize: 20,
//        filterable: true,
//        sortable: true,
//        pageable: true,
//        //toolbar: kendo.template($("#template").html()),
//        columns: [
//                    { field: "FirstName", title: "First Name", width: "150px" },
//                    { field: "LastName", title: "Last Name", width: "150px" },
//                    { field: "UserEmailId", title: "Email Id", width: "150px" },
//                    { field: "UserName", title: "Login Details", width: "90px", filterable: false, template: "<a href='javascript:void(0)'><img src='/Content/img/password_icon.png' style='width:24px;' onclick='GetUserCredentail(#=pkUserId#)' data-toggle='modal' data-target='" + rs + "' /></a>" },
//                    { field: "MobileNumber", title: "Mobile No", width: "100px" },
//                    { field: "IsActive", title: "Active", width: "80px" },
//                    { field: "CreatedOn", title: "Created On", width: "100px", format: "{0:MM/dd/yyyy}", type: "date" },
//                    { field: "pkUserId", title: "Action", filterable: false, template: "<input type='button' Value='Users' class='k-button' id='pkUserId' onclick='GetUserList(#=pkUserId#)'/><input class='k-button' type='button' id='pkUserId' value='Edit'  onclick='EditAdminUser(#=pkUserId#)'/> <input class='k-button' type='button'  value='Delete' onclick='DeleteUser(#=pkUserId#)'/> <input class='k-button' type='button'  value='Permission' onclick='AdminPermission(#=pkUserId#)'/>", width: "220px" },
//        ],
//        editable: "inline"
//    });
//}


//function BackToAdminList() {
//    window.location.href = "/CMS/ManageUser/ManageAdmin";
//}

//back to assigned user list by super admin
function BackToUserListBySA() {
    var Id = qs["aId"];
    window.location.href = "/CMS/ManageUser/ManageUsers";
    //window.location.href = "/CMS/ManageUser/ManageUsers?aId=" + Id;
}

//back to assigned user list by admin
function BackToUserListByA() {
    window.location.href = "/CMS/ManageUser/ManageUsers";
}


//--- Admin's users Permission start ---------------

//goto user permission
function UserPermission(userId) {
    window.location.href = "/CMS/ManageUser/ManageUserPermission/" + userId;
}

//get All modules list
function GetAllModules() {
    $.post("/CMS/ManageUser/GetModuleList", { userId: parseInt($('#userId').val()) }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else {
            moduleData = result;
            BindModules(moduleData, $('#userId').val());
        }
    });
}

//Bind Modules
function BindModules(moduleData, userId) {
    $('#permissionGrid').kendoGrid({
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
        pageSize: 10,
        filterable: true,
        sortable: true,
        pageable: false,
        dataBound: onDataBound,
        columns: [
            { field: "Name", title: "Modules", width: "150px", filterable: false },
            { field: "", width: "150px", filterable: false, headerTemplate: "<input class='chkbox' type='checkbox' id='_search' onclick='checkAll(this)' />&nbsp; Search <span style='padding-left:10px'><a href='javascript:void(0)' title='User can search only.' id='Read'><span class='fa fa-info'></span></a></span>", template: "<input type='checkbox' class='chkbx chk_search' id='chk_Read_#=pkAppModuleId#_#=pkModulePermissionId#_#=NavigationCode#'  #=Read == true ? 'checked' : '' # />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "<input class='chkbox' type='checkbox' id='_add' onclick='checkAll(this)' />&nbsp; Create <span style='padding-left:10px'><a href='javascript:void(0)' title='User can create bookings.' id='Add'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx chk_add' type='checkbox' id='chk_Add_#=pkAppModuleId#_#=pkModulePermissionId#_#=NavigationCode#' #=Add == true ? 'checked' : '' #  />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "<input class='chkbox' type='checkbox' id='_edit' onclick='checkAll(this)' />&nbsp; Update <span style='padding-left:10px'><a href='javascript:void(0)' title='User can update bookings.' id='Edit'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx chk_edit' type='checkbox' id='chk_Edit_#=pkAppModuleId#_#=pkModulePermissionId#_#=NavigationCode#'  #=Edit == true ? 'checked' : '' #  />" },
            { field: "", width: "90px", filterable: false, headerTemplate: "<input class='chkbox' type='checkbox' id='_delete' onclick='checkAll(this)' />&nbsp; Cancel <span style='padding-left:10px'><a href='javascript:void(0)' title='User can cancel bookings.' id='Delete'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx chk_delete' type='checkbox' id='chk_Delete_#=pkAppModuleId#_#=pkModulePermissionId#_#=NavigationCode#'  #=Delete == true ? 'checked' : '' #   />", footerTemplate: "<input class='m-0 btn button_orange' type='button' id='pkUserId' value='Save' onclick='addUpdatePermission()'/>" },

        ],
        editable: "inline"
    });
}
function checkAll(ele) {
    var state = $(ele).is(':checked');
    var grid = $('#grid').data('kendoGrid');
    if (state == true) {
        $('.chk' + ele.id).attr("checked", true);
    }
    else {
        $('.chk' + ele.id).attr("checked", false);
    }
};
//show tooltip message
if (tooltip != null) {
    tooltip.show($("#Add"));
    tooltip.show($("#Read"));
    tooltip.show($("#Edit"));
    tooltip.show($("#Delete"));
}

//add update permissions for user
function addUpdatePermission(id) {
    var userId = parseInt($('#userId').val());
    var arrayPermission = [];
    var arrayModuleId = [];
    var arrayModulePermissionId = [];
    var arrayNavigationCode = [];

    $("#permissionGrid").find('.k-grid-content tbody tr').each(function () {
        var permission = "";
        var readChk = $(this).find("[id^='chk_Read']");
        if (readChk.is(':checked')) {
            permission = "1";
        }
        else {
            permission = "0";
        }
        var addChk = $(this).find("[id^='chk_Add']");
        if (addChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }
        var editChk = $(this).find("[id^='chk_Edit']");
        if (editChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }
        var deleteChk = $(this).find("[id^='chk_Delete']");
        if (deleteChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }
        arrayPermission.push(permission);
        arrayModuleId.push($(this).find("[id^='chk_Read']").attr("id").split('_')[2]);
        arrayModulePermissionId.push($(this).find("[id^='chk_']").attr("id").split('_')[3]);
        arrayNavigationCode.push($(this).find("[id^='chk_']").attr("id").split('_')[4]);
    });

    $.post("/CMS/ManageUser/CreateUpdatePermission", { fkUserId: userId, arrayPermission: arrayPermission, arrayModuleId: arrayModuleId, arrayModulePermissionId: arrayModulePermissionId, arrayNavigationCode: arrayNavigationCode }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else if (result.Status == 1) {
            ShowToaster("Admin User permissions saved successfully.", "success");
            GetAllModules();
        }
        else {
            ShowToaster("Sorry! An error occured while processed your request.", "error");
        }
    });

}

//--- Admin's user Permission end ----------------------




//--- To Admin Permission by superadmin ----------------
function AdminPermission(userId) {
    window.location.href = "/CMS/ManageUser/ManageAdminPermission/" + userId;
}

//get All modules list
function GetAllModulesForAdmin() {
    $.post("/CMS/ManageUser/GetModuleList", { userId: parseInt($('#userId').val()) }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else {
            moduleData = result;
            BindModulesForAdmin(moduleData, $('#userId').val());
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
        height: 460,
        pageSize: 10,
        filterable: true,
        sortable: true,
        pageable: true,
        dataBound: onDataBound,
        columns: [
            { field: "Name", title: "Modules", width: "150px", filterable: false },
            { field: "", width: "150px", filterable: false, headerTemplate: "Read <span style='padding-left:10px'><a href='javascript:void(0)' title='User can read only.' id='Read'><span class='fa fa-info'></span></a></span>", template: "<input type='checkbox' class='chkbx' id='chk_Read_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Read == true ? 'checked' : '' # />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "Create <span style='padding-left:10px'><a href='javascript:void(0)' title='User can create bookings.' id='Add'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Add_#=pkAppModuleId#_#=pkModulePermissionId#' #=Add == true ? 'checked' : '' #  />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "Update <span style='padding-left:10px'><a href='javascript:void(0)' title='User can update bookings.' id='Edit'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Edit_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Edit == true ? 'checked' : '' #  />" },
            { field: "", width: "90px", filterable: false, headerTemplate: "Delete <span style='padding-left:10px'><a href='javascript:void(0)' title='User can cancel bookings.' id='Delete'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Delete_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Delete == true ? 'checked' : '' #   />", footerTemplate: "<input class='m-0 btn button_orange' type='button' id='pkUserId' value='Save' onclick='addUpdateAdminPermission()'/>" },

        ],
        editable: "inline"
    });
}

function onDataBound(e) {
    var grid = $("#" + e.sender.element[0].id).data("kendoGrid");
    var data = grid.dataSource.data();
    var Read = 0;
    var Add = 0;
    var Edit = 0;
    var Delete = 0;
    $("#_search").attr("checked", false);
    $("#_add").attr("checked", false);
    $("#_edit").attr("checked", false);
    $("#_delete").attr("checked", false);

    $.each(data, function (i, row) {

        var element = $('tr[data-uid="' + row.uid + '"] ');
        $(element).css('background-color', row.Color);

        if (row.Name == "Manage Agencies" || row.Name == "Settings") {
            var element = $('tr[data-uid="' + row.uid + '"] ');
            $(element).css("font-weight", "bold");
        }

        if (row.Read == true) {
            Read = Read + 1;
            if (data.length == Read) {
                $("#_search").attr("checked", true);
            }
        }
        if (row.Add == true) {
            Add = Add + 1;
            if (data.length == Add) {
                $("#_add").attr("checked", true);
            }
        }
        if (row.Edit == true) {
            Edit = Edit + 1;
            if (data.length == Edit) {
                $("#_edit").attr("checked", true);
            }
        }
        if (row.Delete == true) {
            Delete = Delete + 1;
            if (data.length == Delete) {
                $("#_delete").attr("checked", true);
            }
        }

    });
}

//add update permissions for user
function addUpdateAdminPermission() {
    var userId = parseInt($('#userId').val());
    var arrayPermission = [];
    var arrayModuleId = [];
    var arrayModulePermissionId = [];

    $("#AdminPermissionGrid").find('.k-grid-content tbody tr').each(function () {
        var permission = "";

        var readChk = $(this).find("[id^='chk_Read']");
        if (readChk.is(':checked')) {
            permission = "1";
        }
        else {
            permission = "0";
        }

        var addChk = $(this).find("[id^='chk_Add']");
        if (addChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }

        var editChk = $(this).find("[id^='chk_Edit']");
        if (editChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }

        var deleteChk = $(this).find("[id^='chk_Delete']");
        if (deleteChk.is(':checked')) {
            permission = permission + ",1";
        }
        else {
            permission = permission + ",0";
        }

        arrayPermission.push(permission);
        arrayModuleId.push($(this).find("[id^='chk_Read']").attr("id").split('_')[2]);
        arrayModulePermissionId.push($(this).find("[id^='chk_']").attr("id").split('_')[3]);
    });

    $.post("/CMS/ManageUser/CreateUpdatePermission", { fkUserId: userId, arrayPermission: arrayPermission, arrayModuleId: arrayModuleId, arrayModulePermissionId: arrayModulePermissionId }, function (result) {

        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
       else if (result.Status == 1) {
            ShowToaster("Admin User permissions saved successfully.", "success");
            GetAllModulesForAdmin();
        }       
        else {
            ShowToaster("Sorry! An error occured while processed your request.", "error");
        }
    });

}


//--- End To Admin Permission by superadmin --------------


function SuccessUpdateUser(result) {

    if (IsSessionExpired(result)) {
        ReturnToLogin();
    }
    else if (result.message == "Error") {
        ReturnToError();
    }
   else if (result.Result == "OK") {
        ShowToaster(result.Message, "success");
        hideLoader();        
        clearForm();
    }
    else if (result.Result == "UPDATE") {
        ShowToaster(result.Message, "success");
        hideLoader();  
    }
    else if (result.message == "Error") {
        ReturnToError();
    }
    else {
        ShowToaster(result.Message, "error");
        hideLoader();
    }
}

function clearForm() {
    $("#EmployeeId").val("");
    $("#fkDepartmentId").val(-1);
    $("#UserRoleId").val("");
    $("#ddlTeamLead").val(0);
    $("#UserName").val("");
    $("#Password").val("");
    $("#ConfirmPassword").val("");
    $("#FirstName").val("");
    $("#LastName").val("");
    $("#MobileNumber").val("");
    $("#EmergencyContactNumber").val("");
    $("#LocalAddress").val("");
    $("#IsActive").attr("checked", false);
    $("#IsCodeVerified").attr("checked", false);
    $("input:radio").prop('checked', false);
}

function OnBeginUpdateUser() {
    var count = 0;
    if ($("#UserRoleId").val() != "" || $("#UserRoleId").val() != 1) {
        if ($("#ddlTeamLead ").val() == 0 || $("#ddlTeamLead ").val() == "") {
            $("#ddlTeamLead").addClass('input-validation-error');
            count++;
        }
    }
    else {
        $("#ddlTeamLead").removeClass('input-validation-error');
    }

    if ($("#fkDepartmentId").val() == "-1") {
        $("#fkDepartmentId").addClass('input-validation-error');
        count++;
    }
    else {
        $("#fkDepartmentId").removeClass('input-validation-error');
    }

    if (count > 0) {
        return false;
    }
    else {
        showLoader();
    }
}



$("#IsAllChecked").click(function () {
    if ($("#IsAllChecked").is(":checked")) {
        $(".chkbx").prop("checked", true);
    }
    else {
        $(".chkbx").prop("checked", false);
    }
});

$('#btnPermission').on('click', function () {
    var userId = $("#pkUserId").val();
    window.location.href = "/CMS/ManageUser/ManageUserPermission/" + userId;
});


$('#btnDelete').click(function (e) {
    var userId = $("#pkUserId").val();

    swal({
        title: "Are you sure want to delete?",
        text: "You will not be able to recover this Record!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                swal({
                    title: 'Deleted!',
                    text: 'Records are successfully deleted!',
                    type: 'success'
                }, function () {
                    $.ajax({
                        url: '/CMS/ManageUser/DeleteAssignedUser',
                        type: 'POST',
                        dataType: 'json',
                        data: { 'pkUserId': userId, 'fkAdminId': 0 },
                        success: function (data) {
                            if (IsSessionExpired(data)) {
                                ReturnToLogin();
                            }
                            else if (data.message == "Error") {
                                ReturnToError();
                            }
                            else if (data.Result == "OK") {
                                $('#ManageUserTableContainer').jtable('load');
                                ShowToaster("Request has been deleted successfully.", "success");
                            }
                            else {
                                ShowToaster("Sorry! An error occured while processing your request.", "error");
                            }
                        },
                        error: function () {
                            if (IsSessionExpired(data)) {
                                ReturnToLogin();
                            }
                            else if (data.message == "Error") {
                                ReturnToError();
                            }
                            $dfd.reject();
                        }
                    });
                });

            } else {
                swal("Cancelled", "Your Records is safe :)", "error");
            }
        });




});
