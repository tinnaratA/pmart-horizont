function addTableBody(table_id, data, row_func=null, func_id='', haveCheckbox=false, box_id='') {
    if (row_func && haveCheckbox) {
        var row = $("<tr />", { click: (evt) => {
            var $cell=$(evt.target).closest('td');
            if( $cell.index()>0) {
                row_func(func_id)
            }
        }});
    }
    else if (row_func) {
        var row = $("<tr />", { click: () => row_func(func_id) });
    }
    else {
        var row = $("<tr />")
    }

    if (haveCheckbox) {
        row.append(
            $("<td />")
                .append($("<label />", { class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", for: "checkbox-" + box_id, click: () => onSeleted(table_id, box_id) })
                    .append($("<input />", { type: "checkbox", class: "mdl-checkbox__input", id: "checkbox-" + box_id }))
                )
        )
    }

    data.map(item => {
        if(item.img) {
            row.append(
                $("<td />", { class: item.class })
                    .append("<img src='"+item.img+"' class='thumbnail' />")
            )
        }
        else if (item.icon) {
            row.append(
                $("<td />", { html: "<i class='material-icons status_row'>"+item.icon+"</i><span>"+item.text+"</span>", class: item.class })
            )
        }
        else {
            row.append(
                $("<td />", { class: item.class, text: item.text })
            )
        }
    })

    $("#" + table_id).find("tbody").append(row)
}

function onSeleted(table_id, id) {
    var table_num = id.split("-")[0]
    var main_id = "checkbox-all-"+table_num

    var checkboxs = $("#"+table_id).find(".mdl-checkbox__input");
    if($("#checkbox-"+id).prop('checked')) {
        var all = true;
        for(var i = 0; i < checkboxs.length; i++) {
            if(checkboxs[i].id != main_id && !checkboxs[i].checked) {
                all = false;
                break;
            }
        }

        if(all) {
            toggleMainBtn(main_id, true)
        }
    }
    else {
        toggleMainBtn(main_id, false)
    }
}

function toggleMainBtn(checkbox_id, flag) {
    var checkbox = $("#"+checkbox_id)
    if (flag) {
        checkbox.parent().addClass("is-checked");
        checkbox.prop('checked', true);
    } else {
        checkbox.parent().removeClass("is-checked");
        checkbox.prop('checked', false);
    }
}

function checkedAll(table_id, check_all_id) {
    var $table_obj = $("#"+table_id)
    if ($("#"+check_all_id).prop('checked')) {
        $table_obj.find(".mdl-checkbox__input:not([disabled])").prop("checked", true).parent().addClass("is-checked");
        $table_obj.find("tbody").find(".mdl-checkbox__input")
    }
    else {
        $table_obj.find(".mdl-checkbox__input").prop("checked", false).parent().removeClass("is-checked");
    }
}