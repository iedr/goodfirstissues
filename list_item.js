function createIconElement(icon_path, tooltip_text) {
    var icon = document.createElement("img")
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
    return icon;
}

function createListGroupItemForIssue(issue) {
    var num_assignees = issue.getNumAssignees();
    var num_comments = issue.getNumComments();
    var created_at = issue.getCreatedAt();
    var labels_count = issue.getIssueLabelsCount();
    var repo_desc = issue.getIssueRepoDesc();
    var repo_name = issue.getIssueRepoName();
    var repo_url = issue.getIssueRepoUrl();
    var issue_title = issue.getIssueTitle();
    var issue_url = issue.getIssueUrl();
    var issue_labels = issue.getIssueLabels();
    var repo_prog_langs = issue.getRepoProgLangs();
    var owner_login = issue.getOwnerLogin();

    var list_group_item = document.createElement("li");
    list_group_item.setAttribute("class", "issue-list-group-item clearfix");
    
    var heading_div = document.createElement("div");
    heading_div.setAttribute("class", "d-flex justify-content-between");
    
    // Issue's title
    var heading_h5 = document.createElement("h5");
    heading_h5.setAttribute("class", "mb-0 d-inline-block text-truncate");
    var issue_title_textnode = document.createTextNode(issue_title);
    heading_h5.appendChild(issue_title_textnode);
    heading_div.appendChild(heading_h5);

    // Time of issue
    var time_of_issue = document.createElement("p");
    time_of_issue.setAttribute("class", "mb-1 text-justify font-weight-light")
    var small_text = document.createElement("small");
    var formatted_time = moment(created_at).format('LL');
    var from_now_time = moment(created_at).fromNow();
    var time_textnode = document.createTextNode(formatted_time + " (" + from_now_time + ")");
    small_text.appendChild(time_textnode);
    time_of_issue.appendChild(small_text);
    
    // Issue labels
    var labels_row = document.createElement("div");
    labels_row.setAttribute("class", "mb-4 flex-wrap justify-content-start");
    var labels_for_issue = document.createElement("div");
    for (let issue_label of issue_labels) {
        var issue_badge = document.createElement("span");
        issue_badge.setAttribute("class", "badge badge-secondary font-weight-bold");
        issue_badge.setAttribute("style", "margin-right: 10px;");
        var issue_textnode = document.createTextNode(issue_label);
        issue_badge.appendChild(issue_textnode);
        labels_for_issue.appendChild(issue_badge);
    }
    labels_row.appendChild(labels_for_issue);

    // Repository name + owner
    var paragraph_repo_name = document.createElement("p");
    paragraph_repo_name.setAttribute("class", "mb-2 text-justify");

    var repo_name_icon = createIconElement("./assets/icons/git.svg", "Repository name");
    paragraph_repo_name.appendChild(repo_name_icon);
    
    var paragraph_repo_name_textnode = document.createElement("a");
    paragraph_repo_name_textnode.setAttribute("class", "repo-tooltip");
    paragraph_repo_name_textnode.setAttribute("data-toggle", "tooltip");
    paragraph_repo_name_textnode.setAttribute("data-placement", "right");
    paragraph_repo_name_textnode.setAttribute("title", repo_desc);
    paragraph_repo_name_textnode.appendChild(document.createTextNode(repo_name));
    paragraph_repo_name.appendChild(paragraph_repo_name_textnode);

    // Owner login information
    var owner_login_info = document.createElement("p");
    owner_login_info.setAttribute("class", "mb-2 text-justify");
    var owner_login_info_icon = createIconElement("./assets/icons/user.svg", "Owner of repository");
    owner_login_info.appendChild(owner_login_info_icon);
    owner_login_info.appendChild(document.createTextNode(owner_login));
    
    // Comments information
    var assignees = document.createElement("p");
    assignees.setAttribute("class", "mb-4 text-justify");
    var assignees_icon = createIconElement("./assets/icons/knowledge.svg", "Number of assignees");
    assignees.appendChild(assignees_icon);

    var assignee_text_span = document.createElement("span");
    var assignee_text = num_assignees + " assignee";
    if (num_assignees > 1) {
        assignee_text += "s";
    }

    var assignee_text_textnode = document.createTextNode(assignee_text);
    assignee_text_span.appendChild(assignee_text_textnode);
    assignees.appendChild(assignee_text_span);

    // Last row of list group item
    var last_row = document.createElement("div");
    last_row.setAttribute("class", "row");

    // Programming language information
    let prog_langs_col = document.createElement("div");
    prog_langs_col.setAttribute("class", "col-9 d-flex justify-content-start align-items-start flex-wrap");
    for (let p of repo_prog_langs) {
        var prog_lang_badge = document.createElement("span");
        prog_lang_badge.setAttribute("class", "badge badge-info font-weight-bold mr-2 mb-2");
        var prog_lang_textnode = document.createElement("span");
        prog_lang_textnode.setAttribute("class", "align-middle");
        prog_lang_textnode.append(document.createTextNode(p));
        prog_lang_badge.appendChild(prog_lang_textnode);
        prog_langs_col.appendChild(prog_lang_badge);
    }

    // Go to issue button
    let go_to_issue_btn_col = document.createElement("div");
    go_to_issue_btn_col.setAttribute("class", "col-3 d-flex justify-content-end");

    let go_to_issue_btn_div = document.createElement("div");
    go_to_issue_btn_div.setAttribute("class", "d-flex align-items-center");

    var go_to_issue_btn = document.createElement("a");
    go_to_issue_btn.setAttribute("href", issue_url);
    go_to_issue_btn.setAttribute("target", "_blank");
    go_to_issue_btn.setAttribute("type", "button");
    go_to_issue_btn.setAttribute("id", "goToIssue");
    go_to_issue_btn.setAttribute("style", "margin-right: 10px;");
    go_to_issue_btn.setAttribute("class", "btn btn-light btn-sm active");
    var go_to_issue_textnode = document.createElement("span");
    go_to_issue_textnode.setAttribute("class", "align-middle");
    go_to_issue_textnode.append(document.createTextNode("Go to issue"));
    go_to_issue_btn.appendChild(go_to_issue_textnode);

    go_to_issue_btn_div.appendChild(go_to_issue_btn)
    go_to_issue_btn_col.appendChild(go_to_issue_btn_div);

    last_row.appendChild(prog_langs_col);
    last_row.appendChild(go_to_issue_btn_col);
    
    list_group_item.appendChild(heading_div);
    list_group_item.appendChild(time_of_issue);
    list_group_item.appendChild(labels_row);
    list_group_item.appendChild(paragraph_repo_name);
    list_group_item.appendChild(owner_login_info);
    list_group_item.append(assignees);
    list_group_item.append(last_row);

    return list_group_item;
}