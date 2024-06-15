chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ protectionEnabled: true, notificationsEnabled: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    if (changes.protectionEnabled?.newValue !== undefined) {
      console.log(`Protection enabled: ${changes.protectionEnabled.newValue}`);
    }
    if (changes.notificationsEnabled?.newValue !== undefined) {
      console.log(`Notifications enabled: ${changes.notificationsEnabled.newValue}`);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notify') {
    chrome.storage.sync.get('notificationsEnabled', data => {
      if (data.notificationsEnabled) {
        const urls = message.urls.join('\n');
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/logo.png',
          title: 'Malicious URL Detected',
          message: `A malicious URL has been detected:\n${urls}`,
          buttons: [{ title: 'Dismiss' }],
          priority: 2
        });
      }
    });
  }
});
