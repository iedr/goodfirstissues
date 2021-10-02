var checked_proglangs_session = sessionStorage.getItem('checked_proglangs');
var checked_labels_session = sessionStorage.getItem('checked_labels');
var checked_repo_names_session = sessionStorage.getItem('checked_repo_names');

function killSpinner() {
    let spinner = document.getElementById("loading");
    spinner.parentNode.removeChild(spinner);
}

function showTable() {
    let mainRow = document.getElementById("mainRow");
    mainRow.classList.add('visible');
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

                    if (i % 5 === 0) {
                        let ad_item = document.createElement("li");
                        ad_item.setAttribute("class", "issue-list-group-item clearfix");
                        ad_item.innerHTML = `
                            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                            <ins class="adsbygoogle"
                                 style="display:block"
                                 data-ad-format="fluid"
                                 data-ad-layout-key="-fb+5w+4e-db+86"
                                 data-ad-client="ca-pub-1130124846637992"
                                 data-ad-slot="5362633000">
                            </ins>
                            <script>
                                 (adsbygoogle = window.adsbygoogle || []).push({});
                            </script>
                        `;
                        $("#issues_table").append(ad_item);
                    }
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

function main(data_list) {
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
    let sorted_issues_html_list = _.map(issues_list, o => createListGroupItemForIssue(o));

    // Create checkbox for filtering
    var sorted_prog_lang_counter = returnSortedCounterForCheckBox(all_prog_langs);
    createCheckBoxFromCounter(sorted_prog_lang_counter, "Programming Language", "proglang");

    var sorted_issue_counter = returnSortedCounterForCheckBox(all_types_of_issues);
    createCheckBoxFromCounter(sorted_issue_counter, "Issue Label", "label");

    var sorted_repo_name_counter = returnSortedCounterForCheckBox(all_repo_names);
    createCheckBoxFromCounter(sorted_repo_name_counter, "Repository", "repo");

    createClassifiedsUnderCheckbox();
    
    setChecked(checked_proglangs_session, checked_labels_session, checked_repo_names_session);

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

        if(dropdown_id === 'dropdownproglang') {
            checked_proglangs_items = [];
            selected_ids.forEach(id => {
                checked_proglangs_items.push(id);
            })
            sessionStorage.setItem('checked_proglangs', checked_proglangs_items)
        }

        else if(dropdown_id === 'dropdownlabel') {
            const checked_labels_items = [];
            selected_ids.forEach(id => {
                checked_labels_items.push(id);
            })
            sessionStorage.setItem('checked_labels', checked_labels_items);

        }

        else if(dropdown_id === 'dropdownrepo') {
            const checked_repo_names_items = [];
            selected_ids.forEach(id => {
                checked_repo_names_items.push(id);
            })
            sessionStorage.setItem('checked_repo_names', checked_repo_names_items)

        }
       




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
            // console.log(checked_proglangs_session, checked_labels_session, checked_repo_names_session);      
        }
    });

    $.when(renderFilteredList(sorted_issues_html_list, entries_per_page)).done(function() {
        killSpinner();
        showTable();
    });

    // Initialise nano scroller
    $(document).ready(function(){
        $(".nano").nanoScroller({ alwaysVisible: true });


        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        });
    });

    // Make sure upon clicking on dropdown menu, menu doesn't hide
    $(document).on('click', '.dropdown-menu', e => e.stopPropagation());

}

data_list = [];

$.getJSON("https://raw.githubusercontent.com/darensin01/goodfirstissues/master/backend/data.json", function(data) {
    data_list = data;
    data_list.sort(
        function(a, b) {
            return b.Issue.issue_createdAt - a.Issue.issue_createdAt
        }
    );
}).fail(function() {
    renderFilteredList([], 0);
    killSpinner();
    showTable();
}).done(function() {
    main(data_list);
});
