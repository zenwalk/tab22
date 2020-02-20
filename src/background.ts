function chunk(arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
}

function getHostname(str): string {
    // ^(((?:f|ht)tp)(?:s)?|(chrome))\://([^/]+)
    var re = new RegExp('^(?:f|ht)tp(?:s)?://([^/]+)', 'im');
    if (str && str.match(re) != null) return str.match(re)[1].toString();
    else return '';
}

function strcmp(str1, str2) {
    return str1 == str2 ? 0 : str1 > str2 ? 1 : -1;
}

function byTitle(a, b) {
    return strcmp(a.title.toLowerCase(), b.title.toLowerCase());
}

function byHostname(a: chrome.tabs.Tab, b: chrome.tabs.Tab) {
    return strcmp(
        getHostname(a.url).toLowerCase(),
        getHostname(b.url).toLowerCase()
    );
}

function byUrl(a, b) {
    return strcmp(a.url.toLowerCase(), b.url.toLowerCase());
}

function allTabsInOneWindow() {
    chrome.windows.getCurrent(getAllWin);
    function getAllWin(currentWin) {
        let currentWinId = currentWin.id;
        chrome.windows.getAll({ populate: true }, openWins => {
            openWins.forEach(win => {
                if (win.id !== currentWinId) {
                    let idList = win.tabs.map(x => x.id);
                    chrome.tabs.move(idList, {
                        windowId: currentWinId,
                        index: -1,
                    });
                }
            });
        });
    }
}

function sortTabsByHostname() {
    chrome.tabs.query({ currentWindow: true }, tabs => {
        let sortedTabs = tabs.sort(byHostname);
        sortedTabs.forEach((tab, idx) => {
            chrome.tabs.move(tab.id, { index: idx });
        });
    });
}

function TabsPerWindow(number) {
    chrome.windows.getCurrent({ populate: true }, function(oldWin) {
        chrome.tabs.query({}, tabs => {
            var tabGroup = chunk(tabs, number);
            tabGroup.forEach(group => {
                var tabsToMove = group.map(x => x.id);
                chrome.windows.create(
                    {
                        top: oldWin.top,
                        left: oldWin.left,
                        width: oldWin.width,
                        height: oldWin.height,
                        focused: false,
                    },
                    function(newWin) {
                        chrome.tabs.move(
                            tabsToMove,
                            {
                                windowId: newWin.id,
                                index: -1,
                            },
                            function() {
                                // alert('foo');
                                chrome.tabs.query({}, tabs => {
                                    // alert(tabs.length);
                                });
                            }
                        );
                    }
                );
            });
        });
    });
}

function closeNewTabs() {
    chrome.tabs.query({}, function(tabs) {
        // var selected_tabs = tabs.filter(x => x.url === "chrome://newtab/");
        var selected_tabs = tabs.filter(x => !x.url);
        var tabs_id = selected_tabs.map(x => x.id);
        chrome.tabs.remove(tabs_id);
    });
}

function closeDuplicate() {
    chrome.tabs.query(
        {
            currentWindow: true,
        },
        function(tabs) {
            var urls = new Object();

            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url in urls) {
                    if (tabs[i].active) {
                        chrome.tabs.remove(urls[tabs[i].url]);
                        urls[tabs[i].url] = tabs[i].id;
                    } else chrome.tabs.remove(tabs[i].id);
                } else urls[tabs[i].url] = tabs[i].id;
            }
        }
    );
}

function injectScript() {}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case 'sortTabsByHostname':
            sortTabsByHostname();
            break;
        case 'allTabsInOneWindow':
            allTabsInOneWindow();
            break;
        case '20TabsPerWindow':
            TabsPerWindow(20);
            break;
        case '40TabsPerWindow':
            TabsPerWindow(40);
            break;
        case '80TabsPerWindow':
            TabsPerWindow(80);
            break;
        case 'closeNewTabs':
            closeNewTabs();
            break;
        case 'closeDuplicate':
            closeDuplicate();
            break;
        default:
            break;
    }
});
