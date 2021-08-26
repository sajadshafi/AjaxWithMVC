$(document).ready(function () {

    switches = document.querySelectorAll(".js-switch");
    initSwitches = []

    switches.forEach(elm => console.log(elm));

    switches.forEach(function (elm) {
        switchery = new Switchery(elm, { size: 'small', disabled: false });

        initSwitches.push( {
            'elementId': switchery.element.id,
            'switchery': switchery,
            'refreshId': $(switchery.element).attr('data-refresh-id'),
            'onchange': function (currentSwitch) {
                refreshId = currentSwitch.element.dataset['refreshId']
                currentRefreshIcon = document.getElementById(refreshId)
                if (currentSwitch.isChecked()) {
                    $(currentRefreshIcon).removeClass("disabled");
                    $(currentRefreshIcon).addClass("enabled");
                    switchState = {
                        'switchState': true,
                        'refreshState': "enabled"
                    }
                }
                else {
                    $(currentRefreshIcon).removeClass("enabled");
                    $(currentRefreshIcon).addClass("disabled");
                    switchState = {
                        'switchState': false,
                        'refreshState': "disabled"
                    }
                }

                localStorage.setItem(currentSwitch.element.id, JSON.stringify(switchState))
            }
        });
    });

    switches.forEach(function(item) {
        item.addEventListener('change', function (event) {
            initSwitches.forEach(function (initSwitch) {
                if (initSwitch["elementId"] == item.id) {
                    initSwitch['onchange'](initSwitch['switchery']);
                }
            });
        });
    })

    LoadSavedSwitchConfig();

    //refresh clicks
    refreshes = document.querySelectorAll(".refresh");

    refreshes.forEach(function (item) {
        item.addEventListener('click', function (event) {
            initSwitches.forEach(function (initSwitch) {
                if (initSwitch["refreshId"] == item.id) {
                    if (initSwitch['switchery'].isChecked()) {
                        ajaxId = $(item).attr('data-ajax-id')
                        ajaxIndex = parseInt(ajaxId);
                        ajaxFunctionList[ajaxIndex](ajaxCompleteFromRefresh);
                    } else {
                        console.log("ajax is disabled");
                    }
                }
            });
        });
    });


    //#region Dragula code
    drake = dragula({
        isContainer: function (el) {
            return el.classList.contains('dragula-container');
        },
        moves: function (el, container, handle) {
            return handle.classList.contains('drag-icon');
        },
        direction: 'horizontal',
        revertOnSpill: true
    });

    drake.on('dragend', function (el, target, source, sibling) {
        var dragableDivOrder = [];
        $('#dragula-container').children().each(function (index, el) {
            dragableDivOrder.push(el.id);
        });

        localStorage.setItem('dragDivsOrder', JSON.stringify(dragableDivOrder));
    });
    //#endregion

    //ajaxFunctionList[i]();


});

function LoadSavedSwitchConfig() {

    initSwitches.forEach(function (initSwitch) {

        Object.keys(localStorage).forEach(function (key) {
            if (initSwitch["elementId"] == key) {
                if (localStorage.getItem(key) != null) {
                    savedState = JSON.parse(localStorage.getItem(key));
                    refreshElement = document.getElementById(initSwitch['refreshId']);
                    if (savedState['switchState']) {
                        $(refreshElement).removeClass("disabled");
                        $(refreshElement).addClass("enabled");
                        setSwitchery(initSwitch['switchery'], true)
                    }
                    else if (!savedState['switchState']) {
                        $(refreshElement).removeClass("enabled");
                        $(refreshElement).addClass("disabled");
                        setSwitchery(initSwitch['switchery'], false)
                    }
                }
            }
        });
    });

}

function startupSwitchCheck() {
    //Check Switch 1
    if (localStorage.getItem('switch1CheckState') != null) {
        let savedState = JSON.parse(localStorage.getItem('switch1CheckState'));
        if (savedState['switchState']) {
            setSwitchery(initSwitchFirst, true);
            $("#refresh1").removeClass("disabled");
            $("#refresh1").addClass("enabled");
        } else {
            setSwitchery(initSwitchFirst, false)
            $("#refresh1").removeClass("enabled");
            $("#refresh1").addClass("disabled");
        }
    } else {
        setSwitchery(initSwitchFirst, true);
    }

    //Check Switch 2
    if (localStorage.getItem('switch2CheckState') != null) {
        let savedState = JSON.parse(localStorage.getItem('switch2CheckState'));
        if (savedState['switchState']) {
            setSwitchery(initSwitchSecond, true)
            $("#refresh2").removeClass("disabled");
            $("#refresh2").addClass("enabled");
        } else {
            setSwitchery(initSwitchSecond, false)
            $("#refresh2").removeClass("enabled");
            $("#refresh2").addClass("disabled");
        }
    }
    else {
        setSwitchery(initSwitchSecond, true);
    }

    if (localStorage.getItem('switch3CheckState') != null) {
        let savedState = JSON.parse(localStorage.getItem('switch3CheckState'));
        if (savedState['switchState']) {
            setSwitchery(initSwitchThird, true)
            $("#refresh3").removeClass("disabled");
            $("#refresh3").addClass("enabled");
        } else {
            setSwitchery(initSwitchThird, false)
            $("#refresh3").removeClass("enabled");
            $("#refresh3").addClass("disabled");
        }
    }
    else {
        setSwitchery(initSwitchThird, true)
    }
}

//#region Dragula load
LoadDivOrder();

function LoadDivOrder() {
    if (localStorage.getItem('dragDivsOrder') != null) {
        dragDivsOrder = JSON.parse(localStorage.getItem('dragDivsOrder'));
        dragDivsOrder.forEach(function (dragableItem) {
            dragContainer = document.getElementById('dragula-container');
            dragContainer.appendChild(document.getElementById(dragableItem));
        })
    }
}
//#endregion

function refreshButtonClicks() {

    //#region old
    /*
    $("#refresh1").click(function () {
        if ($("#refresh1").hasClass('disabled')) {
            return false;
        }
        else {
            ajaxRefresh(0);
        }

    });

    $("#refresh2").click(function () {
        if ($("#refresh2").hasClass('disabled')) {
            return false;
        }
        else {
            ajaxRefresh(1);
        }
    });

    $("#refresh3").click(function () {
        if ($("#refresh3").hasClass('disabled')) {
            return false;
        }
        else {
            ajaxRefresh(2);
        }
    });
    */
    //#endregion

}

//Ajax functions for sequential call
i = 0, flag = 1
ajaxFunctionList = [
    function ajaxFunction1(callBack) {
        if ($("#refresh1").hasClass('disabled')) {
            ajaxComplete();
            return false;
        }
        else {
            $.ajax({
                url: 'home/getbyid/' + 0,
                type: 'GET',
                success: successCallBack,
                complete: (callBack != null) ? callBack : ajaxComplete
            });
        }
    },

    function ajaxFunction2(callBack) {
        if ($("#refresh2").hasClass('disabled')) {
            ajaxComplete();
            return false;
        }
        else {
            $.ajax({
                url: 'home/getbyid/' + 1,
                type: 'GET',
                success: successCallBack,
                complete: (callBack != null) ? callBack : ajaxComplete
            });
        }
    },

    function ajaxFunction3(callBack) {
        if ($("#refresh3").hasClass('disabled')) {
            ajaxComplete();
            return false;
        }
        else {
            $.ajax({
                url: 'home/getbyid/' + 2,
                type: 'GET',
                success: successCallBack,
                complete: (callBack != null) ? callBack : ajaxComplete
            });
        }
    }
]

function ajaxComplete() {
    i++;
    if (i < 3) {
        ajaxFunctionList[i]();
    } else {
        i = 0
        if (flag == 1) {
            setInterval(function () { ajaxFunctionList[i]() }, 10000)
            flag = 0
        }
    }
}

function ajaxCompleteFromRefresh(response) {
    console.log(response);
}


function successCallBack(response) {
    console.log(response)
    currentEmpId = response.employeeId;
    currentEmpName = response.name;
    currentDetails = response.details;
    document.getElementById('employeeId' + currentEmpId).innerHTML = currentEmpId;
    document.getElementById('employeeName' + currentEmpId).innerHTML = currentEmpName;
    document.getElementById('employeeDetails' + currentEmpId).innerHTML = currentDetails;
}

function ajaxRefresh(id) {
    $.ajax({
        url: 'home/getbyid/' + id,
        type: 'GET',
        success: successCallBack
    });
}


//Change switchery state
function setSwitchery(switchElement, checkedBool) {
    if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
        switchElement.setPosition(true);
    }
}
