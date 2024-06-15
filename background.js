chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ protectionEnabled: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.protectionEnabled?.newValue !== undefined) {
    console.log(`Protection enabled: ${changes.protectionEnabled.newValue}`);
  }
});
