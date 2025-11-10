var markers = new Array();
var selectedPoets = new Array();
var map;
var beginYear;
var endYear;
var travelData;
var currentLine;
var currentTrace;
var currentDetails;
var currentViewQueryString;
var lastHighlightedRoute;
var places;
var isQueryingPlaces = false;
var maxLengthInPopWin = 2000000;
var lightMarkLayer;
var isXianTang = false;

function MergeRoute(index) {
    var poet = $('#poet' + index)[0];
    var pos = selectedPoets.indexOf(index);

    if (poet.checked) {
        if (pos < 0) {
            selectedPoets.push(index);
        }
    }
    else if (pos >= 0) {
        selectedPoets.splice(pos, 1);
    }

    if (selectedPoets.length < 1) {
        return;
    }

    ShowSelectedPoetsRoute();
}

function ShowSelectedPoetsRoute() {
    var tabsHeader = "<ul class='nav nav-tabs' role='tablist' id='poetListTabs'>";
    var poetTraceDetail = '<div class="tab-content">';
    for (var i = 0; i < selectedPoets.length; i++) {
        var poetIndex = selectedPoets[i];
        var trace = travelData.Traces[poetIndex];
        var traceDetail = trace.Detail.replace(/ViewPoint\(/g, "ViewPointInTrace(" + poetIndex + ",");
        var traceDetail = traceDetail.replace(/ViewRoute\(/g, "ViewRouteInTrace(" + poetIndex + ",");
        var markerIcon = markerIcons[i % markerIcons.length];
        var lineColor = lineColors[i % lineColors.length];
        var active = i == 0 ? " active" : "";
        var tabId = "poet" + i + "route";

        tabsHeader += "<li class='nav-item' role='presentation'>"
        tabsHeader += "<button class='nav-link" + active + "' id='" + tabId + "-tab' data-bs-toggle='tab' data-bs-target='#" + tabId + "' type='button' role='tab' aria-controls='" + tabId + "' aria-selected='" + (i == 0 ? "true" : "false") + "'><img style='height: 16px;' src='./map/" + markerIcon + ".png' />" + trace.Title + "</button>";
        tabsHeader += "</li>";

        poetTraceDetail += '<div class="tab-pane fade show ' + (i == 0 ? "active" : "") + ' pt-3" id="' + tabId + '" role="tabpanel" aria-labelledby="' + tabId + '-tab">' + traceDetail + '</div>';

        if (i == 0) {
            ShowTrace(trace, markerIcon, lineColor);
            continue;
        }

        if (trace.Markers != null) {
            $.each(trace.Markers, function (index, marker) {
                if (marker.Longitude != 0 || marker.Latitude != 0) {
                    var m = ShowMarker(map, marker, markerIcon);
                    if (m) {
                        m.setDraggable(true);
                        markers.push(m);
                    }
                }
            });
        }

        if (trace.Lines != null) {
            $.each(trace.Lines, function (index, lines) {
                ShowLine(index, lines, lineColor);
            });
        }
    }

    map.setFitView();

    tabsHeader += "</ul>";
    poetTraceDetail += "</div>";
    $('#poetLifeDetail').html(tabsHeader + poetTraceDetail);
}

function NewView(requestUri) {
    // var link = "NewView('" + requestUri + "')";
    currentViewQueryString = requestUri;
    var trace = FindInCache(requestUri);
    if (trace) {
        currentTrace = trace;
        CleanDetail();
        ShowTrace(currentTrace);
        return;
    }

    var url = './Api/Biography?';
    var htmlUrl = null;
    
    // 从 requestUri 中提取 author 参数
    var authorMatch = requestUri.match(/author=([^&]*)/);
    if (authorMatch && authorMatch[1]) {
        var authorName = decodeURIComponent(authorMatch[1]);
        url = './Api/Biography-' + authorName + '_v2.json?';
        htmlUrl = './Api/Biography-' + authorName + '_v2.html?';
    }
    
    if (isXianTang) {
        url += "isXianTang=true&"
        if (htmlUrl) {
            htmlUrl += "isXianTang=true&"
        }
    }
    url += requestUri;
    if (htmlUrl) {
        htmlUrl += requestUri;
    }

    ShowLoading('poetLifeSummary');
    
    // 同时请求JSON和HTML
    var jsonRequest = $.getJSON(url);
    var htmlRequest = htmlUrl ? $.get(htmlUrl) : $.Deferred().resolve(null);
    
    $.when(jsonRequest, htmlRequest).done(function (jsonResult, htmlResult) {
        var data = jsonResult[0];
        var htmlContent = htmlResult ? (htmlResult[0] || htmlResult) : null;
        
        if (data && data.Traces) {
            // 将HTML内容放回到data.Traces[0].Detail以保持兼容
            if (htmlContent && data.Traces[0]) {
                data.Traces[0].Detail = htmlContent;
            }
            // 仅保留苏轼逆境地图的十个关键节点（隐藏其它地点的点与线）
            try {
                RestrictSuShiTrace(data.Traces[0], requestUri);
            } catch (e) { console.warn('RestrictSuShiTrace failed:', e); }
            
            AddToCache(requestUri, data.Traces[0]);
            CleanDetail();
            ShowTrace(data.Traces[0]);
        }
    }).fail(function (error) {
        console.error('Failed to load data:', error);
    }).always(function () {
        CloseLoading('poetLifeSummary');
    });
}

function ShowWritingReport() {
    var url = "/Api/Biography/WritingStat?";
    if (isXianTang) {
        url += "isXianTang=true&"
    }

    if (currentViewQueryString) {
        url += currentViewQueryString;
    }

    ShowLoading('poetLifeSummary');
    $.getJSON(url).done(function (data) {
        CreateWritingStatExcel(data, "poetLifeSummary");
    }).fail(function () {
        CloseLoading('poetLifeSummary');
    });
}

function FindInCache(requestUri) {
    for (var i = 0; i < travelData.Traces.length; i++) {
        var trace = travelData.Traces[i];
        if (IsSameRequest(trace.RequestUri, requestUri)) {
            if (trace.Lines || trace.Markers) {
                return trace;
            }
            else {
                return null;
            }
        }
    }

    return null;
}

function AddToCache(requestUri, trace) {
    requestUri = decodeURI(requestUri);
    trace.RequestUri = requestUri;
    for (var i = 0; i < travelData.Traces.length; i++) {
        if (IsSameRequest(trace.RequestUri, travelData.Traces[i].RequestUri)) {
            travelData.Traces[i] = trace;
            $('#poet' + i).show();
            return;
        }
    }
}

function IsSameRequest(request1, request2) {
    if (request1 && request2) {
        request1 = request1.replace(/%2b/g, "+");
        request2 = request2.replace(/%2b/g, "+");
        return request1 == request2;
    }
    else {
        return false;
    }
}

function DetailSwitch(id, status) {
    var detailId = '#' + id;
    var linkId = detailId + "_link";

    if (status && $(linkId).text() == status) {
        return;
    }

    $(detailId).slideToggle();

    if ($(linkId).text() == '—') {
        $(linkId).text('╋');
    }
    else {
        $(linkId).text('—');
    }
}

function CleanDetail() {
    $("#poetLifeDetail").html('');
}

function ViewRouteInTrace(traceIndex, start, end, longitude, latitude, zoomLevel, lineIndex) {
    currentTrace = travelData.Traces[traceIndex];
    currentLine = currentTrace.Lines[lineIndex];

    ViewRoute(start, end, longitude, latitude, zoomLevel, lineIndex);
}

function ViewRoute(start, end, longitude, latitude, zoomLevel, lineIndex) {
    HighlightRoute(start, end, lineIndex);
}

function HighlightRoute(start, end, lineIndex) {
    var line = currentTrace.Lines[lineIndex];

    if (lastHighlightedRoute) {
        map.removeControl(lastHighlightedRoute);
    }

    var points = new Array();
    for (var i = start; i < end && i < line.Markers.length; i++) {
        var point = line.Markers[i];
        if (i == start) {
            points.push([point.Longitude, point.Latitude]);
        }
        else {
            points.push(CreateBezierCurve(line.Markers[i - 1].Longitude, line.Markers[i - 1].Latitude, point.Longitude, point.Latitude));
        }
    }

    var lifeLine = new AMap.BezierCurve({
        path: points,
        isOutline: true,
        outlineColor: 'green',
        strokeColor: 'red',
        strokeWeight: 6,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
        showDir: true
    });
    lifeLine.setMap(map);
    lastHighlightedRoute = lifeLine;
    map.setFitView(lifeLine);
}

function CreateBezierCurve(lng1, lat1, lng2, lat2) {
    var k = Math.abs(lng2 != lng1 ? (lat2 - lat1) / (lng2 - lng1) : 90);
    var distance = Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));

    if (k > 2) {
        distance = lng2 > lng1 ? distance : -distance;
        lat1 += (lat2 - lat1) / 3;
        lng1 += (lng2 - lng1 + distance) / 3;
    }
    else if (k >= 0.5) {
        lng1 += (lng2 - lng1) / 3;
    }
    else {
        distance = lat2 > lat1 ? distance : -distance;
        lat1 += (lat2 - lat1 + distance) / 3;
        lng1 += (lng2 - lng1) / 3;
    }

    return [lng1, lat1, lng2, lat2];
}

function ViewDetail(requestUri, redraw) {
    return;
    var url = ComposeBiographyUrl(requestUri);

    ShowLoading('poetLifeSummary');
    $.getJSON(url).done(function (data) {
        ShowDetail(data, redraw);
        if (data.ArticleStat) {
            ShowStatData(data.ArticleStat);
        }
        else {
            AddExcelLink(requestUri);
        }
    }).always(function () {
        CloseLoading('poetLifeSummary');
    });
}

function ComposeBiographyUrl(requestUri) {
    var url = requestUri[0] == '/' ? requestUri : '/Api/Biography?' + requestUri;
    if (isXianTang) {
        if (url.indexOf('?') >= 0) {
            url += "&"
        }
        else {
            url += "?";
        }
        url += "isXianTang=true";
    }
    return url;
}

function AddExcelLink(requestUri) {
    currentDetails = requestUri;
    var html = '<a class="link-dark ms-3" href="javascript: ShowDetailsDataInExcel()">导出当前数据</a>';
    $('#currentPath').append(html);
}

function ShowDetail(data, redraw) {
    console.log('ShowDetail', data);
    if (data && data.Traces) {
        var trace = data.Traces[0]
        CleanDetail();

        if (trace.Markers.length > 1 || redraw) {
            ShowTrace(trace);
        }
        else if (trace.Title) {
            var title = CreateTitle(trace.Title);
            $(title).appendTo('#poetLifeDetail');
        }

        if (trace.Markers.length == 1 || trace.Lines == null) {
            $.each(trace.Markers, function (index, point) {
                if (point.Detail) {
                    var div = "<div class='text-success border-bottom py-1'>" + point.Title + "</div><div>" + point.Detail + "</div>";
                    $(div).appendTo('#poetLifeDetail');
                }
            });
        }
    }
}

function CreateTitle(title) {
    return "<div class='text-success border-bottom py-1'>" + title + "</div>";
}

function ShowSummaryAndDetail(data) {
    if (data.Summary) {
        $('#poetLifeSummary').html(data.Summary);
    }
    else {
        $('#poetLifeSummary').hide();
    }
    console.log('data', data)

    if (data.Detail) {
        if (data.Title) {
            var title = data.Title;
            if (title.startsWith("岑参")) {
                title += "<a href='https://m.toutiaoimg.cn/i6961678573316866573' target='_blank' style='margin-left: 1rem;'>行迹视频</a>"
            }

            $(CreateTitle(title)).appendTo('#poetLifeDetail')
        }
        $(data.Detail).appendTo('#poetLifeDetail');
        // 重建苏轼的活动列表，仅保留十个关键节点（同步点击索引）
        try { RebuildSuShiActivityList(data); } catch (e) { console.warn('RebuildSuShiActivityList failed:', e); }
    }
}

// 仅用于“苏轼”视图：基于标题关键词筛选 10 个关键节点，裁剪 Markers 与 Lines
function RestrictSuShiTrace(trace, requestUri) {
    if (!trace || !requestUri || requestUri.indexOf('author=%E8%8B%8F%E8%BD%BC') < 0 && requestUri.indexOf('author=苏轼') < 0) {
        return;
    }

    var allowedTitlePatterns = [
        '黄州', '黄冈',
        '筠州', '高安',
        '虔州', '赣州',
        '大庾', '南雄', '大余', '大庾岭',
        '惠州', '归善',
        '雷州', '海康',
        '儋州', '宜伦',
        '廉州', '合浦',
        '永州',
        '常州', '武进'
    ];

    var visible = trace.Markers || [];
    var keptVisible = [];
    var regionIdsToKeep = {};

    for (var i = 0; i < visible.length; i++) {
        var m = visible[i];
        var title = m.Title || '';
        for (var j = 0; j < allowedTitlePatterns.length; j++) {
            if (title.indexOf(allowedTitlePatterns[j]) >= 0) {
                keptVisible.push(m);
                regionIdsToKeep[m.RegionId] = true;
                break;
            }
        }
    }

    // 若未识别，直接返回以避免破坏原有视图
    if (keptVisible.length == 0) {
        return;
    }

    // 按线路中的出现顺序重新排序可见点，保证线路与列表一致
    var orderedRegionIds = [];
    if (trace.Lines && trace.Lines.length > 0 && trace.Lines[0].Markers) {
        for (var li = 0; li < trace.Lines[0].Markers.length; li++) {
            var lm = trace.Lines[0].Markers[li];
            if (regionIdsToKeep[lm.RegionId] && orderedRegionIds.indexOf(lm.RegionId) < 0) {
                orderedRegionIds.push(lm.RegionId);
            }
        }
    }

    function findVisibleByRegion(regionId) {
        for (var k = 0; k < keptVisible.length; k++) {
            if (keptVisible[k].RegionId == regionId) return keptVisible[k];
        }
        return null;
    }

    var reorderedVisible = [];
    for (var ri = 0; ri < orderedRegionIds.length; ri++) {
        var vv = findVisibleByRegion(orderedRegionIds[ri]);
        if (vv) reorderedVisible.push(vv);
    }

    // 只保留 10 个（过多则截断）
    if (reorderedVisible.length > 10) {
        reorderedVisible = reorderedVisible.slice(0, 10);
    }

    // 过滤线路点：仅保留属于上述 Region 的点，并保持原顺序
    var keepSet = {};
    for (var ii = 0; ii < reorderedVisible.length; ii++) {
        keepSet[reorderedVisible[ii].RegionId] = true;
    }

    if (trace.Lines) {
        for (var li2 = 0; li2 < trace.Lines.length; li2++) {
            var line = trace.Lines[li2];
            if (!line.Markers) continue;
            var filtered = [];
            for (var mi = 0; mi < line.Markers.length; mi++) {
                var lm2 = line.Markers[mi];
                if (keepSet[lm2.RegionId]) {
                    filtered.push(lm2);
                }
            }
            line.Markers = filtered;
        }
    }

    trace.Markers = reorderedVisible;
    trace.__sushi_curated = true;
}

// 仅用于“苏轼”视图：重建右侧活动列表，只保留关键节点，并修正 onclick 索引
function RebuildSuShiActivityList(trace) {
    if (!trace || !trace.__sushi_curated) {
        return;
    }
    var listRoot = $('#poetLifeDetail #activityGroups');
    if (listRoot.length == 0) {
        return;
    }

    // 建索引：原页面中按地点标题可取到完整条目，用于保留原文
    var originalItemsByTitle = {};
    listRoot.children('.list-group-item').each(function() {
        var t = $(this).find('span.text-success').first().text() || '';
        if (t) {
            if (!originalItemsByTitle[t]) {
                originalItemsByTitle[t] = $(this).clone(true);
            }
        }
    });

    // 清空并仅按 trace.Markers 顺序重建
    listRoot.empty();
    for (var i = 0; i < trace.Markers.length; i++) {
        var mk = trace.Markers[i];
        var title = mk.Title || '';

        // 找到最匹配的原项（精确标题或包含关系）
        var item = originalItemsByTitle[title];
        if (!item) {
            // 退化：尝试按包含匹配
            for (var key in originalItemsByTitle) {
                if (title.indexOf(key) >= 0 || key.indexOf(title) >= 0) {
                    item = originalItemsByTitle[key].clone(true);
                    break;
                }
            }
        }
        if (!item) {
            // 最后兜底：构造一个最简条目
            item = $("<div class='list-group-item list-group-item-action link'><span class='text-success'></span></div>");
            item.find('span.text-success').text(title);
        }

        // 重写 onclick 的索引以匹配裁剪后的 Lines 索引
        var html = item.attr('onclick') || '';
        if (html && html.indexOf('ViewPoint(') >= 0) {
            item.attr('onclick', 'ViewPoint(' + i + ', 0)');
        } else {
            item.attr('onclick', 'ViewPoint(' + i + ', 0)');
        }

        listRoot.append(item);
        if (i < trace.Markers.length - 1) {
            listRoot.append("<div><center><span class='text-success'>↓</span></center></div>");
        }
    }
}

function ShowCategoryList(traces) {
    if (!traces) {
        traces = travelData.Traces;
    }

    var isFullTrace = traces.length == travelData.Traces.length;

    $('#categoryList').html('');
    for (var i = 0; i < traces.length; i++) {
        var trace = traces[i];
        if (trace.Lines || trace.Markers || trace.RequestUri) {
            var poetIndex = i;
            if (!isFullTrace) {
                poetIndex = travelData.Traces.findIndex(function (item) {
                    return item.RequestUri == trace.RequestUri;
                });
            }

            var checkBox = "";
            var checkBoxStyle = "display: none;";
            var checked = selectedPoets.indexOf(poetIndex) >= 0 ? "checked" : "";

            if ((trace.Lines || traces.Markers) && (!isFullTrace || i > 0)) {
                checkBoxStyle = "";
            }
            checkBox = "<input type='checkbox' class='form-check-input me-2' style='" + checkBoxStyle + "' " + checked + " onclick='javascript: MergeRoute(" + poetIndex + ")' id='poet" + poetIndex + "' />";

            var linkHtml;
            if (trace.Lines || trace.Markers) {
                linkHtml = "<a href='javascript: ShowTraceByIndex(" + poetIndex + ");' class='link-dark'>" + trace.Title + "</a>";
            }
            else {
                linkHtml = "<a href=\"javascript: NewView('" + trace.RequestUri + "');\" class='link-dark'>" + trace.Title + "</a>";
            }

            if (trace.IsMarked) {
                linkHtml = "<span class='marked'>" + linkHtml + "</span>";
            }

            linkHtml = "<p>" + checkBox + linkHtml + "</p>";

            $(linkHtml).appendTo('#categoryList');
        }
        else {
            var block = "<div class='bg-white border-start border-info p-2 mb-2 text-muted'>" + trace.Title + "</div>";
            $(block).appendTo('#categoryList');
        }
    }
    $('#categoryList').show();
}

function ShowTraceByIndex(index) {
    var trace = travelData.Traces[index];
    CleanDetail();
    ShowTrace(trace);

    if (index == 0) {
        ShowStat();
        CleanHighlightMarker();
    }
}

function ShowTrace(trace, icon, lineColor) {
    currentTrace = trace;

    CleanUp();

    if (trace.Markers != null) {
        $.each(trace.Markers, function (index, marker) {
            if (marker.Longitude != 0 || marker.Latitude != 0) {
                var markerIcon = icon;

                if (IsFlag(marker)) {
                    markerIcon = flagIcon
                }

                if (IsLabelMarked(marker)) {
                    markerIcon = starIcon;
                }

                var m = ShowMarker(map, marker, markerIcon);
                if (m) {
                    markers.push(m);
                }
            }
        });

        if (trace.Lines != null) {
            HighlightMarker([trace.Markers[0].Longitude, trace.Markers[0].Latitude])
        }
    }

    if (trace.Lines != null) {
        $.each(trace.Lines, function (index, lines) {
            ShowLine(index, lines, lineColor);
        });
    }

    ShowSummaryAndDetail(trace);
    map.setFitView();
}

function IsLabelMarked(marker) {
    return !marker.Invisible && marker.Marked;
}

function IsFlag(marker) {
    return !marker.Invisible && !(marker.Detail || marker.Summary || marker.Poems)
}

function CleanUp() {
    map.clearMap();
    markers.length = 0;
    CleanHighlightMarker();
    $('#poetLifeSummary').html('');
}

function ShowLine(index, line, color, straight) {
    if (!line.Markers || line.Markers.length < 2) {
        return;
    }

    var points = new Array();
    $.each(line.Markers, function (index, point) {
        if (index == 0) {
            points.push([point.Longitude, point.Latitude]);
        }
        else {
            points.push(CreateBezierCurve(line.Markers[index - 1].Longitude, line.Markers[index - 1].Latitude, point.Longitude, point.Latitude));
        }
    });

    if (!color) {
        currentLine = line;
        color = lineColors[0];
    }

    var lifeLine = new AMap.BezierCurve({
        path: points,
        isOutline: true,
        outlineColor: '#ffeeff',
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: straight ? 6 : 3,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50
    });

    lifeLine.setMap(map);

    return lifeLine;
}

function ViewPointInTrace(traceIndex, index, lineIndex) {
    currentTrace = travelData.Traces[traceIndex];
    currentLine = currentTrace.Lines[lineIndex];

    ViewPoint(index, lineIndex);
}

function ViewPoint(index, lineIndex) {
    HighlightRoute(index > 0 ? index - 1 : index, index + 2, lineIndex);

    var line = currentTrace.Lines[lineIndex];
    var invisibleMarker = line.Markers[index];
    var targetMarkerData = FindMarker(currentTrace.Markers, invisibleMarker.RegionId);
    var targetMarker = FindMarkerOnMap(targetMarkerData);
    var detailHtml = CreateDetailHtml(targetMarkerData.Title, targetMarkerData.Detail);
    var infoWindow = CreateInfoWindow(detailHtml, map);

    infoWindow.open(map, targetMarker.getPosition());

    HighlightMarker(targetMarker.getPosition());
    map.setCenter(targetMarker.getPosition());

    $.each(currentLine.Markers, function (index, marker) {
        if (marker.RegionId == invisibleMarker.RegionId) {
            var status = marker.Id == invisibleMarker.Id ? '—' : '╋';
            DetailSwitch(marker.Id, status);
        }
    });
}

function FindMarker(regions, regionId) {
    for (var i = 0; i < regions.length; i++) {
        if (regions[i].RegionId == regionId) {
            return regions[i];
        }
    }

    return null;
}

function FindMarkerOnMap(markerData) {
    for (var i = 0; i < markers.length; i++) {
        var position = markers[i].getPosition();

        if (position.lng == markerData.Longitude && position.lat == markerData.Latitude) {
            return markers[i];
        }
    }

    return null;
}

function PopupDetailWindow(requestUri, map, position) {
    var url = ComposeBiographyUrl(requestUri);
    ShowLoading('poetLifeSummary');
    $.getJSON(url).done(function (data) {
        if (data && data.Traces && data.Traces[0]) {
            var trace = data.Traces[0];
            var detail = "";
            $.each(trace.Markers, function (index, point) {
                if (point.Title) {
                    detail += "<p class='mt-3'><span class='squareLabel'>" + point.Title + "</span></p>";
                }
                if (point.Detail) {
                    detail += point.Detail;
                }
            });

            if (detail) {
                var infoWindow;
                if (detail.length < maxLengthInPopWin) {
                    var detailHtml = CreateDetailHtml(trace.Title, detail);
                    infoWindow = CreateInfoWindow(detailHtml, map);
                }
                else {
                    infoWindow = CreateInfoWindow("<div class='alert alert-info mt-3' role='alert'>由于数据量太大，为改善体验，内容显示在页面右栏。</div>", map);
                    $('#poetLifeDetail').html(detail);
                }

                infoWindow.open(map, position);
                HighlightMarker(position);
            }
        }
    }).always(function () {
        CloseLoading('poetLifeSummary');
    });
}

function HighlightMarker(position) {
    if (lightMarkLayer) {
        lightMarkLayer.setSource(new Loca.GeoJSONSource({
            data: {
                type: 'FeatureCollection',
                features: [{ "type": "Feature", "geometry": { "type": "Point", "coordinates": position } } ]
            }
        }));
        lightMarkLayer.show();
    }
}

function CleanHighlightMarker() {
    if (lightMarkLayer) {
        lightMarkLayer.hide();
    }
}

function ConcatDetail(regionId) {
    var detail = "";
    $.each(currentLine.Markers, function (index, marker) {
        if (marker.RegionId == regionId) {
            if (marker.Summary) {
                detail += marker.Summary;
            }
            if (marker.Detail) {
                detail += marker.Detail;
            }
        }
    });

    return detail;
}

function ShowStat() {
    if ($("#poetLifeDetail").length == 0) {
        return;
    }

    var requestUri = './Api/Biography/Stat.json?';
    if (isXianTang) {
        requestUri += "isXianTang=true&";
    }

    if (beginYear && endYear) {
        requestUri += "beginYear=" + beginYear + "&endYear=" + endYear;
    }

    $.getJSON(requestUri).done(function (data) {
        ShowStatData(data);
    });
}

function ShowStatData(data) {
    var subTitle = "<span class='inlineComment2'>起止年份：" + data.BeginYear + " - " + data.EndYear + "  作者：" + data.AuthorCount + "位</span>";
    var tableHtml = CreateStatTable(data);
    var dynasty = isXianTang ? "汉魏六朝" : "唐宋";
    $('#poetLifeDetail').html("<div class='text-success border-bottom py-1'>" + dynasty + "文学作品按地区统计</div>" + subTitle + tableHtml);
}

function ShowLayer(id) {
    PostJSON("https://api.sou-yun.cn/api/MapLayer", id, function (data) {
        if (data.Lines != null) {
            $.each(data.Lines, function (index, lines) {
                ShowLine(index, lines, "brown", true);
            });
        }
    });
}

function CreateStatTable(stat) {
    var statByRegions = stat.ByRegion;

    var totalPoemCount = 0;
    var totalCiCount = 0;
    var totalFuCount = 0;
    var totalArticleCount = 0;

    var html = "<table><thead><tr><th style='width: 90px;'>城市</th><th style='width: 60px;'>诗</th><th style='width: 60px;'>词</th><th style='width: 60px;'>赋</th><th style='width: 60px;'>文</th></tr></thead>";
    for (var i = 0; i < statByRegions.length; i++) {
        var statByRegion = statByRegions[i];
        html += "<tr>";
        html += "<td>" + "<a href='javascript: ViewDetail(\"author=&scope=" + statByRegion.RegionId + "&beginYear=" + stat.BeginYear + "&endYear=" + stat.EndYear + "\");'>" + statByRegion.Name + "</a></td>";
        html += "<td>" + statByRegion.PoemCount + "</td>";
        html += "<td>" + statByRegion.CiCount + "</td>";
        html += "<td>" + statByRegion.FuCount + "</td>";
        html += "<td>" + statByRegion.ArticleCount + "</td>";
        html += "</tr>";

        totalPoemCount += statByRegion.PoemCount;
        totalCiCount += statByRegion.CiCount;
        totalFuCount += statByRegion.FuCount;
        totalArticleCount += statByRegion.ArticleCount;
    }

    html += "<tfoot><tr><td>总计</td>";
    html += "<td>" + totalPoemCount + "</td>";
    html += "<td>" + totalCiCount + "</td>";
    html += "<td>" + totalFuCount + "</td>";
    html += "<td>" + totalArticleCount + "</td>";
    html += "</tr></tfoot></table>";
    return html;
}

function Filter() {
    if (travelData && travelData.Traces) {
        var key = GetKey();

        if (!key || key == "") {
            ShowCategoryList(travelData.Traces);
            return;
        }

        var found = new Array();

        $.each(travelData.Traces, function (index, trace) {
            if (trace.Title.indexOf(key) >= 0) {
                found[found.length] = trace;
            }
        });

        if (found.length > 0) {
            ShowCategoryList(found);
            $('#categoryList').prepend("<div class='text-success border-bottom py-1'>作家</div>");
        }
        else {
            $('#categoryList').html("");
        }

        $('#categoryList').prepend('<a href="javascript: ShowCategoryList();" class="link-dark">总览</a>');
        $('#categoryList').append("<div id='foundPlaces'></div><div id='foundPoems'></div>");

        FilterByPoems(key);

        if (!places) {
            if (!isQueryingPlaces) {
                isQueryingPlaces = true;

                var url = "/Api/Biography/Places";
                if (isXianTang) {
                    url += "?isXianTang=true";
                }

                $.getJSON(url).done(function (data) {
                    places = data;
                    var foundPlaces = FilterPlaces(GetKey());
                    if (foundPlaces) {
                        $('#foundPlaces').html("<div class='text-success border-bottom py-1'>地点</div>" + foundPlaces);
                    }
                }).always(function () {
                    isQueryingPlaces = false;
                });;
            }
        }
        else {
            var foundPlaces = FilterPlaces(key);
            if (foundPlaces) {
                $('#foundPlaces').html("<div class='text-success border-bottom py-1'>地点</div>" + foundPlaces);
            }
        }
    }
}

function GetKey() {
    var key = document.getElementById('key').value;
    if (key) {
        key = key.trim().replace(/[a-zA-Z]+/, "");
    }
    return key;
}

function SearchPlaces(key, createView) {
    if (!places) {
        var url = biographyApiHome + 'Places';
        $.getJSON(url).done(function (data) {
            places = data;
            var foundPlaces = FilterPlaces(GetKey());
            if (foundPlaces) {
                createView(foundPlaces);
            }
        });
    }
    else {
        var foundPlaces = FilterPlaces(key);
        if (foundPlaces) {
            createView(foundPlaces);
        }
    }
}

function FilterPlaces(key) {

    var urlParams = "author=&scope="

    if (beginYear && endYear) {
        urlParams = "beginYear=" + beginYear + "&endYear" + endYear + "&" + urlParams;
    }

    var html = "";

    $.each(places, function (index, byDynasty) {
        var panelHtml = "";
        $.each(byDynasty.Value, function (subIndex, place) {
            var url = urlParams + byDynasty.Key + '/' + place;

            if (place.indexOf(key) >= 0) {
                panelHtml += "<li class='none'><a href='javascript: ViewDetail(\"" + url + "\", true)'>" + place + "</a></li>";
            }
        });

        if (panelHtml.length > 0) {
            html += "<span class='inlineComment2'>" + byDynasty.Key + "</span>";
            html += "<ul>" + panelHtml + "</ul>";
        }
    })

    return html;
}

var activitiesByPoem;
function FilterByPoems(key) {
    var url = '/Api/Biography/Poems/' + key;
    if (isXianTang) {
        url += "?isXianTang=true";
    }

    $.getJSON(url).done(function (data) {
        if (data) {
            activitiesByPoem = data;
            $('#foundPoems').html("<div class='text-success border-bottom py-1'>作品</div><a href='javascript: ShowActivitiesByPoems()'>" + data.Title + "</a><br />" + data.Summary);
        }
    });
}

function ShowActivitiesByPoems() {
    if (activitiesByPoem) {
        ShowDetail(activitiesByPoem, true);
    }
}

function ShowDetailsDataInExcel() {
    if (!currentDetails) {
        return;
    }

    var url = '/Api/Biography?' + currentDetails + "&DetailsInRaw=true";
    if (isXianTang) {
        url += "&isXianTang=true";
    }

    ShowLoading('poetLifeSummary');
    $.getJSON(url).done(function (data) {
        CreateExcel(data, "poetLifeSummary");
    }).fail(function () {
        CloseLoading('poetLifeSummary');
    });
}

function CreateWritingStatExcel(data, panel) {
    $('#' + panel).html('');

    var cells = new Array();
    var prefixes = "ABCDE";
    $.each(data.Csv, function (index, line) {
        $.each(line, function (col, cell) {
            cells.push({ cell: prefixes[col] + (index + 1), value: cell });
        });
    });

    dhx.i18n.setLocale("spreadsheet", excelMenuZh);
    var colsCount = 5;
    var spreadsheet = new dhx.Spreadsheet(panel, {
        colsCount: colsCount,
        rowsCount: cells.length / colsCount,
        toolbarBlocks: ["default", "file"],
        formats: [{ name: "Number", id: "number", mask: "#0", example: "2702.31" }]
    });
    spreadsheet.parse(cells);
    spreadsheet.setStyle("A1:E1", { background: "#6ebfe3", color: "white" });
    $('#' + panel).fadeIn();
}

function CreateExcel(data, panel) {
    $('#' + panel).html('');
    var cells = ConvertToExcel(data);
    dhx.i18n.setLocale("spreadsheet", excelMenuZh);
    var colsCount = 21;
    var spreadsheet = new dhx.Spreadsheet(panel, {
        colsCount: colsCount,
        rowsCount: cells.length / colsCount,
        toolbarBlocks: ["default", "file"],
        formats: [{ name: "Number", id: "number", mask: "#0", example: "2702.31" }]
    });
    spreadsheet.parse(cells);
    spreadsheet.setStyle("A1:U1", { background: "#6ebfe3", color: "white" });
    $('#' + panel).fadeIn();
}

function ConvertToExcel(data) {
    var cells = new Array();
    cells.push({ cell: "A1", value: "作家" });
    cells.push({ cell: "B1", value: "皇帝纪年" });
    cells.push({ cell: "C1", value: "公元年" });
    cells.push({ cell: "D1", value: "月" });
    cells.push({ cell: "E1", value: "日" });
    cells.push({ cell: "F1", value: "古一级地名" });
    cells.push({ cell: "G1", value: "古二级地名" });
    cells.push({ cell: "H1", value: "古三级地名" });
    cells.push({ cell: "I1", value: "地点名胜" });
    cells.push({ cell: "J1", value: "今活动地省" });
    cells.push({ cell: "K1", value: "今活动地市、县" });
    cells.push({ cell: "L1", value: "职官" });
    cells.push({ cell: "M1", value: "活动" });
    cells.push({ cell: "N1", value: "交游" });
    cells.push({ cell: "O1", value: "系年作品" });
    cells.push({ cell: "P1", value: "体裁" });
    cells.push({ cell: "Q1", value: "来源" });
    cells.push({ cell: "R1", value: "备注1" });
    cells.push({ cell: "S1", value: "备注2" });
    cells.push({ cell: "T1", value: "备注3" });
    cells.push({ cell: "U1", value: "录入者" });

    var row = 2;
    $.each(data.Traces, function (index, trace) {
        $.each(trace.Markers, function (index, marker) {
            $.each(marker.Activities, function (index, activity) {
                cells.push({ cell: "A" + row, value: activity.OwnerName });
                cells.push({ cell: "B" + row, value: activity.OldYear });
                cells.push({ cell: "C" + row, value: activity.Year });
                cells.push({ cell: "D" + row, value: activity.Month });
                cells.push({ cell: "E" + row, value: activity.Day });
                cells.push({ cell: "F" + row, value: activity.Place.OldProvince });
                cells.push({ cell: "G" + row, value: activity.Place.OldSubProvince });
                cells.push({ cell: "H" + row, value: activity.Place.OldCity });
                cells.push({ cell: "I" + row, value: activity.Place.Place });
                cells.push({ cell: "J" + row, value: activity.Place.Province });
                cells.push({ cell: "K" + row, value: activity.Place.City });
                cells.push({ cell: "L" + row, value: activity.Title });
                cells.push({ cell: "M" + row, value: activity.Activity });
                cells.push({ cell: "N" + row, value: activity.People });
                cells.push({ cell: "O" + row, value: activity.Subject });
                cells.push({ cell: "P" + row, value: GetArticleType(activity.ArticleType) });
                cells.push({ cell: "Q" + row, value: activity.FromBook });
                cells.push({ cell: "R" + row, value: activity.ArticleComment1 });
                cells.push({ cell: "S" + row, value: activity.ArticleComment2 });
                cells.push({ cell: "T" + row, value: activity.ArticleComment3 });
                cells.push({ cell: "U" + row, value: activity.LastEditor });
                row++;
            });
        });
    });

    return cells;
}

function GetArticleType(type) {
    if (type == 2) return "诗 ";
    if (type == 4) return "文 ";
    if (type == 8) return "诗词残句 ";
    if (type == 16) return "文断句 ";
    if (type == 32) return "赋 ";
    if (type == 64) return "词 ";
    if (type == 128) return "著作 ";
    if (type == 256) return "疏 ";
    if (type == 512) return "表 ";
    if (type == 1024) return "铭 ";
    if (type == 2048) return "赞 ";
    return "未知";
}