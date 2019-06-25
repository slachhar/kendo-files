$(document).ready(function () {
    //ModulePermission(7, "jtable");//manage agencies 7
    loadJTableGrid();
    $("table.jtable").addClass('table-responsive');
    $('#LoadRecordsButton').click(function (e) {
        e.preventDefault();
        $('#AgencyTableContainer').jtable('load', {
            name: $('#name').val().trim(),
            emailId: $('#txtEmailId').val().trim(),
            mobileNo: $('#txtMobileNo').val().trim()
        });
    });

    //Load all records when page is first shown
    $('#LoadRecordsButton').click();

});

function loadJTableGrid() {

    $('#AgencyTableContainer').jtable({
        title: 'Agency Users List',
        paging: true,
        pageSize: GetPageSize(),
        sorting: true,
        selecting: true,
        selectingCheckBoxes: false,
        selectOnRowClick: false,
        jqueryuitheme: true,
        defaultSorting: 'CreatedOn DESC',
        actions: {
            listAction: '/Agency/ManageUser/GetUserList',
            updateAction: '/Agency/ManageUser/EditUser',
            deleteAction: '/Agency/ManageUser/DeleteUser'
        },
        fields: {
            pkUserId: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            UserEmailId: {
                title: 'Email Id',
                //inputClass: 'validate[required,custom[email]]'
            },
            FirstName: {
                title: 'First Name',
                inputClass: 'validate[required]'

            },
            LastName: {
                title: 'Last Name',
                inputClass: 'validate[required]'
            },

            UserName: {
                title: 'Login Details',
                edit: false,
                display: function (data) {
                    return "<a href='javascript:void(0)'><img src='/Content/img/password_icon.png' style='width:28px;' onclick='GetUserCredentail(" + data.record.pkUserId + ")' data-toggle='modal' /></a>";
                },
                sorting: false,
            },
            MobileNumber: {
                title: 'Mobile No',
                inputClass: 'validate[required,custom[phone]]'

            },
            IsActive: {
                title: 'Active',
                type: 'checkbox',
                values: { 'false': 'False', 'true': 'True' },
                display: function (data) {
                    if (data.record.IsActive == true) {
                        return '<i style="font-size:16px;" class="fa fa-check text-success"></i>';
                    } else {

                        return '<i style="font-size:16px;" class="fa fa-close text-danger"></i>';
                    }
                }
            },
            CreatedOn: {
                title: 'Created On',
                type: 'date',
                displayFormat: GetDateFormat(),
                inputClass: 'validate[required,custom[date]]',
                edit: true,
                input: function (data) {
                    if (data.value) {
                        return '<input class="txtCreatedOn" type="text" style="display:none;" name="CreatedOn" value="' + data.value + '"/>';
                    } else {
                    }
                }
            },
            btnDetail: {
                title: 'Action',
                sorting: false,
                create: false,
                edit: false,
                display: function (data) {
                    var btnAction = '<div class="tooltip_cont jTBtn"><button class="fa fa-lock fa-lg text-muted" type="button" onclick="UserPermission(' + data.record.pkUserId + ')"></button> <div class="title_tooltip">Permission</div></div> ';
                    return btnAction;
                }
            },
        },
        //Initialize validation logic when a form is created
        formCreated: function (event, data) {
            if (data.formType == 'edit') {
                $('#Edit-UserEmailId').prop('readonly', true);
                $('#Edit-UserEmailId').css('border', '0px');
                //$("#Edit-formCreated").hide();
                //$("#Edit-CreatedOn").parent().parent().hide()
            }
            data.form.validationEngine('attach', {
                binded: true
            });

        },
        //Validate form when it is being submitted
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        //Dispose validation logic when form is closed
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        }
    });
}

function exportexcel() {   // Excel Export Sushil Saini 25-July-2017

    var Login = $('th:contains("Login Details")').index() + 1;
    var Active = $('th:contains("Active")').index() + 1;
    var Action = $('th:contains("Action")').index() + 1;
    var EditRecord = $('td:contains("Edit Record")').index() + 1;
    var Delete = $('td:contains("Delete")').index() + 1;

    $(".ryt").text("true");
    $(".wrong").text("false");

    $('td:nth-child(' + Login + '),th:nth-child(' + Login + ')').addClass("noExl");
    $('td:nth-child(' + Action + '),th:nth-child(' + Action + ')').addClass("noExl");
    $('td:nth-child(' + EditRecord + '),th:nth-child(' + EditRecord + ')').addClass("noExl");
    $('td:nth-child(' + Delete + '),th:nth-child(' + Delete + ')').addClass("noExl");

    $("#AgencyTableContainer").table2excel({
        exclude: ".noExl",
        name: "Table2Excel",
        filename: "AgentUser" + Date.now() + ".xlsx",
        //fileext: ".xls"
    });
    reload();
}

var tooltip = null;
$(document).ready(function () {

    //GetAllUsers();
    // GetAllModules();
    tooltip = $("#permissionGrid").kendoTooltip({
        filter: "span a",
        width: 120,
        position: "top"
    }).data("kendoTooltip");
    $(function () {
        $(".userCredentialTemplateModal .close").click();
    });
});


//to show login details
function GetUserCredentail(userId) {
    $.post("/Agency/ManageUser/GetUserCredentialBasedOnId", { "userId": userId }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
        else {
            BindCredeialData(result.Data, userId);
        }
    });
}

//goto user permission
function UserPermission(userId) {
    window.location.href = "/Agency/ManageUser/ManageUserPermission/" + userId;
}

//get All modules list
function GetAllModules() {
    $.post("/Agency/ManageUser/GetModuleList", { userId: parseInt($('#userId').val()) }, function (result) {
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
        pageSize: 100,
        filterable: true,
        sortable: true,
        pageable: false,
        dataBound: onDataBound,
        columns: [
            //{ field: "Name", title: "Modules", width: "150px", filterable: false, template: "#= AlternateColor(data) #" },
            { field: "Name", title: "Modules", width: "150px", filterable: false },
            { field: "", width: "150px", filterable: false, headerTemplate: "Search <span style='padding-left:10px'><a href='javascript:void(0)' title='User can search only.' id='Read'><span class='fa fa-info'></span></a></span>", template: "<input type='checkbox' class='chkbx' id='chk_Read_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Read == true ? 'checked' : '' # />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "Create <span style='padding-left:10px'><a href='javascript:void(0)' title='User can create bookings.' id='Add'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Add_#=pkAppModuleId#_#=pkModulePermissionId#' #=Add == true ? 'checked' : '' #  />" },
            { field: "", width: "150px", filterable: false, headerTemplate: "Update <span style='padding-left:10px'><a href='javascript:void(0)' title='User can update bookings.' id='Edit'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Edit_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Edit == true ? 'checked' : '' #  />" },
            { field: "", width: "90px", filterable: false, headerTemplate: "Cancel <span style='padding-left:10px'><a href='javascript:void(0)' title='User can cancel bookings.' id='Delete'><span class='fa fa-info'></span></a></span>", template: "<input class='chkbx' type='checkbox' id='chk_Delete_#=pkAppModuleId#_#=pkModulePermissionId#'  #=Delete == true ? 'checked' : '' #   />", footerTemplate: "<input class='btn button_orange' type='button' id='pkUserId' value='Save' onclick='addUpdatePermission()'/>" },

        ],
        editable: "inline"
    });
}

function onDataBound(e) {
    var grid = $("#" + e.sender.element[0].id).data("kendoGrid");
    var data = grid.dataSource.data();
    var settingColor = "";
    var markupColor = "";
    $.each(data, function (i, row) {

        var element = $('tr[data-uid="' + row.uid + '"] ');
        $(element).css('background-color', row.Color);

        if (row.Name == "Hotels") {
            $("#divbgcolor").css('background', row.Color);
        }

        if (row.Name == "Settings") {
            var element = $('tr[data-uid="' + row.uid + '"] ');
            $(element).css("font-weight", "bold");
        }
    });
}

//dataBound: function () {
//    //  $(".highlightEven").parent().parent().css("background", "rgba(2, 117, 216, 0.38)");

//    var grid = $("#permissionGrid").data("kendoGrid");
//    var data = grid.dataSource.data();
//    $.each(data, function (i, row) {
//        if (row.Category == 1) {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).addClass("bgcolor-lightgray");
//        }
//        if (row.Category == 2) {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).addClass("bgcolor-lightsky");
//        }
//        if (row.Category == 3) {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).addClass("bgcolor-lightred");
//        }
//        if (row.Category == 4) {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).addClass("bgcolor-lightgreen");
//        }
//        if (row.Category == 0) {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).addClass("bgcolor-lightblue");
//        }

//        if (row.Name == "Manage Agencies" || row.Name == "Settings") {
//            var element = $('tr[data-uid="' + row.uid + '"] ');
//            $(element).css("font-weight", "bold");
//        }
//    });

//},
//function AlternateColor(model) {
//    if (model.Name == "Flights" || model.Name == "Hotels" || model.Name == "Transfers" || model.Name == "Sightseeings") {
//        return "<span class='highlightEven' style=''>" + model.Name + "</span>"
//    } else {
//        return "<span class='' style=''>" + model.Name + "</span>"
//    }
//}
//show tooltip message
if (tooltip != null) {
    tooltip.show($("#Add"));
    tooltip.show($("#Read"));
    tooltip.show($("#Edit"));
    tooltip.show($("#Delete"));
}

//add update permissions for user
function addUpdatePermission() {
    var userId = parseInt($('#userId').val());
    var arrayPermission = [];
    var arrayModuleId = [];
    var arrayModulePermissionId = [];
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
    });

    $.post("/Agency/ManageUser/CreateUpdatePermission", { fkUserId: userId, arrayPermission: arrayPermission, arrayModuleId: arrayModuleId, arrayModulePermissionId: arrayModulePermissionId }, function (result) {
        if (IsSessionExpired(result)) {
            ReturnToLogin();
        }
        else if (result.message == "Error") {
            ReturnToError();
        }
       else if (result.Status == 1) {
            ShowToaster("User permissions saved successfully.", "success");
            GetAllModules();
        }       
        else {
            ShowToaster("Sorry! An error occured while processed your request.", "error");
        }
    });

}



function Reset() {
    $("#name").val('');
    $("#txtEmailId").val('');
    $("#txtMobileNo").val('');
    $("#LoadRecordsButton").click()
}
