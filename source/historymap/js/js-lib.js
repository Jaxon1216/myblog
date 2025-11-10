var poemDict = {};
var authorDict = {};
var excelMenuZh = {
    undo: "撤消",
    redo: "重做",
    textColor: "字体颜色",
    backgroundColor: "背景色",
    bold: "加粗",
    italic: "斜体",

    lockCell: "锁定",
    unlockCell: "解锁",

    format: "格式",
    edit: "编辑",
    clear: "清除",
    clearValue: "清除内容",
    clearStyles: "清除样式",
    clearAll: "全部清除",

    insert: "插入",
    columns: "栏目",
    rows: "行数",
    addColumn: "增加栏目",
    removeColumn: "删除栏目",
    addRow: "增加行数",
    removeRow: "删除行数",

    configuration: "配置",
    underline: "下划线",
    align: "对齐",
    left: "左对齐",
    right: "右对齐",
    center: "居中",

    help: "帮助",

    common: "通用",
    number: "数字",
    currency: "货币",
    percent: "百分比",

    downloadAs: "下载...",
    importAs: "导入...",

    import: "导入",
    export: "导出",
    file: "文件",
    numberFormat: "数字格式"
};

function ToggleMenu(bars, menu) {
    $('#' + menu).toggle("fast");
    $('#' + bars).toggleClass("rotate90");
}

function GoToPage(url) {
    window.location = url;
}

function GetURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function GetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return null;
}

function SetLongLifeCookie(name, value) {
    var now = new Date();
    document.cookie = name + "=" + value + "; max-age=" + 3600*24*365;
}

function TrimPunctuation(content) {
    return content.replace(/[，。？！：；]$/, "");
}

function IsSpecifiedTypeOnly(links, key, types) {
    var isSingleValueType = true;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!types.includes(link.LabelType) || link.Value.length != key.length) {
            isSingleValueType = false;
            break;
        }
    }

    return isSingleValueType;
}

function SetPreviousIndexToCookie(name, data) {
    var value = data.Date + data.Index;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 1);

    document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
}

function AppendPreviousIndexIndex(url, cookieName) {
    var previousIndex = GetCookie(cookieName);
    if (previousIndex) {
        url += "&previousIndex=" + previousIndex;
    }

    return url;
}

function Toggle(panel) {
    $('#' + panel).toggle();
}

function JumpToPage(queryFunc, panel, columnName, value) {
    var index = $("#" + panel + "Options").val();
    queryFunc(index, panel, columnName, value);
}

function ShowPoemComment(id, panel) {
    if (!panel && $("#poem_comment_" + id).length > 0) {
        panel = "poem_comment_" + id + "_inner";
        if ($('#' + panel).length > 0) {
            $('#' + panel).toggle();
            return;
        }

        html = "<div id='" + panel + "' class='poemNote' style='position: relative;'></div>";
        $("#poem_comment_" + id).append(html);
    }

    QueryPoemWithCacheSupport(id, panel, InternalShowPoemComment);
}

function ShowCiTuneNote(id, panel, name) {
    var url = "/CiTune/" + name + "/" + id + "?view=CiTuneView";
    ShowInlineComponentView(url, id, "ciTune", panel);
}

function ShowWriting(id, panel) {
    var url = "/Writing/" + id + "?view=PoemView";
    ShowInlineComponentView(url, id, "writing", panel);
}

function ShowKnowledgeGraph(id, type, resourceType, resourcePath, pageNo, panelId, showFunc) {
    var baseUrl = "/Api/Label/" + type + "/" + id + "?resourceType=" + resourceType + "&resourcePath=" + resourcePath;
    var url = baseUrl + "&pageNo=" + pageNo

    QueryWithoutCacheSupport(url, panelId, function (data, panelId) {
        var html = showFunc(data, baseUrl, panelId);
        if (!html) {
            $('#' + panelId).html("没找到");
        }
        else {
            $('#' + panelId).html(html);
        }
    });
}

function ShowYearRangeNote(year, panel, name) {
    var url = "/Calendar/" + year + "?view=EmpireChartView";

    ShowInlineComponentView(url, year, "calendar", panel);
}

function ShowYearMonthDateNote(date, panel, empireYearId) {
    var url;
    if (empireYearId) {
        url = "/Calendar/EmpireYear/" + empireYearId + "/" + date;
    }
    else {
        url = "/Calendar/" + date;
    }

    url += "?view=LinksSummaryView";

    ShowInlineComponentView(url, date, "calendar", panel);
}

function ShowYearNote(year, panel, empireYearId) {
    var url;
    if (empireYearId) {
        url = "/Calendar/EmpireYear/" + empireYearId + "/" + year;
    }
    else {
        url = "/Calendar/" + year;
    }

    url += "?view=YearGraphView";

    ShowInlineComponentView(url, year, "calendar", panel);
}

function CreateDictFromMetaProperty(properties) {
    var dict = {};
    $.each(properties, function (index, pair) {
        dict[pair.Key] = pair.Value;
    });

    return dict;
}

function ShowEmpireYearNote(id, panel, name) {
    var url = "/Calendar/EmpireYear/" + id + "?view=EmpireChartView";
    ShowInlineComponentView(url, id, "Calendar", panel);
}

function ShowMonthDayNote(id, panel, name) {
    var url = "/Calendar/" + id + "?view=DateGraphView";

    ShowInlineComponentView(url, id, "calendar", panel);
}

function ShowPlanNote(id, panel, name) {
    var url = "/Category/Plant/" + id + "?view=CategoryLabelingView";

    ShowInlineComponentView(url, id, "plant", panel);
}

function ShowFlowerNote(id, panel, name) {
    var url = "/Category/Flower/" + id + "?view=CategoryLabelingView";

    ShowInlineComponentView(url, id, "flower", panel);
}

function ShowFruitNote(id, panel, name) {
    var url = "/Category/Fruit/" + id + "?view=CategoryLabelingView";

    ShowInlineComponentView(url, id, "fruit", panel);
}

function ShowAliasNote(id, panel, name) {
    var url = "/People/Alias/" + id + "?view=LinksSummaryView";
    ShowInlineComponentView(url, id, "alias", panel);
}

function ShowRegions(id, panel, name) {
    var url = "/Map/Region/" + id + "?view=RegionGraphView";
    if (name) {
        url += "&key=" + name;
    }

    ShowInlineComponentView(url, id, "region", panel);
}

function ShowSceneries(id, panel, name) {
    var url = "/Map/" + (id.indexOf('/') > 0 ? id : "Scenery/" + id) + "?view=SceneryGraphView";

    ShowInlineComponentView(url, id, "scenery", panel);
}

function ShowPeopleTitleNote(id, panel, name) {
    var url = "/Category/Title/" + id + "?view=CategoryLabelingView";

    ShowInlineComponentView(url, id, "peopleTitle", panel);
}

function ShowAllusionComment(id, panel) {
    var url = "/Glossary/典故/" + id + "?view=AllusionView";
    ShowInlineComponentView(url, id, "allusion", panel);
}

function ShowAllusionQuoteInfo(id, name, panel) {
    var label = '{"Type":"Allusion","Identity":"' + id + '", "Description":"' + name + '"}';
    var url = '/api/Writing/HasLabel?label=' + label;
    var excelPanelId = "Excel_" + panel;
    ShowLoading(excelPanelId);
    $.getJSON(url).done(function (data) {
        var cells = ConvertWritingLinksToExcel(data.Links);
        CreateExcelPanel(cells, excelPanelId, 7, "A1:G1");
    }).fail(function () {
        CloseLoading(excelPanelId);
    });

    url = "/Writing/Statistic?label=" + label;
    ShowHtmlPanel(url, "Figure_" + panel);

    url = "/Graph/MentionedWay/Allusion/" + id;
    ShowHtmlPanel(url, "Mentioned_" + panel);
}

function ShowHtmlPanel(url, panel) {
    ShowLoading(panel);
    GetHtml(url, function (html) {
        $('#' + panel).html(html);
    },
    function () {
        CloseLoading(panel);
    });
}

function ShowPoemAuthorProfile(id, dynasty, author, panel) {
    if (id == 0) {
        ShowInlineNote(id, panel, function (commentPanel) {
            var url = "/Writing/" + dynasty + "/" + author;
            var html = author + "，" + dynasty + "人。<a href='" + url + "'>查看已收録作品</a>。";
            $('#' + commentPanel).html(html);
            AddCloseLink(commentPanel);
        });
    }
    else {
        var url = "/People/" + id + "?view=PersonView";
        ShowInlineComponentView(url, id, "people", panel);
    }
}

function ShowInlineNote(id, panel, func) {
    var idString = id + "";
    var commentPanel = panel + "_comment" + "_" + encodeURI(idString.replace(/[/,]/g, "_")).replace(/%/g, "");

    var target = $('#' + commentPanel);
    if (target.length != 0) {
        if (target.attr('ajaxStatus') == "retryable") {
            target.attr('ajaxStatus', '');
            func(commentPanel);
        }
        else {
            target.show();
        }
    }
    else {
        CreateInlineCommentPanel(panel, commentPanel);

        func(commentPanel);
    }
}

function ShowAuthorsProfile(ids, panel, name) {
    var url = "/People/" + encodeURI(ids).replace("/", "%2F") + "?view=PersonsView";
    ShowInlineComponentView(url, ids, "persons", panel);
}

function ShowAuthorProfile(id, panel, name) {
    var linkText = name ? name : GetQueryKey(this.event);

    if (id == parseInt(id, 10)) {
        var url = "/People/" + id + "?view=PersonView";
        ShowInlineComponentView(url, id, "people", panel);
    }
    else {
        ShowInlineNote(id, panel, function (commentPanel) {
            $('#' + commentPanel).html(linkText);
            AddCloseLink(commentPanel);
        });
    }
}

function ShowWordNote(id, panel) {
    var url = "/Glossary/词典/" + id + "?view=WordView";
    ShowInlineComponentView(url, id, "word", panel);
}

function ShowInlineComponentView(url, id, component, panel) {
    var panelSubId = component + encodeURI(id).replace(/[()]/g, "_");
    ShowInlineNote(panelSubId, panel, function (commentPanel) {
        ShowProgress(commentPanel);

        GetHtml(url, function (html) {
                $('#' + commentPanel).html(html);
                AddCloseLink(commentPanel);
            },
            function (data) {
                ShowFailedRequest(data.responseJSON, commentPanel);
            });
    });
}

function ShowCharComment(panel, id, path) {
    return;
    ShowCharOrWordComment(panel, id, path, rCharInfo);
}

function ShowWordComment(panel, id, path) {
    return;
    ShowCharOrWordComment(panel, id, path, rSingleWord);
}

function ShowCharOrWordComment(panel, id, path, parser) {
    var commentPanel = GetCommentPanelFromPath(id, path);

    if ($('#' + commentPanel).length != 0) {
        $('#' + commentPanel).toggle();
    }
    else {
        var parts = path.split('/');
        var clauseIndex = parts[1];
        var index = parts[3];
        CreateInlineCommentPanel(panel, commentPanel);

        QueryPoemWithCacheSupport(id, commentPanel, function (data, commentPanel) {
            var writing = data.Writing;
            var comment = writing.Clauses[clauseIndex].Comments[index];
            var charOrWordInfo = JSON.parse(comment.Content);
            $('#' + commentPanel).html(parser(charOrWordInfo));
            AddCloseLink(commentPanel);
        });
    }
}

function GetCommentPanelFromPath(id, path) {
    return path.replace(/\//g, '_') + '_' + id + "_comment";
}
     
function CreateInlineCommentPanel(panel, commentPanel) {
    $('#' + panel + "_comment").css("display", "block");
    html = "<div id='" + commentPanel + "' class='poemNote' style='position: relative;'></div>";
    $('#' + panel + "_comment").prepend(html);
}

function AddCloseLink(panel) {
    $('#' + panel).append("<button class='btn-close position-absolute top-0 end-0' aria-label='Close' onclick='CloseCard(\"" + panel + "\")'></button>");
}

function InternalShowPoemComment(data, panel) {
    $('#' + panel).css("position", "relative");
    $('#' + panel).html(InternalConvertQuote(data.Writing));

    $('#' + panel).slideDown();
}

function InternalConvertQuote(poem) {
    var html = "";
    var allNoBook = true;

    for (var i = 0; i < poem.Comments.length; i++) {
        if (poem.Comments[i].Book) {
            allNoBook = false;
            break;
        }
    }

    for (var i = 0; i < poem.Comments.length; i++) {
        html += "<div class='card mb-4 mt-3'>";
        html += "<div class='card-header text-secondary'>";
        var quote = poem.Comments[i];
        if (quote.Book) {
            if (quote.Book == "唐诗汇评" && quote.Section == "总评") {
                html += "總評";
            }
            else {
                html += quote.Book;
                if (quote.Section) {
                    html += '·' + quote.Section;
                }
            }
        }
        else if (!allNoBook) {
            html += "以下资料来源未详";
        }
        html += "</div>";
        html += "<div class='card-body'>" + quote.Content + "</div>";
        html += "</div>";
    }

    return html;
}

function QueryPoemWithCacheSupport(id, panel, showFunc) {
    var url = "/Api/Writing/" + id + "?includeLinks=true";
    QueryWithCacheSupport(url, poemDict, id, panel, function (data, panel) {
        showFunc(data, panel);
    });
}

function QueryWithCacheSupport(url, dict, id, panel, showFunc) {
    if (dict[id]) {
        showFunc(dict[id], panel);
        return;
    }

    ShowProgress(panel);

    GetJSON(url,
        function (data) {
            dict[id] = data;
            showFunc(data, panel);
        },
        function () {
            $('#' + panel).html("");
        });
}

function QueryWithoutCacheSupport(url, panel, showFunc) {
    ShowProgress(panel);

    GetJSON(url,
        function (data) {
            showFunc(data, panel);
        },
        function () {
            $('#' + panel).html("");
        });
}

function Highlight(poems, keysArray, startTag, endTag) {
    var start = poems.indexOf(startTag);
    var end = 0;
    var piece;

    while (start >= 0) {
        end = poems.indexOf(endTag, start);
        piece = HighlightPiece(poems.substr(start, end - start), keysArray);
        poems = poems.substr(0, start) + piece + poems.substr(end);
        start = poems.indexOf(startTag, start + piece.length);
    }
    return poems;
}

function HighlightPiece(piece, keys) {
    var pos;

    for (var i = 0; i < keys.length; i++) {
        pos = piece.lastIndexOf(keys[i]);
        if (pos >= 0) {
            var lastGreater = piece.lastIndexOf('>', pos);
            var lastQuote = piece.lastIndexOf('=', pos);
            if (lastQuote < 0 || lastQuote < lastGreater) {
                piece = piece.substr(0, pos) + '<span class="highlighted">' + keys[i] + '</span>' + piece.substr(pos + keys[i].length);
            }
        }
    }

    return piece;
}

// common function
function QueryData(url, key, panel, showFunc) {
    ShowProgress(panel);
    GetJSON(url,
        function (data) {
            $('#' + panel).html("");
            if (data) {
                showFunc(key, data, panel);
            }
        },
        function () {
            $('#' + panel).html("");
        });
}

function ScrollTo(anchor) {
    $('html, body').animate({
        scrollTop: $("#" + anchor).offset().top
    }, 500);
}

function ShowProgress(panel) {
    $('#' + panel).html("<span class='inlineComment2'>数据查询中……</span>");
}

function ShowTones(id, panel) {
    var poemTonesUrl = "/Writing/" + id + "/Tones";

    ShowProgress(panel);

    GetHtml(poemTonesUrl, function (html) {
        $('#' + panel).html(html);
    },
    function (data) {
        ShowFailedRequest(data.responseJSON, panel);
    });
}

function ShowSameRhymePoems(id, panel) {
    var url = "/api/Writing/SameRhymes/" + id;

    ShowProgress(panel);

    GetJSON(url, function (data) {
        $('#' + panel).html(CreateSameRhymesPoemPanel(data));
    },
    function (data) {
        ShowFailedRequest(data.responseJSON, panel);
    });
}

function ShowFailedRequest(data, panel) {
    var text = "数据查询失败，请稍后重试。";
    if (data) {
        text = data.Value ? data.Value : data;
    }

    var html = '<div class="alert alert-info modal-header" role="alert">' + text + '</div>';
    $('#' + panel).html(html);
    $('#' + panel).attr('ajaxStatus', 'retryable');
}

function CreateSameRhymesPoemPanel(data) {
    var html = "<p class='text-secondary'>共找到 " + data.length + " 首</p>";
    $.each(data, function (index, sc) {
        html += "<div class='list-group py-2' id='poem" + sc.Id + "'>";
        html += "<a class='list-group-item list-group-item-action' href='javascript: InternalDisplayPoem(" + sc.Id + ");'>" + sc.Title + "<span class='text-secondary ms-3'>" + sc.Dynasty + " · </span><span class='text-dark'>" + sc.Author + "</span>" + "</a>";
        html += "</div>";
    });

    return html;
}

function InternalDisplayPoem(poemId, panel) {
    var poemUrl = "/Writing/" + poemId + "?view=PoemView";
    GetHtml(poemUrl, function (html) {
        if (panel) {
            $('#' + panel).html(html);
        }
        else {
            $('#poem' + poemId).html(html);
            $('#poem' + poemId).addClass("ms-2");
        }
    },
    function (data) {
        if (!panel) {
            ShowFailedRequest(data.responseJSON, 'poem' + poemId);
        }
        else {
            ShowFailedRequest(data.responseJSON, panel);
        }
    });
}

function ShowSimilarClauses(id, panel) {
    var url = "/Api/Writing/SimilarClauses/" + id;

    ShowProgress(panel);

    GetJSON(url, function (data) {
        $('#' + panel).html(CreateSimilarClausePanel(data));
    },
    function () {
        $('#' + panel).html("");
    });
}

function CreateSimilarClausePanel(data) {
    var html = "";

    if (data && data.length > 0) {
        $.each(data, function (index, clause) {
            var notFound = true;
            var body = "";
            if (clause && clause.ErrorMessage) {
                body += "<div class='card-body text-secondary'>" + clause.ErrorMessage + "</div>";
                notFound = false;
            }

            if (clause && clause.SimilarClauses && clause.SimilarClauses.length > 0) {
                body += "<div class='card-body'>";
                body += "<ul class='list-unstyled lh-lg'>"
                $.each(clause.SimilarClauses, function (index1, sc) {
                    body += "<li>";
                    body += TrimPunctuation(sc.Content) + "<small class='text-secondary mx-3'> " + sc.Dynasty + "·" + sc.Author + " </small><a class='small' href='/Writing/" + sc.Id + "' target='_blank'>" + sc.Title + "</a>";
                    body += "</li>";
                });
                body += "</ul>";
                body += "</div>";
                notFound = false;
            }

            if (notFound) {
                body += "<div class='card-body text-secondary'>没找到相似的句子</div>";
            }

            html += "<div class='card mb-4 mt-3 text-nowrap' style='overflow-x: hidden;'>";

            if (clause && clause.OriginalClause) {
                var textClass = notFound ? "text-muted" : "";
                html += "<div class='card-header " + textClass + "'>" + TrimPunctuation(clause.OriginalClause) + "</div>";
            }

            html += body;

            html += "</div>";
        });
    }

    return html;
}

function ShowReference(poemId, panel) {
    QueryKanripoLinks(poemId, 0, panel);
}

function QueryKanripoLinks(poemId, pageNo, panel) {
    if (!pageNo) {
        pageNo = 0;
    }

    ShowProgress(panel);

    var kanripoLinksUrl = "/Api/Writing/" + poemId + "/BookLinks?pageNo=" + pageNo;
    GetJSON(kanripoLinksUrl,
        function (data) {
            $('#' + panel).html(CreateKanripoLinksPanel(data, panel));
        },
        function (data) {
            ShowFailedRequest(data.responseJSON, panel);
        });
}

function CreateKanripoLinksPanel(data, panel) {
    var html = "";
    if (data.Froms) {
        html += "<p><span class='text-success'>録入來源：</span>" + data.Froms.join("、") + "</p>";
    }

    if (data.Links) {
        var pagination = "<div class='charPagination' style='margin: 1em 0; border-bottom: 1px solid lightgray;'>" + CreatePagination(data, panel) + "</div>";
        html += pagination;

        html += CreateKanripoLinksHtml(data.Links);

        html += pagination;
    }

    return html;
}

function CreateKanripoLinksHtml(links) {
    var html = "";
    $.each(links, function (index, link) {
        var pageNo = null;
        if (link.StartPage) {
            pageNo = link.StartPage;
        }

        if (link.EndPage) {
            pageNo += " - " + link.EndPage;
        }

        var url = "/Book/" + link.VolumeId;

        if (pageNo) {
            var volumeIndex = link.VolumeId.split('_')[1].replace(/^0+/, "");
            if (volumeIndex.length == 0) {
                volumeIndex = "0";
            }

            url += "#page_" + volumeIndex + "-" + link.StartPage;
        }

        html += '<div class="card mb-4">';
        html += '<div class="card-header">';
        html += "<a href='" + url + "' target='_blank'>《" + link.Book + "》" + link.Volume;
        if (pageNo) {
            html += "<small class='text-secondary ms-2'>(第 " + pageNo + " 頁)</small>";
        }

        html += "</a>";
        html += "</div>"

        html += '<div class="card-body">';
        html += ShowKanripoPageContent(link);
        html += "</div>"
        html += "</div>";
    });

    return html;
}

function CreatePagination(data, panel) {
    var html = "共找到 " + data.Count + " 首";

    if (data.PageSize > 0 && data.PageSize < data.Count) {
        if (data.PageNo > 0) {
            html += "<a href='javascript: QueryKanripoLinks(" + data.ResourceId + ", " + (data.PageNo - 1) + ", \"" + panel + "\")' style='margin-left: 1em;'>上一页</a>";
        }

        html += "<span style='margin: 0 1em;'>第 " + (data.PageNo + 1) + " 页</span>";

        if ((data.PageNo + 1) * data.PageSize < data.Count) {
            html += "<a href='javascript: QueryKanripoLinks(" + data.ResourceId + ", " + (data.PageNo + 1) + ", \"" + panel + "\")' class='expand'>下一页</a>";
        }
    }

    return html;
}

function ShowKanripoPageContent(page) {
    var cssClass = "";

    if (page.PageImages) {
        cssClass += " pageHasImage";
    }

    var html = "<div class='" + cssClass + "'>";

    if (page.PageImages && page.PageImages.length > 0) {
        if (page.PageImages.length > 1) {
            html += "<div><div style='overflow: auto;margin-bottom: 1rem; display: inline-block;'>";
            $.each(page.PageImages, function (index, url) {
                html += "<img src='" + url + "' class='pageImage' />";
            });
            html += "</div></div>";
        }
        else {
            html += "<img src='" + page.PageImages[0] + "' class='pageImage' />";
        }
    }

    if (page.PreviousText) {
        html += FormatKanripoText(page.PreviousText);

        var isBreakBeforeNeeded = true;
        var match = page.PreviousText.match(/[()（）][^()（）]+$/);
        if (match && (match[0][0] == "（" || match[0][0] == "(")) {
            match = page.MatchedText.match(/[()（）]/);
            if (!match || match == ")" || match == "）") {
                isBreakBeforeNeeded = false;
            }
        }

        if (isBreakBeforeNeeded) {
            html += "<br />";
        }
    }

    html += "<span style='border-bottom: 1px solid lightgreen; padding-bottom: 4px;'>" + FormatKanripoText(page.MatchedText) + "</span>";

    if (page.LaterText) {
        var isBreakAfterNeeded = true;
        var match = page.LaterText.match(/[()（）]/);
        if (match && (match[0] == ")" || match[0] == "）")) {
            match = page.MatchedText.match(/[()（）][^()（）]+$/);
            if (!match || match[0][0] == "(" || match[0][0] == "（") {
                isBreakAfterNeeded = false;
            }
        }

        if (isBreakAfterNeeded) {
            html += "<br />";
        }

        html += FormatKanripoText(page.LaterText);
    }

    html += "</div>";
    return html;
}

function FormatKanripoText(text) {
    text = text.replace(/<pb:[^>]+>/g, "");
    text = text.replace(/#[\s0-9a-zA-Z:;.]+/g, "");
    text = text.replace(/[)）]\s*[（(]/g, "");
    text = text.replace(/^[^()]+\)/g, "<span class='kanripoComment'>$&</span>");
    text = text.replace(/\([^)]+\)/g, "<span class='kanripoComment'>$&</span>");
    text = text.replace(/\([^()]+$/g, "<span class='kanripoComment'>$&</span>");
    text = text.replace(/[\r\n]/g, "<br />");

    return text;
}

function CloseCard(cardId) {
    $('#' + cardId).fadeOut();
}

function GetQueryKey(e) {
    if (e && e.target && e.target.innerText) {
        return e.target.innerText;
    }

    return "";
}

//// New function from here
function ShowReferedData(func, label, id, panel) {
    $('#referedDataLabel').text(label);
    func(id, panel);
}

function grDictWord(id, panel) {
    var url = "/Glossary/词典/" + id + "?view=WordView";
    grComponentView(url, panel);
}

function grWord(category, id, panel) {
    var url = "/Glossary/" + category + "/" + id + "?view=WordView";
    grComponentView(url, panel);
}

function grAllusion(id, panel) {
    var url = "/Glossary/典故/" + id + "?view=AllusionView";
    grComponentView(url, panel);
}

function grComponentView(url, panel) {
    ShowProgress(panel);
    GetHtml(url, function (html) {
        $('#' + panel).html(html);
        },
        function (data) {
            ShowFailedRequest(data.responseJSON, panel);
        });
}

function grTuneFormat(tuneId, formatId, highlightStart, highlightLength, panel) {
    var url = "/Api/CiTune/" + tuneId + "/" + formatId;
    if (highlightLength) {
        url += "?highlightStart=" + highlightStart + "&highlightLength=" + highlightLength;
    }

    ShowProgress(panel);

    GetJSON(url, function (data) {
        var html = rTuneFormat(data.Name, data.Id, data.Format);
        $('#' + panel).html(html);
    });
}

function grMultiSpellCharWord(id, panel) {
    var url = "/Rhyme/" + id[0] + "/ToneInWord/" + id.substr(1);
    grComponentView(url, panel);
}

// Basic method to access data api
function GetHtml(requestUrl, doneFunc, failFunc) {
    GetData(requestUrl, doneFunc, failFunc, "html");
}

function GetJSON(requestUrl, doneFunc, failFunc) {
    GetData(requestUrl, doneFunc, failFunc, "json");
}

function GetData(requestUrl, doneFunc, failFunc, dataType) {
    var headers = null;
    var lang = GetCookie("lang");
    if (lang == "t") {
        lang = "zh-TW";
    }
    else if (lang == "s") {
        lang = "zh-CN";
    }
    else {
        lang = navigator.language || navigator.userLanguage;
    }

    headers = {
        "Accept-Language": lang
    };

    if (GetCookie('uuid')) {
        headers["X-UUID"] = GetCookie('uuid');
    }
    if (GetCookie('token')) {
        headers['X-TOKEN'] = GetCookie('token');
    }
    if (GetCookie('jt')) {
        headers['Authorization'] = 'Bearer ' + GetCookie('jt')
    }

    $.ajax({
        dataType: dataType,
        url: requestUrl,
        crossDomain: true,
        headers: headers,
        data: null,
        success: doneFunc,
        error: failFunc
    });
}

function PostJSON(requestUrl, postData, doneFunc, failFunc) {
    var headers = null;
    var lang = GetCookie("lang");
    if (lang == "t") {
        lang = "zh-TW";
    }
    else if (lang == "s") {
        lang = "zh-CN";
    }
    else {
        lang = navigator.language || navigator.userLanguage;
    }

    headers = {
        "Accept-Language": lang,
        "Content-Type": "application/json"
    };

    if (GetCookie('uuid')) {
        headers["X-UUID"] = GetCookie('uuid');
    }
    if (GetCookie('token')) {
        headers['X-TOKEN'] = GetCookie('token');
    }
    if (GetCookie('jt')) {
        headers['Authorization'] = 'Bearer ' + GetCookie('jt')
    }

    $.ajax({
        crossDomain: true,
        url: requestUrl,
        type: "POST",
        headers: headers,
        data: JSON.stringify(postData),
        success: doneFunc,
        error: failFunc
    });
}

// Compose HTML based on data
function rTuneFormat(tuneName, tuneId, tuneFormat) {
    var name = tuneName;
    if (tuneFormat.FormatIndex > 0) {
        name = "格" + ConvertToChineseNumber(tuneFormat.FormatIndex + 1);
    }

    var formatId = "formatIndex_" + tuneId + "_" + tuneFormat.FormatIndex;
    var html = '<div class="card text-reading mb-4">';
    html += '<div class="card-header"><a class="link-dark" href="/CiTune/' + tuneName + '/' + tuneId + '#' + formatId + '"/>' + name + '</span><span class="text-secondary mx-3">' + tuneFormat.Desc + '</a>';
    if (tuneFormat.SampleAuthor) {
        html += '<span class="text-success">' + tuneFormat.SampleAuthor + '</span>';
    }

    html += '</div>';
    html += '<div class="card-body card-text">';
    html += tuneFormat.FormatHtml;
    html += '</div>';
    if (tuneFormat.Comment) {
        html += '<div class="card-footer">' + tuneFormat.Comment + '</div>';
    }
    html += '</div>';

    return html;
}

function rWord(word, referedWords) {
    var html = rSingleWord(word);
    if (referedWords) {
        $.each(referedWords, function (index, referedWord) {
            html += rSingleWord(referedWord);
        });
    }
    return html;
}

function rSingleWord(word) {
    var html = "";
    html += '<div class="card my-3">';
    html += '<div class="card-header">';
    if (word.Source) {
        html += '<span class="text-secondary me-2">' + word.Source + '</span>';
    }
    html += '<span class="text-success">' + word.Text;
    if (word.Traditional && word.Text != word.Traditional) {
        html += '（' + word.Traditional + '）';
    }
    html += '</span>';
    if (word.Spells && !word.ContainsUnknownSpell) {
        html += '<small class="text-secondary"><span class="mx-2">拼音</span>' + word.Spells + '</small>';
    }
    html += '</div>';
    html += '<div class="card-body">';
    html += '<ul class="list-unstyled lh-lg">';
    $.each(word.Explains, function (index, explain) {
        html += '<li>' + explain + '</li>';
    });
    html += '</ul>';
    html += '</div>';
    if (word.Categories) {
        html += '<div class="card-footer">';
        html += '<span class="text-muted me-3">分類</span>';
        $.each(word.Categories, function (index, category) {
            html += '<a class="link-dark mx-3" href="/Glossary/分類/' + category + '">' + category + '</a>';
        });
        html += '</div>';
    }
    html += '</div>';

    return html;
}

function rCharInfo(charInfo) {
    var html = "";
    html += '<div class="card my-3">';
    html += '<div class="card-header"><span class="text-success">' + charInfo.OriginalChar + '</span></div>';
    html += '<div class="card-body">';

    $.each(charInfo.Comments, function (index, comment) {
        html += "<p><span class='text-secondary'>《" + comment.Origin + "》</span>" + comment.Character + "</p>";
        $.each(comment.Explains, function (index, explain) {
            if (explain.Type == "Spell") {
                html += "<span class='label'>拼音</span>：" + explain.Content;
            }
        });
        html += "<ul>"
        $.each(comment.Explains, function (index, explain) {
            if (explain.Type == "Spell") {
                // do nothing
            }
            else if (explain.Type == "KXSpell") {
                html += "<li class='spell'>" + explain.Content + "</li>";
            }
            else if (explain.Type == "Example") {
                html += "<li class='example'>" + explain.Content + "</li>";
            }
            else {
                html += "<li>" + explain.Content + "</li>";
            }
        });
        html += "</ul>";
    });
    html += '</div>';

    html += '</div>';

    return html;
}

function CreateWritingExcel(data, panel) {
    var cells = ConvertWritingToExcel(data.Writings);
    CreateExcelPanel(cells, panel, 11, "A1:K1");
}

function ExportReference(poemId, panel) {
    var referencePanel = panel + "_reference";
    if ($('#' + referencePanel).length == 0) {
        $('#' + panel).prepend("<div id='" + referencePanel + "'></div>");
    }

    ShowLoading(referencePanel);

    var url = "/Api/Writing/" + poemId + "/BookLinks?pageNo=-1";
    GetJSON(url,
        function (data) {
            var cells = ConvertKanripoLinksToExcel(data);
            CreateExcelPanel(cells, referencePanel, 7, "A1:G1");
        },
        function (data) {
            ShowFailedRequest(data.responseJSON, referencePanel);
        });
}

function ExportSimilarClauses(poemId, panel) {
    var similarClausesPanel = panel + "_similarClauses";
    if ($('#' + similarClausesPanel).length == 0) {
        $('#' + panel).prepend("<div id='" + similarClausesPanel + "'></div>");
    }

    ShowLoading(similarClausesPanel);

    var url = "/Api/Writing/SimilarClauses/" + poemId;
    GetJSON(url,
        function (data) {
            var cells = ConvertSimilarClausesToExcel(data);
            CreateExcelPanel(cells, similarClausesPanel, 7, "A1:G1");
        },
        function (data) {
            ShowFailedRequest(data.responseJSON, similarClausesPanel);
        });
}

function CreateBaseActivityExcel(data, panel) {
    var cells = ConvertTableToExcel(data.OfficialDetails);
    CreateExcelPanel(cells, panel, data.OfficialDetails[0].length, "A1:" + getColumeIndex(data.OfficialDetails[0].length - 1) + "1");
}

function ConvertTableToExcel(data) {
    var cells = new Array();
    $.each(data, function (index, row) {
        $.each(row, function (innerIndex, cell) {
            cells.push({ cell: getColumeIndex(innerIndex) + (index + 1), value: cell });
        });
    });

    return cells;
}

function getColumeIndex(index) {
    var prefix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var c = prefix[index % prefix.length];
    if (index >= prefix.length) {
        c = prefix[index / prefix.length] + c;
    }
    return c;
}

function ConvertMentionshipToExcel(data) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "人物Id" });
    cells.push({ cell: "B1", value: "人名" });
    cells.push({ cell: "C1", value: '朝代' });
    cells.push({ cell: "D1", value: "被他人诗中提及次数" });

    var row = 2;
    $.each(data.nodes, function (index, n) {
        cells.push({ cell: "A" + row, value: n.id });
        cells.push({ cell: "B" + row, value: n.name });
        cells.push({ cell: "C" + row, value: data.categories[n.category].name });
        cells.push({ cell: "D" + row, value: n.value });
        row++;
    });

    return cells;
}

function CreateExcelPanel(cells, panel, colsCount, highlightCells) {
    $('#' + panel).html('');
    $('#' + panel).css("height", "40vh");
    dhx.i18n.setLocale("spreadsheet", excelMenuZh);
    var spreadsheet = new dhx.Spreadsheet(panel, {
        colsCount: colsCount,
        rowsCount: cells.length / colsCount,
        toolbarBlocks: ["default", "file"],
        formats: [{ name: "Number", id: "number", mask: "#0", example: "2702.31" }]
    });
    spreadsheet.parse(cells);
    spreadsheet.setStyle(highlightCells, { background: "#6ebfe3", color: "white" });
}

function ConvertSimilarClausesToExcel(data) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "原句" });
    cells.push({ cell: "B1", value: "相似句" });
    cells.push({ cell: "C1", value: '题目' });
    cells.push({ cell: "D1", value: "朝代" });
    cells.push({ cell: "E1", value: '作者' });
    cells.push({ cell: "F1", value: "作品Id" });
    cells.push({ cell: "G1", value: "第几句" });
    var row = 2;
    $.each(data, function (index, item) {
        cells.push({ cell: "A" + row, value: item.OriginalClause });
        $.each(item.SimilarClauses, function (index, sc) {
            if (index > 0) {
                cells.push({ cell: "A" + row, value: "" });
            }
            cells.push({ cell: "B" + row, value: sc.Content });
            cells.push({ cell: "C" + row, value: sc.Title });
            cells.push({ cell: "D" + row, value: sc.Dynasty });
            cells.push({ cell: "E" + row, value: sc.Author });
            cells.push({ cell: "F" + row, value: sc.Id });
            cells.push({ cell: "G" + row, value: sc.Index + 1 });
            row++;
        });
    });

    return cells;
}

function ConvertKanripoLinksToExcel(data) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "书名" });
    cells.push({ cell: "B1", value: "卷次" });
    cells.push({ cell: "C1", value: '卷次Id' });
    cells.push({ cell: "D1", value: "前文" });
    cells.push({ cell: "E1", value: '匹配内容' });
    cells.push({ cell: "F1", value: "后文" });
    cells.push({ cell: "G1", value: "影像图片" });
    var row = 2;
    $.each(data.Links, function (index, link) {
        cells.push({ cell: "A" + row, value: link.Book });
        cells.push({ cell: "B" + row, value: link.Volume });
        cells.push({ cell: "C" + row, value: link.VolumeId });
        var previousText = link.PreviousText.replace(/<pb:[^>]+>/g, "");
        cells.push({ cell: "D" + row, value: previousText });
        var matchedText = link.MatchedText.replace(/<pb:[^>]+>/g, "");
        cells.push({ cell: "E" + row, value: matchedText });
        var laterText = link.LaterText.replace(/<pb:[^>]+>/g, "");
        cells.push({ cell: "F" + row, value: laterText });
        var images = "";
        if (link.PageImages) {
            images = link.PageImages.join(" ");
        }
        cells.push({ cell: "G" + row, value: images });
        row++;
    });

    return cells;
}

function ConvertWritingToExcel(data) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "作品Id" });
    cells.push({ cell: "B1", value: "作者Id" });
    cells.push({ cell: "C1", value: '作者' });
    cells.push({ cell: "D1", value: "朝代" });
    cells.push({ cell: "E1", value: '創作時間' });
    cells.push({ cell: "F1", value: "體裁" });
    cells.push({ cell: "G1", value: "标題" });
    cells.push({ cell: "H1", value: "序" });
    cells.push({ cell: "I1", value: "内容" });
    cells.push({ cell: "J1", value: "跋" });
    cells.push({ cell: "K1", value: "出處" });

    var row = 2;
    $.each(data, function (index, w) {
        var subject = ConvertPoemClause(w.Title);
        if (w.GroupIndex) {
            subject += " 其" + ConvertToChineseNumber(w.GroupIndex);
        }
        if (w.SubTitle) {
            subject += " " + ConvertPoemClause(w.SubTitle);
        }
        var content = "";
        if (w.Clauses) {
            $.each(w.Clauses, function (cIndex, clause) {
                content += ConvertPoemClause(clause);
                if (clause.BreakAfter) {
                    content += "　　";
                }
            });
        }
        var from = ""
        if (w.Froms) {
            from = w.Froms.join("，");
        }
        var type = w.Type;
        if (type == "古風") {
            type = "古體";
        } else if (type == "古风") {
            type = "古体";
        }
        cells.push({ cell: "A" + row, value: w.Id });
        cells.push({ cell: "B" + row, value: w.AuthorId });
        cells.push({ cell: "C" + row, value: w.Author });
        cells.push({ cell: "D" + row, value: w.Dynasty });
        cells.push({ cell: "E" + row, value: w.AuthorDate });
        cells.push({ cell: "F" + row, value: type });
        cells.push({ cell: "G" + row, value: subject });
        cells.push({ cell: "H" + row, value: w.Preface });
        cells.push({ cell: "I" + row, value: content });
        cells.push({ cell: "J" + row, value: w.Note });
        cells.push({ cell: "K" + row, value: from });
        row++;
    });

    return cells;
}

function ConvertPoemClause(clause) {
    var content = clause.Content;
    if (clause.Comments) {
        for (var i = clause.Comments.length - 1; i >= 0; i--) {
            var comment = clause.Comments[i];
            if (comment.Type != "Text") {
                continue;
            }
            var allPunctuation = true;
            for (var j = 0; j < comment.Content.length && allPunctuation; j++) {
                if ("《》“”'‘’\"、【】（）()「」".indexOf(comment.Content[j]) < 0) {
                    allPunctuation = false;
                }
            }

            if (allPunctuation) {
                content = content.substr(0, comment.Index) + comment.Content + content.substr(comment.Index);
            }
            else {
                content = content.substr(0, comment.Index) + '（' + comment.Content + '）' + content.substr(comment.Index);
            }
        }
    }
    return content;
}

///////////////////////////// Map related  ///////////////////////////////
var markerIcons = ["marker.green", "marker.azure", "marker.red", "marker.azure1", "marker.green1", "marker.red1", "marker.blue"];
var flagIcon = "flag";
var starIcon = "star";
var lineColors = ["CornflowerBlue", "purple", "green", "gray", "orange", "darkred", "olive"];

function ShowRegionsInPoem(id, panel) {
    ShowRegionsInResource("Writing", id, panel)
}

function ShowRegionsInPeople(id, panel) {
    ShowRegionsInResource("People", id, panel)
}

function ShowPersonIntroduction(id, panel) {
    var url = "/People/Introduction/" + id;
    grComponentView(url, panel);
}

function ShowMentionedWays(id, panel) {
    var url = "/People/MentionedWays/" + id;
    grComponentView(url, panel);
}

function ShowRelatedSceneries(id, panel) {
    var url = "/Map/Scenery/RelatedPeople/" + id + "?view=PeopleRelatedSceneriesView";
    grComponentView(url, panel);
}

function ShowPersonComment(id, panel) {
    var url = "/People/Comment/" + id;
    grComponentView(url, panel);
}

function ShowRegionsInResource(resource, id, panel) {
    var url = "/Api/" + resource + "/" + id + "/MapInfo";
    GetJSON(url, function (data) {
        var mapId = "map" + panel;
        $('#' + panel).append("<div id='" + mapId + "' style='min-height: 50vh;'></div>");
        ShowRegionInfo(data, mapId);
    });
}

function ShowRegionInfo(regionInfo, panel, modernLayers) {
    var map = PrepareMap(panel, null, modernLayers);

    $.each(regionInfo.Markers, function (index, marker) {
        ShowMarker(map, marker);
    });

    var zoom = regionInfo.ZoomLevel - 1;
    if (zoom < 5) {
        zoom = 5;
    }
    else if (zoom >= 14) {
        zoom--;
    }

    map.setZoomAndCenter(zoom, [regionInfo.Center.Longitude, regionInfo.Center.Latitude]);

    return map;
}

function PrepareMap(panel, tileName, modernLayers, zooms) {
    if (!zooms) {
        zooms = [5, 11];
    }

    var map = new AMap.Map(panel, {
        resizeEnable: true,
        zoom: 9,
        zooms: zooms,
        center: [120.586303, 31.341323],
        mapStyle: "amap://styles/whitesmoke"
    });

    if (modernLayers) {
        $.each(map.getLayers(), function (index, layer) {
            if (layer.CLASS_NAME.indexOf("LabelsLayer") > 0) {
                modernLayers.push(layer);
            }
        });
    }

    // var base = new AMap.TileLayer({
    //     getTileUrl: 'https://r.cnkgraph.com/base/[z]/[x]/[y].png',
    //     zooms: zooms,
    //     zIndex: 2
    // });
    map.setLayers([new AMap.TileLayer.Satellite()]);
    // var cities = new AMap.DistrictLayer.Country({
    //     zooms: zooms,
    //     depth: 2,
    //     styles: {
    //         'nation-stroke': '#ff0000',
    //         'province-stroke': '#555',
    //         'city-stroke': '#aaa',
    //         fill: ''
    //     }
    // });

    // if (tileName == "district") {
    //     map.addLayer(base);
    //     map.addLayer(cities);
    // }
    // else if (tileName == "satellite") {
    //     map.setLayers([new AMap.TileLayer.Satellite()]);
    // }
    // else if (tileName) {
    //     var tile = new AMap.TileLayer({
    //         getTileUrl: 'https://t.cnkgraph.com/' + tileName + '/[z]/[x]/[y].png',
    //         zooms: zooms,
    //         zIndex: 4
    //     });
    //     map.setLayers([base, tile]);
    // }
    // else {
    //     map.setLayers([base, cities]);
    // }

    AMap.plugin(['AMap.ToolBar'], function () {
        map.addControl(new AMap.ToolBar({ position: 'RT'}));
    });

    return map;
}

function GetOrCreateOLLayer(map, id) {
    var layer = map.getLayers().find(e => e.get("id") == id);
    if (!layer) {
        
    }
}

function ShowOLMarker(map, point, icon, markerOffset) {
    if (point.Invisible) {
        return null;
    }

    if (!icon) {
        icon = markerIcons[0];
    }

    if (point.Logo) {
        icon = point.Logo;
    }

    var iconUrl = './map/' + icon + ".png";

    var marker = new ol.Feature({
        geometry: CreateOLPoint(point.Longitude, point.Latitude),
        popupHtml: point.Detail ? CreateDetailHtml(point.Title, point.Detail) : null,
    });

    var style = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0],
            src: iconUrl,
            size: [32, 32],
        }),
        text: new ol.style.Text({
            text: point.Title,
            padding: [3, 3, 3, 3],
            offsetY: 42,
            backgroundFill: new ol.style.Fill({
                color: 'LightGoldenRodYellow'
            }),
            backgroundStroke: new ol.style.Stroke({
                color: 'lightgrey'
            }),
        }),
    });

    marker.setStyle([style]);

    var vectorLayer = GetVectorLayer(map);
    vectorLayer.getSource().addFeature(marker);
}

function GetVectorLayer(map) {
    var vectorLayer;
    $.each(map.getLayers().getArray(), function (index, layer) {
        if (layer.get('id') == "vectorLayer") {
            vectorLayer = layer;
        }
    });
    return layer;
}

function CreateOLPoint(long, lat) {
    return new ol.geom.Point([100000 * long, 100000 * lat]);
}

function ClosePopup(map) {
    var panel = map.getTarget();
    var overlays = map.getOverlays().getArray();
    var overlay;
    $.each(overlays, function (index, item) {
        if (item.getElement().id == panel + '-popup') {
            overlay = item;
        }
    });
    overlay.setPosition(undefined);
}

function ShowOLPopup(map, coordinate, html) {
    var panel = map.getTarget();
    $('#' + panel + '-popup-content').html(html);
    var overlays = map.getOverlays().getArray();
    var overlay;
    $.each(overlays, function (index, item) {
        if (item.getElement().id == panel + '-popup') {
            overlay = item;
        }
    });
    overlay.setPosition(coordinate);
}

function PreparePopupPanel(map) {
    var panel = map.getTarget();
    var closerId = panel + '-popup-closer';
    var popupHtml = '<div id="' + panel + '-popup" class="ol-popup"><a href="#" id="' + closerId + '" class="ol-popup-closer"></a><div id="' + panel + '-popup-content"></div></div>';
    $(popupHtml).insertAfter($('#' + panel));
    var closer = document.getElementById(closerId);
    var container = document.getElementById(panel + '-popup');

    var overlay = new ol.Overlay({
        element: container,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    });

    map.addOverlay(overlay);

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
}

function PrepareEvent(map) {
    map.on('click', function (evt) {
        var popupHappened = false;
        evt.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            var popupHtml = feature.get('popupHtml');
            if (popupHtml) {
                var geoMetry = feature.getGeometry();
                var position = geoMetry.getClosestPoint(evt.pixel);
                ShowOLPopup(evt.map, position, popupHtml);
                popupHappened = true;
            }
        },
        {
            layerFilter: function (layer) { return layer.get('id') == 'vectorLayer'; },
            hitTolerance: 10,
        });

        if (!popupHappened) {
            ClosePopup(evt.map);
        }
    });

    var modify = new ol.interaction.Modify({
        hitDetection: vectorLayer,
        source: vectorLayer.getSource(),
    });

    const overlaySource = modify.getOverlay().getSource();
    overlaySource.on(['addfeature', 'removefeature'], function (evt) {
        map.getTargetElement().style.cursor = evt.type === 'addfeature' ? 'pointer' : '';
    });

    map.addInteraction(modify);

}

function ShowMarker(map, point, icon, markerOffset) {
    if (!point.Invisible) {
        if (!icon) {
            icon = markerIcons[0];
        }

        if (point.Logo) {
            icon = point.Logo;
        }

        var iconUrl = './map/' + icon + ".png";
        var iconObj = new AMap.Icon({ image: iconUrl, size: [32, 32] });
        var marker = new AMap.Marker({
            position: [point.Longitude, point.Latitude],
            title: point.Title,
        });

        marker.setIcon(iconObj);

        marker.setLabel({
            offset: CreateOffset(point),
            content: "<div class='markerLabel'>" + point.Title + "</div>"
        });

        if (markerOffset && FindMarkerOnMap(point)) {
            marker.setAnchor("top-right");
            marker.setDraggable(true);
        }
        marker.setMap(map);

        if (point.Detail) {
            var detailHtml = CreateDetailHtml(point.Title, point.Detail);

            marker.on("click", function (e) {
                var infoWindow = CreateInfoWindow(detailHtml, map);
                infoWindow.open(map, e.target.getPosition());
            });
        }
        else if (point.RequestUri) {
            marker.on("click", function (e) {
                PopupDetailWindow(point.RequestUri, map, e.target.getPosition());
            });
        }

        return marker;
    }

    return null;
}

function CreateInfoWindow(html, map) {
    const infoWindow = new AMap.InfoWindow({ 
        content: html, 
        closeWhenClickMap: true, 
        offset: new AMap.Pixel(0, -30),
        autoMove: true,
        anchor: 'bottom-center'
    });
    infoWindow.on('mouseover', function() {
      map.setStatus({
        zoomEnable: false,
      })
    });
    infoWindow.on('mouseout', function() {
      map.setStatus({
        zoomEnable: true,
      })
    });
    infoWindow.on('mousewheel', function(e) {
      const { originEvent } = e;
      const infoWinElement = document.querySelector(".infoWin");
      if (infoWinElement) {
        // 阻止事件冒泡，防止地图缩放
        originEvent.stopPropagation();
        originEvent.preventDefault();
        // 处理滚动
        const delta = originEvent.wheelDelta || -originEvent.deltaY;
        infoWinElement.scrollTop -= delta / 5;
      }
    });
    return infoWindow;
}

function AddLOCALines(loca, data) {
    var linkLayer = new Loca.PulseLinkLayer({
        zIndex: 5,
        opacity: 1,
        visible: true,
        zooms: [2, 22],
    });

    var geo = new Loca.GeoJSONSource({ data: data });

    linkLayer.setSource(geo);
    linkLayer.setStyle({
        unit: 'meter',
        lineWidth: function () {
            return [600, 70];
        },
        height: function (index, feat) {
            return feat.distance / 3 + 10;
        },
        smoothSteps: 30,
        speed: 1000,
        flowLength: 100000,
        lineColors: ['DarkSeaGreen', 'rgb(255,164,105)', 'rgba(1, 34, 249,1)'],
        maxHeightScale: 0.3, // 弧顶位置比例
        headColor: 'DarkSeaGreen',
        trailColor: 'DarkSeaGreen',
    });;
    loca.add(linkLayer);
}

function CreateDetailHtml(title, detail) {
    return "<div>" + "<span class='bg-white border-start border-info p-2 mb-2 text-muted'>" + title + "</span><br />" + "</div><div class='infoWin'>" + detail + "</div>";
}

function CreateOffset(point) {
    var offsetLeft = -10;
    var offsetTop = 18;
    if (point.OffsetLeft) {
        offsetLeft = point.OffsetLeft;
    }

    if (point.OffsetTop) {
        offsetTop = point.OffsetTop;
    }

    return new AMap.Pixel(offsetLeft, offsetTop);
}

function ShowLoading(panel) {
    $('#' + panel).html('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"><span class="text-white">数据正在加载中，请稍候……</span></div></div>');
    $('#' + panel).fadeIn(500);
}

function CloseLoading(panel) {
    $('#' + panel).hide();
}

function ConvertWritingLinksToExcel(links) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "作品Id" });
    cells.push({ cell: "B1", value: "作者Id" });
    cells.push({ cell: "C1", value: "作者" });
    cells.push({ cell: "D1", value: "朝代" });
    cells.push({ cell: "E1", value: "标签" });
    cells.push({ cell: "F1", value: "出現位置" });
    cells.push({ cell: "G1", value: '原始文本' });

    var row = 2;
    $.each(links, function (index, link) {
        if (index == 0 || !(links[index - 1].Id == link.Id && links[index - 1].Value == link.Value && links[index - 1].Path == link.Path)) {
            var text = link.Text;
            if (link.PreviousText) {
                text = link.PreviousText + text;
            }
            if (link.NextText) {
                text += link.NextText;
            }

            cells.push({ cell: "A" + row, value: link.Id });
            cells.push({ cell: "B" + row, value: link.AuthorId });
            cells.push({ cell: "C" + row, value: link.Author });
            cells.push({ cell: "D" + row, value: link.Dynasty });
            cells.push({ cell: "E" + row, value: link.Value });
            cells.push({ cell: "F" + row, value: link.Path });
            cells.push({ cell: "G" + row, value: text });
            row++;
        }
    });

    return cells;
}

// Only supports number less than 1000.
function ConvertToChineseNumber(number) {
    if (number >= 1000) {
        return "" + number;
    }

    var chineseNumber = "零一二三四五六七八九十";

    if (number <= 10) {
        return chineseNumber.substr(number, 1);
    }
    else if (number < 20) {
        return '十' + chineseNumber.substr(number % 10, 1);
    }
    else if (number < 100) {
        return chineseNumber.substr(number / 10, 1) + "十" + (number % 10 == 0 ? "" : chineseNumber.substr(number % 10, 1));
    }
    else {
        var hundred = chineseNumber.substr(number / 100, 1) + "百";
        var ten = chineseNumber.substr((number % 100) / 10, 1);
        ten += ten == '零' ? "" : "十";
        var digit = chineseNumber.substr((number % 10), 1);
        return (hundred + ten + digit).replace(/[零]+/g, '');
    }
}