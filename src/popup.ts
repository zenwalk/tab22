import * as $ from "jquery";

$(() => {
  const queryInfo = {
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    let count = tabs.length;
    chrome.browserAction.setBadgeText({ text: "" + count });
  });

  $("#allTabsInOneWindow").click(() => {
    chrome.runtime.sendMessage({
      type: "allTabsInOneWindow"
    });
  });

  $("#sortTabsByHostname").click(() => {
    chrome.runtime.sendMessage({
      type: "sortTabsByHostname"
    });
  });

  $("#20TabsPerWindow").click(() => {
    chrome.runtime.sendMessage({
      type: "20TabsPerWindow"
    });
  });

  $("#40TabsPerWindow").click(() => {
    chrome.runtime.sendMessage({
      type: "40TabsPerWindow"
    });
  });

  $("#80TabsPerWindow").click(() => {
    chrome.runtime.sendMessage({
      type: "80TabsPerWindow"
    });
  });

  $("#closeNewTabs").click(() => {
    chrome.runtime.sendMessage({
      type: "closeNewTabs"
    });
  });

  $("#closeDuplicate").click(() => {
    chrome.runtime.sendMessage({
      type: "closeDuplicate"
    });
  });

  $("#injectScript").click(() => {
    // chrome.runtime.sendMessage({
    //   type: "closeDuplicate"
    // });

    // chrome.tabs.executeScript(
    //   null,
    //   { code: `Array.from(document.querySelectorAll(".delfav")).map(el => el.click());` },
    //   result => {
    //     console.log(result);
    //   }
    // );

    chrome.tabs.executeScript(
      null,
      { file: "./js/inject_script.js" },
      result => {
        console.log(result);
      }
    );
  });
});
