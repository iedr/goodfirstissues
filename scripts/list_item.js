function createIconElement(icon_path, tooltip_text) {
    let icon = document.createElement("img");
    icon.setAttribute("src", icon_path);
    icon.setAttribute("width", "25");
    icon.setAttribute("height", "25");
    icon.setAttribute("viewBox", "0 0 20 20");
    icon.setAttribute("fill", "white");
    icon.setAttribute("class", "invert");
    icon.setAttribute("style", "margin-right: 10px;");
    icon.setAttribute("focusable", "false");
    icon.setAttribute("role", "img");
    icon.setAttribute("title", tooltip_text);
    icon.setAttribute("alt", tooltip_text);
    return icon;
}

function createRepoInfoText(icon_location,
        margin_amount,
        icon_tooltip_text,
        main_text) {
    let paragraph = document.createElement("p");
    paragraph.setAttribute("class", "mb-" + margin_amount + " text-justify");

    let info_icon = createIconElement(icon_location, icon_tooltip_text);
    paragraph.appendChild(info_icon);

    let text_elem = document.createElement("a");
    let text_node = document.createTextNode(main_text);
    text_elem.appendChild(text_node);
    paragraph.appendChild(text_elem);

    return paragraph;
}

function createListGroupItemForIssue(issue) {
    let num_assignees = issue.getNumAssignees();
    let created_at = issue.getCreatedAt();
    let repo_desc = issue.getIssueRepoDesc();
    let repo_name = issue.getIssueRepoName();
    let issue_title = issue.getIssueTitle();
    let issue_url = issue.getIssueUrl();
    let issue_labels = issue.getIssueLabels();
    let repo_prog_langs = issue.getRepoProgLangs();
    let owner_login = issue.getOwnerLogin();
    let num_stars = issue.getIssueRepoStars();

    let list_group_item = document.createElement("li");
    list_group_item.setAttribute("class", "issue-list-group-item clearfix");

    let heading_div = document.createElement("div");
    heading_div.setAttribute("class", "d-flex justify-content-between");

    // Issue's title
    let heading_h5 = document.createElement("h5");
    heading_h5.setAttribute("class",
        "issue-title mb-0 d-inline-block text-truncate");
    heading_h5.setAttribute("aria-label", `Issue: ${issue_title}`);
    let issue_title_textnode = document.createTextNode(issue_title);
    heading_h5.appendChild(issue_title_textnode);
    heading_div.appendChild(heading_h5);

    // Time of issue
    let time_of_issue = document.createElement("p");
    time_of_issue.setAttribute("class", "mb-1 text-justify font-weight-light");
    let small_text = document.createElement("small");
    let time_node = document.createTextNode(`${moment(created_at).format("LL")}
        - ${moment(created_at).fromNow()}`);
    small_text.appendChild(time_node);
    time_of_issue.appendChild(small_text);

    // Issue labels
    let labels_row = document.createElement("div");
    labels_row.setAttribute("class", "mb-4 flex-wrap justify-content-start");
    let labels_for_issue = document.createElement("div");
    labels_for_issue.setAttribute("title", "Label list");

    issue_labels.forEach(function(issue_label, index, array) {
        let issue_badge = document.createElement("span");
        issue_badge.setAttribute("class",
            "badge badge-secondary font-weight-bold");
        issue_badge.setAttribute("style", "margin-right: 10px;");
        issue_badge.setAttribute("title", issue_label);
        let issue_textnode = document.createTextNode(issue_label);
        issue_badge.appendChild(issue_textnode);
        labels_for_issue.appendChild(issue_badge);
    });

    labels_row.appendChild(labels_for_issue);

    // Repository stars
    let stars_text = num_stars > 1 ?
        `${num_stars} stars` :
        `${num_stars} star`;
    let stars_paragraph = createRepoInfoText("./assets/icons/star.svg",
                                                2,
                                                "Repo Stars",
                                                stars_text);

    // Owner information
    let owner_paragraph = createRepoInfoText("./assets/icons/user.svg",
                                                2,
                                                "Repo Owner",
                                                owner_login);

    // Assignee
    let assignee_text = num_assignees > 1 ?
        `${num_assignees} assignees` :
        `${num_assignees} assignee`;
    let assignee_paragraph = createRepoInfoText("./assets/icons/knowledge.svg",
                                                    4,
                                                    "Number of assignees",
                                                    assignee_text);

    // Repository name + description
    let repo_name_paragraph = createRepoInfoText("./assets/icons/git.svg",
                                                    2,
                                                    "Repo name",
                                                    "");

    let repo_name_textnode = document.createElement("a");
    if (repo_desc !== "") {
        repo_name_textnode.setAttribute("class", "repo-tooltip");
        repo_name_textnode.setAttribute("data-toggle", "tooltip");
        repo_name_textnode.setAttribute("data-placement", "right");
        repo_name_textnode.setAttribute("title", repo_desc);
    }
    repo_name_textnode.appendChild(document.createTextNode(repo_name));
    repo_name_paragraph.appendChild(repo_name_textnode);

    // Last row of list group item
    let last_row = document.createElement("div");
    last_row.setAttribute("class", "row");

    // Programming language information
    let prog_langs_col = document.createElement("div");
    prog_langs_col.setAttribute("title", "Programming language list");
    prog_langs_col.setAttribute("class",
        "col-9 d-flex justify-content-start align-items-start flex-wrap");

    repo_prog_langs.forEach(function(prog_lang, index, array) {
        let prog_lang_badge = document.createElement("span");
        prog_lang_badge.setAttribute("class",
            "badge badge-info font-weight-bold mr-2 mb-2");

        let prog_lang_textnode = document.createElement("span");
        prog_lang_textnode.setAttribute("class", "align-middle");
        prog_lang_textnode.setAttribute("title", prog_lang);
        prog_lang_textnode.append(document.createTextNode(prog_lang));
        prog_lang_badge.appendChild(prog_lang_textnode);
        prog_langs_col.appendChild(prog_lang_badge);
    });

    // Go to issue button
    let go_to_issue_btn_col = document.createElement("div");
    go_to_issue_btn_col.setAttribute("class",
        "col-3 d-flex justify-content-end");

    let go_to_issue_btn_div = document.createElement("div");
    go_to_issue_btn_div.setAttribute("class", "d-flex align-items-center");

    let go_to_issue_btn = document.createElement("a");
    go_to_issue_btn.setAttribute("href", issue_url);
    go_to_issue_btn.setAttribute("target", "_blank");
    go_to_issue_btn.setAttribute("type", "button");
    go_to_issue_btn.setAttribute("id", "goToIssue");
    go_to_issue_btn.setAttribute("style", "margin-right: 10px;");
    go_to_issue_btn.setAttribute("class", "btn btn-light btn-sm active");
    go_to_issue_btn.setAttribute("role", "link");

    // Go to issue button text
    let go_to_issue_textnode = document.createElement("span");
    go_to_issue_textnode.setAttribute("class", "align-middle");
    go_to_issue_textnode.append(document.createTextNode("Go to issue"));
    go_to_issue_btn.setAttribute("title", "Open issue on Github");
    go_to_issue_btn.appendChild(go_to_issue_textnode);

    go_to_issue_btn_div.appendChild(go_to_issue_btn);
    go_to_issue_btn_col.appendChild(go_to_issue_btn_div);

    last_row.appendChild(prog_langs_col);
    last_row.appendChild(go_to_issue_btn_col);

    list_group_item.appendChild(heading_div);
    list_group_item.appendChild(time_of_issue);
    list_group_item.appendChild(labels_row);
    list_group_item.appendChild(repo_name_paragraph);
    list_group_item.appendChild(stars_paragraph);
    list_group_item.appendChild(owner_paragraph);
    list_group_item.append(assignee_paragraph);
    list_group_item.append(last_row);

    return list_group_item;
}