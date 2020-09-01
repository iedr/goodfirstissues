function createSpinner() {
    let main_container = document.getElementById("container");
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "spinner-grow");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("id", "spinner");
    main_container.appendChild(spinner);
}

function killSpinner() {
    spinner = document.getElementById("spinner");
    spinner.parentNode.removeChild(spinner);
}

function renderFilteredList(filteredIssueList, entries_per_page) {
    let total_num_pages = Math.ceil(filteredIssueList.length / entries_per_page);

    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind("page");

    if (total_num_pages > 0) {
        $('#pagination').twbsPagination({
            totalPages: total_num_pages,
            visiblePages: 5,
            hideOnlyOnePage: true,
            onPageClick: function (event, page) {
                let page_index = page - 1;    // Variable page starts from 1
                issues_table.innerHTML = "";    // Clear the table page
                
                for (let i = page_index*entries_per_page; i < (page_index+1)*entries_per_page; i++) {
                    if (i >= filteredIssueList.length) {
                        break;
                    }
                    $("#issues_table").append(filteredIssueList[i]);
                }
                
                // Let scroller jump back to the top of the list
                $(".nano").nanoScroller({ scroll: 'top' });
            }
        });
    } else {
        issues_table.appendChild(document.createTextNode(
            "Oops! Seems like there is no issue to show!"
        ));
    }
    $("select").selectpicker("refresh");
}

var firebaseConfig = {
    apiKey: "AIzaSyCvOkKseJOsKE6u08_QAZ2LOBi_zbFH8yw",
    authDomain: "goodfirstissues-fd86e.firebaseapp.com",
    databaseURL: "https://goodfirstissues-fd86e.firebaseio.com",
    projectId: "goodfirstissues-fd86e",
    storageBucket: "goodfirstissues-fd86e.appspot.com",
    messagingSenderId: "1026917094869",
    appId: "1:1026917094869:web:23b8e8ed29d56d62f3595c",
    measurementId: "G-406E467XLZ",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Try to get from cache
var cache_key = "goodFirstIssuesData";
// cacheJS.removeByKey(cache_key);

var data_list = cacheJS.get(cache_key);

cacheJS.on('cacheAdded', function(objAdded) {
    let cache_data_list = objAdded.value;
    if (cache_data_list !== undefined && cache_data_list !== null) {
        main(cache_data_list);
    } else {
        main([]);
    }
});

if (data_list === null) {
    data_list = [];

    db.collection("issues").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data_list.push(doc.data())
        });
        cacheJS.set(cache_key, data_list, 43200000);
    }).catch(e => {
        renderFilteredList([], 0);
        killSpinner();
    });
} else {
    main(data_list);
}

function main(data_list) {
    var entries_per_page = 10;

    // List of issues here
    var issues_table = document.getElementById("issues_table");
    var issues_list = [];
    var all_prog_langs = [];
    var all_types_of_issues = [];
    for (let i = 0; i < data_list.length; i++) {
        let issue = new Issue(data_list[i]);
        issues_list.push(issue);

        let issue_prog_langs = _.uniq(issue.getRepoProgLangs());
        issue_prog_langs.forEach(pl => {
            all_prog_langs.push(_.upperFirst(pl));
        });

        let issue_labels = _.uniq(issue.getIssueLabels());
        issue_labels.forEach(i => {
            all_types_of_issues.push(_.lowerCase(i));
        });
    }

    // Sort issues list by recency by default
    let sorted_issues_list = _.reverse(_.sortBy(issues_list, o => o['created_at']));
    let sorted_issues_html_list = _.map(sorted_issues_list, o => createListGroupItemForIssue(o));

    // Create checkbox for filtering
    var sorted_prog_lang_counter = returnSortedCounterForCheckBox(all_prog_langs);
    let prog_lang_ids = createCheckBoxFromCounter(sorted_prog_lang_counter, "Programming Language", "proglang");

    var sorted_issue_counter = returnSortedCounterForCheckBox(all_types_of_issues);
    let label_ids = createCheckBoxFromCounter(sorted_issue_counter, "Issue Label", "label");

    let checked_proglangs = [];
    let checked_labels = [];

    // Reset buttons
    // let label_reset_all = document.getElementById("resetlabel");
    // label_reset_all.onclick = function() {
    //     $('.form-check[type=label] > input').prop('checked', false);
    //     $(".dropdown-outer").trigger("change");
    // };

    // let proglang_reset_all = document.getElementById("resetproglang");
    // proglang_reset_all.onclick = function() {
    //     $('.form-check[type=proglang] > input').prop('checked', false);
    //     $(".dropdown-outer").trigger("change");
    // };

    $("select").change(function() {
        let dropdown_id = $(this).attr("id");
        let options = document.getElementById(dropdown_id).querySelectorAll("option");
        options = _.map(options, function(item) {
            return item.getAttribute("title");
        })

        let dropdown_menu_items = document.getElementById(dropdown_id).nextSibling.nextSibling;

        let all_selected_items = dropdown_menu_items.querySelectorAll("li.selected");
        let selected_ids = _.map(all_selected_items, function(item) {
            let selected_option_id = item.getElementsByTagName("a")[0].getAttribute("id");
            return selected_option_id;
        });

        let checked_items = _.map(selected_ids, function(item) {
            let split_by_dash = _.split(item, "-");
            let idx_selected = split_by_dash[ split_by_dash.length - 1 ];
            idx_selected = _.toInteger(idx_selected);
            return options[idx_selected];
        });

        // let badge_area = document.getElementById("badgesproglang");

        if (dropdown_id === "dropdownproglang") {
            checked_proglangs = checked_items.slice();
        } else {
            checked_labels = checked_items.slice();
            // badge_area = document.getElementById("badgeslabel");
        }

        // badge_area.innerHTML = "";
        // for (let i = 0; i < checked_items.length; i++) {
        //     let badge = document.createElement("span");
        //     badge.setAttribute("class", "badge badge-primary mr-2 mb-1");
        //     badge.append(document.createTextNode(checked_items[i]));

        //     let close_btn = document.createElement("button");
        //     close_btn.setAttribute("type", "button");
        //     close_btn.setAttribute("class", "close");
        //     close_btn.setAttribute("aria-label", "Remove");
        //     let close_span = document.createElement("span");
        //     close_span.setAttribute("aria-hidden", "true");
        //     close_span.setAttribute("style", "text-shadow: None");
        //     close_span.innerHTML = "&times;";

        //     close_btn.appendChild(close_span);
        //     close_btn.onclick = function() {
        //         let closed_item = checked_items[i];
        //         let remaining_checked_items = _.without(checked_items, closed_item);
        //         $("#" + dropdown_id).find('[title="' + closed_item + '"]').prop("selected", false);
        //         $values = $("#" + dropdown_id).val();

        //         console.log(remaining_checked_items);

        //         $("#" + dropdown_id).selectpicker('deselectAll');
        //         $("#" + dropdown_id).selectpicker('val', remaining_checked_items);
        //         $("#" + dropdown_id).selectpicker('refresh');
        //         $("#" + dropdown_id).selectpicker({
        //             multiple: true
        //         });
        //     };

        //     badge.appendChild(close_btn);
        //     badge_area.appendChild(badge);
        // }

        // Do the actual filtering
        if (_.isEmpty(checked_proglangs) && _.isEmpty(checked_labels)) {
            renderFilteredList(sorted_issues_html_list, entries_per_page);
        } else {
            let filtered_list = [];
            checked_proglangs = _.map(checked_proglangs, _.toLower);
            checked_labels = _.map(checked_labels, _.toLower);

            for (let j = 0; j < issues_list.length; j++) {
                let issue_item = issues_list[j];
                let repo_langs = issue_item.getRepoProgLangs();
                let issues_labels = issue_item.getIssueLabels();

                let lowered_issue_labels = _.map(issues_labels, _.toLower);
                let lowered_prog_langs = _.map(repo_langs, _.toLower);

                let intersection_prog_langs = _.intersection(checked_proglangs, lowered_prog_langs);
                let intersection_labels = _.intersection(checked_labels, lowered_issue_labels);
                let num_intersections = _.concat(intersection_prog_langs, intersection_labels).length;

                if (num_intersections > 0) {
                    filtered_list.push({
                        'issue': issue_item,
                        'num_intersections': num_intersections
                    });
                }
            }

            // Sort list by number of intersections (descending)
            let sorted_filtered_list = _.reverse(_.sortBy(
                filtered_list,
                o => o['num_intersections']
            ));

            // sorted_filtered_list = _.reverse(_.sortBy(sorted_filtered_list, o => o['created_at']));
            let sorted_issue_list = _.map(sorted_filtered_list, o => o['issue']);

            sorted_issue_list = _.map(sorted_issue_list, o => createListGroupItemForIssue(o));
            renderFilteredList(sorted_issue_list, entries_per_page);
        }
    });

    // $(".dropdown-outer").change(function() {
    //     let dropdown_id = $(this).attr("id");
    //     let all_form_checks = $(this).children().find(".form-check-input");
    //     let checked_items = _.filter(all_form_checks, c => c["checked"]);
    //     checked_items = _.map(checked_items, i => i["nextSibling"]);
    //     checked_items = _.map(checked_items, e => $(e.outerHTML).attr("text"));
        
    //     let badge_area = document.getElementById("badgesproglang");

    //     if (dropdown_id === "dropdownproglang") {
    //         checked_proglangs = checked_items.slice();
    //     } else {
    //         checked_labels = checked_items.slice();
    //         badge_area = document.getElementById("badgeslabel");
    //     }

    //     badge_area.innerHTML = "";
    //     for (let i = 0; i < checked_items.length; i++) {
    //         let badge = document.createElement("span");
    //         badge.setAttribute("class", "badge badge-primary mr-2 mb-1");
    //         badge.append(document.createTextNode(checked_items[i]));

    //         let close_btn = document.createElement("button");
    //         close_btn.setAttribute("type", "button");
    //         close_btn.setAttribute("class", "close");
    //         close_btn.setAttribute("aria-label", "Remove");
    //         let close_span = document.createElement("span");
    //         close_span.setAttribute("aria-hidden", "true");;
    //         close_span.setAttribute("style", "text-shadow: None");
    //         close_span.innerHTML = "&times;";

    //         close_btn.appendChild(close_span);
    //         close_btn.onclick = function() {
    //             $("input[class='form-check-input'][text='" + checked_items[i] + "']").prop('checked', false);
    //             $(".dropdown-outer").trigger("change");
    //         };

    //         badge.appendChild(close_btn);
    //         badge_area.appendChild(badge);
    //     }

    //     // Do the actual filtering
    //     if (_.isEmpty(checked_proglangs) && _.isEmpty(checked_labels)) {
    //         renderFilteredList(sorted_issues_html_list, entries_per_page);
    //     } else {
    //         let filtered_list = [];
    //         checked_proglangs = _.map(checked_proglangs, _.toLower);
    //         checked_labels = _.map(checked_labels, _.toLower);

    //         for (let j = 0; j < issues_list.length; j++) {
    //             let issue_item = issues_list[j];
    //             let repo_langs = issue_item.getRepoProgLangs();
    //             let issues_labels = issue_item.getIssueLabels();

    //             let lowered_issue_labels = _.map(issues_labels, _.toLower);
    //             let lowered_prog_langs = _.map(repo_langs, _.toLower);

    //             let intersection_prog_langs = _.intersection(checked_proglangs, lowered_prog_langs);
    //             let intersection_labels = _.intersection(checked_labels, lowered_issue_labels);
    //             let num_intersections = _.concat(intersection_prog_langs, intersection_labels).length;

    //             if (num_intersections > 0) {
    //                 filtered_list.push({
    //                     'issue': issue_item,
    //                     'num_intersections': num_intersections
    //                 });
    //             }
    //         }

    //         // Sort list by number of intersections (descending)
    //         let sorted_filtered_list = _.reverse(_.sortBy(
    //             filtered_list,
    //             o => o['num_intersections']
    //         ));

    //         // sorted_filtered_list = _.reverse(_.sortBy(sorted_filtered_list, o => o['created_at']));
    //         let sorted_issue_list = _.map(sorted_filtered_list, o => o['issue']);

    //         sorted_issue_list = _.map(sorted_issue_list, o => createListGroupItemForIssue(o));
    //         renderFilteredList(sorted_issue_list, entries_per_page);
    //     }
    // });

    $.when(renderFilteredList(sorted_issues_html_list, entries_per_page)).done(
        killSpinner()
    );

    // Initialise nano scroller
    $(document).ready(function(){
        $(".nano").nanoScroller();
        
        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        });
    });

    // Make sure upon clicking on dropdown menu, menu doesn't hide
    $(document).on('click', '.dropdown-menu', e => e.stopPropagation());
}

