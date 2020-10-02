function killSpinner() {
    let spinner = document.getElementById("progressParent");
    spinner.parentNode.removeChild(spinner);
}

function renderFilteredList(filteredIssueList, entries_per_page) {
    let total_num_pages = Math.ceil(filteredIssueList.length / entries_per_page);

    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind("page");

    let number_of_visible_pages = 5;
    if ($(window).width() <= 440) {
        number_of_visible_pages = 2;
    }

    let issues_table = document.getElementById("issues_table");

    if (total_num_pages > 0) {
        $('#pagination').twbsPagination({
            totalPages: total_num_pages,
            visiblePages: number_of_visible_pages,
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

                $(function() {
                    $('[data-toggle="tooltip"]').tooltip()
                });
            }
        });
    } else {
        issues_table.appendChild(document.createTextNode(
            "Oops! Seems like there is no issue to show! Refresh to try again."
        ));
    }
    $("select").selectpicker("refresh");
}

$('#progress').css('width', '15%').html('15%');

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
    firebase.initializeApp(firebaseConfig);
    if (firebase.analytics) firebase.analytics();
    const db = firebase.firestore();

    data_list = [];

    $('#progress').css('width', '25%').html('25%');

    db.collection("issues")
        .orderBy("Issue.issue_createdAt", "desc")
        .limit(1500)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                data_list.push(doc.data())

                let pcg = Math.ceil(data_list.length / 1000 * 100);

                if (pcg >= 25) {
                    pcg = Math.min(pcg, 85);
                    $('#progress').css('width', pcg + '%').html(pcg + '%');
                }
            });
            cacheJS.set(cache_key, data_list, 43000);
        }).catch(e => {
            renderFilteredList([], 0);
            killSpinner();
        });
    $('#progress').css('width', '85%').html('85%');
} else {
    $('#progress').css('width', '85%').html('85%');
    main(data_list);
}

function main(data_list) {
    var entries_per_page = 10;

    // List of issues here
    var issues_list = [];
    var all_prog_langs = [];
    var all_types_of_issues = [];
    var all_repo_names = [];

    for (let i = 0; i < data_list.length; i++) {
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
    let sorted_issues_html_list = _.map(issues_list, o => createListGroupItemForIssue(o));

    // Create checkbox for filtering
    var sorted_prog_lang_counter = returnSortedCounterForCheckBox(all_prog_langs);
    createCheckBoxFromCounter(sorted_prog_lang_counter, "Programming Language", "proglang");

    var sorted_issue_counter = returnSortedCounterForCheckBox(all_types_of_issues);
    createCheckBoxFromCounter(sorted_issue_counter, "Issue Label", "label");

    var sorted_repo_name_counter = returnSortedCounterForCheckBox(all_repo_names);
    createCheckBoxFromCounter(sorted_repo_name_counter, "Repository", "repo");

    let checked_proglangs = [];
    let checked_labels = [];
    let checked_repo_names = [];

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
        
        if (dropdown_id === "dropdownproglang") {
            checked_proglangs = checked_items.slice();
        } else if (dropdown_id === "dropdownlabel") {
            checked_labels = checked_items.slice();
        } else {
            checked_repo_names = checked_items.slice();
        }

        // Do the actual filtering
        if (_.isEmpty(checked_proglangs) && 
                _.isEmpty(checked_labels) && 
                _.isEmpty(checked_repo_names)) {
            renderFilteredList(sorted_issues_html_list, entries_per_page);
        } else {
            let filtered_list = [];
            checked_proglangs = _.map(checked_proglangs, i => i.toLowerCase());
            checked_labels = _.map(checked_labels, i => i.toLowerCase());

            for (let j = 0; j < issues_list.length; j++) {
                let issue_item = issues_list[j];
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

                if (num_intersections > 0) {
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
    });

    $.when(renderFilteredList(sorted_issues_html_list, entries_per_page)).done(
        $('#progress').css('width', '100%'),
        $('#progress').removeClass('progress-bar-animated active').html('Complete'),
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
