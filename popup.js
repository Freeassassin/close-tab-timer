async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function setTimer(time) {
  const tab = await getCurrentTab();
  await chrome.tabs.sendMessage(tab.id, {
    timer: {
      set: true,
      time, // in milliseconds
    },
  });
  window.close();
}

const startButton = document.getElementById("start");
startButton.addEventListener("click", () => {
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  let time = 0;
  let hoursValue = hours.value ? hours.value : 0;
  let minutesValue = minutes.value ? minutes.value : 0;
  let secondsValue = seconds.value ? seconds.value : 0;
  time += hoursValue * 60 * 60 * 1000; // convert to milliseconds
  time += minutesValue * 60 * 1000; // convert to milliseconds
  time += secondsValue * 1000; // convert to milliseconds
  setTimer(time);
});

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", async () => {
  const tab = await getCurrentTab();
  await chrome.tabs.sendMessage(tab.id, {
    timer: {
      set: false,
    },
  });
});

