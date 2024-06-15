chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ protectionEnabled: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.protectionEnabled?.newValue !== undefined) {
    console.log(`Protection enabled: ${changes.protectionEnabled.newValue}`);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/logo.png',
      title: 'Malicious URL Detected',
      message: `A malicious URL has been detected: ${message.url}`
    });
  }
});
