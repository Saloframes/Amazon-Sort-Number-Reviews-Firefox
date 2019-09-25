document.addEventListener('DOMContentLoaded', onContentLoaded, false);

function onContentLoaded() {
    addReviewCountOption();

    observeDOM(document.getElementById("main") || document.getElementsByClassName("s-desktop-toolbar")[0], function (mutations) {
        for (var i = 0; i < mutations.length; i++)
            if ("resultsCol" == mutations[i].target.id)
                return;
        addReviewCountOption();
    });
}

function addReviewCountOption() {
    var sortSelectElement = document.getElementById("sort") || document.getElementById("s-result-sort-select"),
    redirect = document.getElementById("s-result-sort-select");
    if (null != sortSelectElement && "SELECT" == sortSelectElement.tagName) {
        var sortedReviewCount = !1;
        "review-count-rank" == (getParameterByName("sort") || getParameterByName("s")) && (sortedReviewCount = !0);
        for (var options = sortSelectElement.options, i = 0; i < options.length; i++)
            if ("price-desc-rank" === options[i].value || "smooth-review-rank" === options[i].value) {
                if (null == options[i + 1] || "review-count-rank" !== options[i + 1].value) {
                    var numReviewsOption = document.createElement("option");
                    numReviewsOption.value = "review-count-rank",
                    numReviewsOption.text = "Number of Reviews",
                    options.add(numReviewsOption, i + 1);
                }
                sortedReviewCount && (sortSelectElement.selectedIndex = i + 1);
                break;
            }
        if (!sortedReviewCount && redirect) {
            var selection = document.getElementsByClassName("a-dropdown-prompt");
            if (selection && selection[0] && "Number of Reviews" === selection[0].textContent) {
                var url = window.location.href;
                window.location = replaceUrlParam(url, "s", "review-count-rank");
            }
        }
    }
}
function getParameterByName(name, url) {
    url || (url = window.location.href),
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    return results ? results[2] ? decodeURIComponent(results[2].replace(/\+/g, " ")) : "" : null;
}
function replaceUrlParam(url, paramName, paramValue) {
    null == paramValue && (paramValue = "");
    var pattern = new RegExp("\\b(" + paramName + "=).*?(&|#|$)");
    return url.search(pattern) >= 0 ? url.replace(pattern, "$1" + paramValue + "$2") : (url = url.replace(/[?#]$/, ""), url + (url.indexOf("?") > 0 ? "&" : "?") + paramName + "=" + paramValue);
}

var observeDOM = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;
    return function (obj, callback) {
        if (MutationObserver) {
            var obs = new MutationObserver(function (mutations, observer) {
                    (mutations[0].addedNodes.length || mutations[0].removedNodes.length) && callback(mutations);
                });
            obs.observe(obj, {
                childList: !0,
                subtree: !0
            });
        } else
            eventListenerSupported && (obj.addEventListener("DOMNodeInserted", callback, !1), obj.addEventListener("DOMNodeRemoved", callback, !1));
    };
}();