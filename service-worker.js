/**
 * @description
 */
let settings = {
  defaultTimer: true,
  defaultTime: {
    hours: 0,
    minutes: 5,
    seconds: 0,
  },
  urls: [
    // {
    //   url: "https://developer.chrome.com/docs/extensions/reference/runtime/#method-getBackgroundPage",
    //   noTimer: false,
    //   urlTime: {
    //     hours: 0,
    //     minutes: 0,
    //     seconds: 0,
    //   },
    // },
  ],
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ settings }).then(() => {
    console.log("Value is set");
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.timer === "done") {
    console.log("closing tab: ", sender.origin);
    // chrome.tabs.remove(sender.tab.id);
    chrome.tabs.update(sender.tab.id, { active: true });

    sendResponse({ farewell: "goodbye" });
  }
});
