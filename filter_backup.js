function Counter(array) {
    array.forEach(val => this[val] = (this[val] || 0) + 1);
}

function returnSortedCounterForCheckBox(lst) {
    var counter = new Counter(lst);
    var sorted_counter = [];
    for (var item in counter) {
        sorted_counter.push([item, counter[item]]);
    }

    sorted_counter.sort(function(a, b) {
        return b[1] - a[1];
    });
    
    return sorted_counter;
}

function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}

function createCheckBoxFromCounter(counter, title, attrId) {
    let filter_row = document.getElementById("filterRow");

    // Filter header (e.g. Filter by Programming Language)
    let filter_header = document.createElement("div");
    filter_header.setAttribute("class", "row mb-3 text-left");
    filter_header.appendChild(document.createTextNode("Filter by " + title + ":"));
    filter_row.appendChild(filter_header);

    let dropdown_element = document.createElement("select");
    dropdown_element.setAttribute("class", "selectpicker drop form-control mb-3");
    dropdown_element.setAttribute("multiple", "");
    dropdown_element.setAttribute("data-actions-box", "true");
    dropdown_element.setAttribute("data-live-search", "true");
    dropdown_element.setAttribute("data-selected-text-format", "count > 2");
    dropdown_element.setAttribute("id", "dropdown" + attrId);
    dropdown_element.setAttribute("virtualScroll", 10);

    let checkbox_ids = [];
    for (let i = 0; i < counter.length; i++) {
        counter_item = counter[i];
        item = counter_item[0];
        count = counter_item[1];

        if (item === "good first issue") {
            continue
        }

        let checkbox_id = attrId + item.replace(/\s+/g, '-');
        checkbox_ids.push(checkbox_id);
        
        // Start of form creation
        let option = document.createElement("option");
        let checkbox_text = document.createElement("span");
        let item_text = document.createElement("span");
        item_text.setAttribute("class", "item-text");
        item_text.append(document.createTextNode(item));

        let count_text = document.createElement("span");
        count_text.append(document.createTextNode(" (" + count.toString() + ")"));

        checkbox_text.appendChild(item_text);
        checkbox_text.appendChild(count_text);

        // let checkbox_text = document.createTextNode(item + " (" + count.toString() + ")");
        option.setAttribute("title", item);
        option.appendChild(checkbox_text);
        dropdown_element.appendChild(option);
    }

    filter_row.appendChild(dropdown_element);

    // Badges area
    // let checked_badges_area = document.createElement("div");
    // checked_badges_area.setAttribute("class", "row mb-5");
    // checked_badges_area.setAttribute("id", "badges" + attrId);
    // filter_row.appendChild(checked_badges_area);

    return checkbox_ids;
}

// function createCheckBoxFromCounter(counter, title, attrId) {
//     let filter_row = document.getElementById("filterRow");

//     // Filter header (e.g. Filter by Programming Language)
//     let filter_header = document.createElement("div");
//     filter_header.setAttribute("class", "row mb-3");
//     filter_header.appendChild(document.createTextNode("Filter by " + title + ":"));
//     filter_row.appendChild(filter_header);

//     let dropdown_element = document.createElement("div");
//     dropdown_element.setAttribute("class", "btn-group drop mb-3");

//     let dropdown_button = document.createElement("button");
//     dropdown_button.setAttribute("class", "btn btn-secondary btn-sm dropdown-toggle");
//     dropdown_button.setAttribute("data-toggle", "dropdown");
//     dropdown_button.setAttribute("type", "button");
//     dropdown_button.setAttribute("aria-haspopup", "true");
//     dropdown_button.setAttribute("aria-expanded", "false");
//     dropdown_button.setAttribute("id", attrId);
//     dropdown_button.appendChild(document.createTextNode(title));

//     let dropdown_outer_div = document.createElement("div");
//     dropdown_outer_div.setAttribute("id", "dropdown" + attrId);
//     dropdown_outer_div.setAttribute("class", "dropdown-outer");

//     let dropdown_menu = document.createElement("div");
//     dropdown_menu.setAttribute("class", "dropdown-menu");
//     dropdown_menu.setAttribute("aria-labelledby", attrId);

//     if (counter.length > 0) {
//         let reset_all_button = document.createElement("a");
//         reset_all_button.setAttribute("class", "dropdown-item");
//         reset_all_button.setAttribute("href", "#");
//         reset_all_button.setAttribute("id", "reset" + attrId);
//         reset_all_button.appendChild(document.createTextNode("Reset all"));

//         reset_all_button.onclick = function() {
//             $('.form-check[type=' + attrId + '] > input').prop('checked', false);
//             $(".dropdown-outer").trigger("change");
//         };

//         dropdown_menu.appendChild(reset_all_button);
//     }
    
//     let checkbox_ids = [];
//     for (let i = 0; i < counter.length; i++) {
//         counter_item = counter[i];
//         item = counter_item[0];
//         count = counter_item[1];

//         if (item === "good first issue") {
//             continue
//         }
        
//         // Start of form creation
//         let form_check = document.createElement("div");
//         form_check.setAttribute("class", "form-check dropdown-item");
//         form_check.setAttribute("type", attrId);
        
//         let input_class = document.createElement("input");
//         input_class.setAttribute("class", "form-check-input");
//         input_class.setAttribute("type", "checkbox");
//         input_class.setAttribute("text", item);

//         let checkbox_id = attrId + item.replace(/\s+/g, '-');
//         let cleaned_id = hashCode(checkbox_id).toString();
//         input_class.setAttribute("id", cleaned_id);
        
//         let label_class = document.createElement("label");
//         label_class.setAttribute("class", "form-check-label");
//         label_class.setAttribute("for", cleaned_id);
//         label_class.setAttribute("text", item);
        
//         let checkbox_text = document.createTextNode(item + " (" + count.toString() + ")");
//         label_class.appendChild(checkbox_text);
        
//         form_check.appendChild(input_class);
//         form_check.appendChild(label_class);
        
//         dropdown_menu.appendChild(form_check);

//         checkbox_ids.push(checkbox_id);
//     }

//     dropdown_element.appendChild(dropdown_button);
//     dropdown_outer_div.appendChild(dropdown_menu);
//     dropdown_element.appendChild(dropdown_outer_div);
//     filter_row.appendChild(dropdown_element);

//     // Badges area
//     let checked_badges_area = document.createElement("div");
//     checked_badges_area.setAttribute("class", "row mb-5");
//     checked_badges_area.setAttribute("id", "badges" + attrId);
//     filter_row.appendChild(checked_badges_area);
    
//     return checkbox_ids;
// }

// function createCheckBoxFromCounter(counter, title, attrId) {
//     let filter_column = document.getElementById("filterCol");
//     let header_row = document.createElement("div");
//     header_row.setAttribute("class", "row mb-1");

//     let header = document.createElement("h6");
//     let header_text = document.createTextNode(title);
//     header.appendChild(header_text);
//     header_row.appendChild(header);
//     filter_column.appendChild(header_row);

//     let filter_row = document.createElement("div");
//     filter_row.setAttribute("class", "row mb-4");
//     let checkbox_div = document.createElement("div");
//     checkbox_div.setAttribute("class", "text-justify");

//     let punctuations = "+-#-!/*@:"
//     let checkbox_ids = [];
//     for (let i = 0; i < counter.length; i++) {
//         counter_item = counter[i];
//         item = counter_item[0];
//         count = counter_item[1];
        
//         // Start of form creation
//         let form_check = document.createElement("div");
//         form_check.setAttribute("class", "form-check");
//         form_check.setAttribute("type", attrId);
        
//         let input_class = document.createElement("input");
//         input_class.setAttribute("class", "form-check-input");
//         input_class.setAttribute("type", "checkbox");

//         let checkbox_id = attrId + item.replace(/\s+/g, '-');
//         let cleaned_id = hashCode(checkbox_id).toString();
//         input_class.setAttribute("id", cleaned_id);
        
//         let label_class = document.createElement("label");
//         label_class.setAttribute("class", "form-check-label");
//         label_class.setAttribute("for", cleaned_id);
//         label_class.setAttribute("text", item);
        
//         let checkbox_text = document.createTextNode(item + " (" + count.toString() + ")");
//         label_class.appendChild(checkbox_text);
        
//         form_check.appendChild(input_class);
//         form_check.appendChild(label_class);
        
//         checkbox_div.appendChild(form_check);

//         checkbox_ids.push(checkbox_id);
//     }
//     filter_row.appendChild(checkbox_div);
//     filter_column.appendChild(filter_row);

//     return checkbox_ids;
// }