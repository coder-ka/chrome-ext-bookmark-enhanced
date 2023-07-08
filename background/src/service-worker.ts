let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

// chrome.commands.onCommand.addListener(async (command) => {
//   if (command === "add-bookmark") {
//     const selectedTabs = await chrome.tabs.query({
//       currentWindow: true,
//       highlighted: true,
//     });

//     console.log(selectedTabs);

//     const activeTab = selectedTabs.find((x) => x.active);
//     if (activeTab === undefined) return;
//   }
// });
