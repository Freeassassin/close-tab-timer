/**
 * @description This script is injected into the page and runs in the context of the page.
 * It should read from storage and then set an appropriate timer.
 * If there is no appropriate timer, it should wait for the service worker to give it a timer.
 */
let time; // in milliseconds
let timer; // setTimeout() object
let settings;

const sendDeleteMessage = async () => {
  const response = await chrome.runtime.sendMessage({ timer: "done" });
  console.log(response);
};

// check for timer from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.timer.set === true) {
    clearTimeout(timer);
    time = request.timer.time;
    console.log("timer set to: ", time);
    timer = setTimeout(sendDeleteMessage, time);
  }
  if (request.timer.set === false) {
    clearTimeout(timer);
    console.log("timer stopped");
  }
});

const getSettings = chrome.storage.local.get(["settings"]).then((result) => {
  settings = result.settings;
});

(async () => {
  try {
    await getSettings;
  } catch (e) {
    console.log(e);
  }
  if (settings) {
    const urls = settings.urls.map((url) => url.url);
    // check if url has custom timer
    if (urls.includes(window.location.href)) {
      const urlSettings = settings.urls[urls.indexOf(window.location.href)];
      if (!urlSettings.noTimer) {
        console.log("noTimer set to false");
        time += urlSettings.urlTime.hours * 60 * 60 * 1000; // convert to milliseconds
        time += urlSettings.urlTime.minutes * 60 * 1000; // convert to milliseconds
        time += urlSettings.urlTime.seconds * 1000; // convert to milliseconds
        timer = setTimeout(sendDeleteMessage, time);
      }
    }
    // set default timer if it exists
    else if (settings.defaultTimer) {
      time = 0;
      time += settings.defaultTime.hours * 60 * 60 * 1000; // convert to milliseconds
      time += settings.defaultTime.minutes * 60 * 1000; // convert to milliseconds
      time += settings.defaultTime.seconds * 1000; // convert to milliseconds
      console.log("timer set to: ", time);
      timer = setTimeout(sendDeleteMessage, time);
    } else {
      // wait for popup to give timer
    }
  }
})();
