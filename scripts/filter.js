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

        if (count > 1) {
            count_text.append(document.createTextNode(" (" + count.toString() + " issues" + ")"));
        } else {
            count_text.append(document.createTextNode(" (" + count.toString() + " issue" + ")"));
        }

        checkbox_text.appendChild(item_text);
        checkbox_text.appendChild(count_text);

        option.setAttribute("title", item);
        option.appendChild(checkbox_text);
        dropdown_element.appendChild(option);
    }

    filter_row.appendChild(dropdown_element);
    filter_row_parent.appendChild(filter_row);
}

function createInputFormRepoStars(title, attrId) {
    let filter_row_parent = document.getElementById("filterRow");
    let filter_row = document.createElement("div");
    filter_row.setAttribute("class", "col-md-12 col-sm-6");

    // Filter header (e.g. Filter by Programming Language)
    let filter_header = document.createElement("div");
    filter_header.setAttribute("class", "row mb-3 text-left");

    filter_header.appendChild(document.createTextNode("Filter by " + title + ":"));
    filter_row.appendChild(filter_header);

    let form_element = document.createElement("input");
    form_element.setAttribute("class", "selectpicker drop form-control mb-3");
    form_element.setAttribute("id", "inputform" + attrId);
    form_element.setAttribute("placeholder", "Any number");
    form_element.setAttribute("type", "number");
    filter_row.appendChild(form_element);
    filter_row_parent.appendChild(filter_row);
}

// Array to return the checked items found in storage. Empty if no items were checked before.
var checked_proglangs = [], checked_labels = [], checked_repo_names = [], minimum_repo_stars = [];

// arguments contain the checked items accessed from storage
function setChecked(checked_proglangs_session, checked_labels_session, checked_repo_names_session, minimum_repo_stars_session) {
    $(document).ready(function(){
        if(!checked_proglangs_session) {
            sessionStorage.setItem('checked_proglangs', []);
        }
        else {
            // If the previously selected items are not empty set the checked state for all options to "checked"
            const options = document.getElementById('dropdownproglang').querySelectorAll('option');

            const checked_items = checked_proglangs_session.split(",").map(item => {
                // access the option number from dropdown to be returned to main() in "cover.js". 
                // This ensures that any newly checked item by the user, or any item unchecked is manipulated in the same array with previously checked results.
                const itemNumInList = item.split("-")[item.split("-").length - 1]
                checked_proglangs.push(options[itemNumInList].querySelector('.item-text').innerText);

                // access the checked item id and inner text and save it in an array which is passed to val() set to be in "checked" state
                const itemChecked = document.querySelector(`#${item}`);
                return itemChecked.innerText;
            })
            
            $('select#dropdownproglang').selectpicker('val', checked_items);
            $('select#dropdownproglang').selectpicker('refresh');
        }
        if(!checked_labels_session) {
            sessionStorage.setItem('checked_labels', []);
        }
        else {
            // If the previously selected items are not empty set the checked state for all options to "checked"           
            const options = document.getElementById('dropdownlabel').querySelectorAll('option');

            const checked_items = checked_labels_session.split(",").map(item => {
                 // access the option number from dropdown to be returned to main() in "cover.js". 
                // This ensures that any newly checked item by the user, or any item unchecked is manipulated in the same array with previously checked results.
                const itemNumInList = item.split("-")[item.split("-").length - 1]
                checked_labels.push(options[itemNumInList].querySelector('.item-text').innerText);

                // access the checked item id and inner text and save it in an array which is passed to val() set to be in "checked" state
                const itemChecked = document.querySelector(`#${item}`);
                return itemChecked.innerText;
            })
    
            $('select#dropdownlabel').selectpicker('val', checked_items);
            $('select#dropdownlabel').selectpicker('refresh');  
        }
        if(!checked_repo_names_session) {
            sessionStorage.setItem('checked_repo_names', []);
        }
        else {
            // If the previously selected items are not empty set the checked state for all options to "checked"  
            const options = document.getElementById('dropdownrepo').querySelectorAll('option');

            const checked_items = checked_repo_names_session.split(",").map(item => {
                // access the option number from dropdown to be returned to main() in "cover.js". 
                // This ensures that any newly checked item by the user, or any item unchecked is manipulated in the same array with previously checked results.
                const itemNumInList = item.split("-")[item.split("-").length - 1]
                checked_repo_names.push(options[itemNumInList].querySelector('.item-text').innerText)

                // access the checked item id and inner text and save it in an array which is passed to val() set to be in "checked" state
                const itemChecked = document.querySelector(`#${item}`);
                return itemChecked.innerText;
            })
    
            $('select#dropdownrepo').selectpicker('val', checked_items);
            $('select#dropdownrepo').selectpicker('refresh');        
        }    
        if(!minimum_repo_stars_session) {
            sessionStorage.setItem('minimum_repo_stars', "");
        }
        else {
            minimum_repo_stars = minimum_repo_stars_session;
            document.getElementById("inputformrepostars").setAttribute('value', minimum_repo_stars);
        }   

        // filter the checked items obtained from the session storage.
        filterResult();
    })     

    // return the checked options to main()
    return [checked_proglangs, checked_labels, checked_repo_names, minimum_repo_stars];
   
}

function filterResult() {
    var entries_per_page = 10;

    // List of issues here
    var issues_list = [];
    var all_prog_langs = [];
    var all_types_of_issues = [];
    var all_repo_names = [];

    for (let i = 0; i < data_list.length; i++) {
        if (data_list[i].Issue.issue_url === "") {
            continue
        }

        let issue = new Issue(data_list[i]);
        issues_list.push(issue);

        let issue_prog_langs = _.uniq(issue.getRepoProgLangs());
        issue_prog_langs.forEach(pl => {
            all_prog_langs.push(_.upperFirst(pl));
        });

        let issue_labels = _.uniq(issue.getIssueLabels());
        issue_labels.forEach(i => {
            all_types_of_issues.push((i.toLowerCase()));
        });

        let repo = issue.getIssueRepoName();
        all_repo_names.push(repo);
    }

    // Sort issues list by recency by default
    if (_.isEmpty(checked_proglangs) &&
                _.isEmpty(checked_labels) &&
                _.isEmpty(checked_repo_names) &&
                (minimum_repo_stars == "")) {
            let sorted_issues_html_list = _.map(issues_list, o => createListGroupItemForIssue(o));
            renderFilteredList(sorted_issues_html_list, entries_per_page);
        } else {
            let filtered_list = [];
            checked_proglangs = _.map(checked_proglangs, i => i.toLowerCase());
            checked_labels = _.map(checked_labels, i => i.toLowerCase());

            for (let j = 0; j < issues_list.length; j++) {
                let issue_item = issues_list[j];
                if (issue_item.getRepoStars() < minimum_repo_stars) { 
                    continue
                }
                let repo_langs = issue_item.getRepoProgLangs();
                let issues_labels = issue_item.getIssueLabels();
                let issue_repo = issue_item.getIssueRepoName();

                let lowered_issue_labels = _.map(issues_labels, i => i.toLowerCase());
                let lowered_prog_langs = _.map(repo_langs, i => i.toLowerCase());

                let intersection_prog_langs = _.intersection(checked_proglangs, lowered_prog_langs);
                let intersection_labels = _.intersection(checked_labels, lowered_issue_labels);
                let intersection_repos = _.intersection(checked_repo_names, [issue_repo]);

                let num_intersections = _.concat(
                    intersection_prog_langs,
                    intersection_labels,
                    intersection_repos
                ).length;

                if (num_intersections > 0 
                    || _.isEmpty(checked_proglangs) && _.isEmpty(checked_labels) && _.isEmpty(checked_repo_names)) { 
                    filtered_list.push({
                        'issue': issue_item,
                        'num_intersections': num_intersections
                    });
                }
            }

            // Sort list by number of intersections (descending)
            let sorted_filtered_list = _.orderBy(
                filtered_list,
                [o => o['num_intersections'], o => o['issue_createdAt']],
                ['desc', 'desc']
            );

            // sorted_filtered_list = _.reverse(_.sortBy(sorted_filtered_list, o => o['created_at']));
            let sorted_issue_list = _.map(sorted_filtered_list, o => o['issue']);

            sorted_issue_list = _.map(sorted_issue_list, o => createListGroupItemForIssue(o));
            renderFilteredList(sorted_issue_list, entries_per_page);
        }
        showStatusMessage("Selections have been applied!");
}
function showStatusMessage(message) {
    // 상태 메시지 DOM 생성
    const statusElement = document.createElement("div");
    statusElement.innerText = message;
    statusElement.setAttribute("id", "statusMessage");
    statusElement.style.position = "fixed";
    statusElement.style.top = "20px";
    statusElement.style.right = "20px";
    statusElement.style.padding = "10px";
    statusElement.style.backgroundColor = "#4caf50"; // 녹색 배경
    statusElement.style.color = "white";
    statusElement.style.borderRadius = "5px";
    statusElement.style.zIndex = 1000;

    // 메시지를 페이지에 추가
    document.body.appendChild(statusElement);

    // 2초 후 메시지 제거
    setTimeout(() => {
        if (statusElement) statusElement.remove();
    }, 2000);
}