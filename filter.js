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

function createCheckBoxFromCounter(counter, title, attrId) {
    let filter_row_parent = document.getElementById("filterRow");
    let filter_row = document.createElement("div");
    filter_row.setAttribute("class", "col-md-12 col-sm-6");

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

    for (let i = 0; i < counter.length; i++) {
        counter_item = counter[i];
        item = counter_item[0];
        count = counter_item[1];

        if (item === "good first issue") {
            continue
        }

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

        option.setAttribute("title", item);
        option.appendChild(checkbox_text);
        dropdown_element.appendChild(option);
    }

    filter_row.appendChild(dropdown_element);
    filter_row_parent.appendChild(filter_row);
}