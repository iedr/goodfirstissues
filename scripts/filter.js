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

function createClassifiedsUnderCheckbox() {
    let filter_row_parent = document.getElementById("filterRow");

    let filter_row = document.createElement("div");
    filter_row.setAttribute("class", "mt-3");
    filter_row.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1130124846637992"
             data-ad-slot="3373736248"
             data-ad-format="auto"
             data-full-width-responsive="true">
        </ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;
    filter_row_parent.appendChild(filter_row);

    
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


var checked_proglangs_session = sessionStorage.getItem('checked_proglangs');
var checked_labels_session = sessionStorage.getItem('checked_labels');
var checked_repo_names_session = sessionStorage.getItem('checked_repo_names');


function setChecked(checked_proglangs_session, checked_labels_session, checked_repo_names_session) {
    $(document).ready(function(){
        if(!checked_proglangs_session) {
            sessionStorage.setItem('checked_proglangs', []);
        }
        else {
            $(document).ready(function() {
                // console.log(checked_proglangs_session.split(",").join("  "))
                const checked_items = checked_proglangs_session.split(",").map(item => {
                    const itemChecked = document.querySelector(`#${item}`);
                    return itemChecked.innerText;
                })
                $('select#dropdownproglang').selectpicker('val', checked_items);
                $('select#dropdownproglang').selectpicker('refresh');
            });
        }
        if(!checked_labels_session) {
            sessionStorage.setItem('checked_labels', []);
        }
        else {
            $(document).ready(function() {
                const checked_items = checked_labels_session.split(",").map(item => {
                    const itemChecked = document.querySelector(`#${item}`);
                    return itemChecked.innerText;
                })
                // console.log($("select#dropdownlabel").selectpicker());
    
                $('select#dropdownlabel').selectpicker('val', checked_items);
                $('select#dropdownlabel').selectpicker('refresh');        
            });
        }
        if(!checked_repo_names_session) {
            sessionStorage.setItem('checked_repo_names', []);
        }
        else {
            const checked_items = checked_repo_names_session.split(",").map(item => {
                const itemChecked = document.querySelector(`#${item}`);
                    return itemChecked.innerText;
                return itemChecked.innerText;
            })
            // console.log($("select#dropdownrepo").selectpicker());
    
            $('select#dropdownrepo').selectpicker('val', checked_items);
            $('select#dropdownrepo').selectpicker('refresh');        
    
        }    

    })       
    
}