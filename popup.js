document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const scannedUrlList = document.getElementById('scannedUrlList');
  const malwareUrlList = document.getElementById('malwareUrlList');
  const toggleScannedUrlsButton = document.getElementById('toggleScannedUrlsButton');
  const toggleMalwareUrlsButton = document.getElementById('toggleMalwareUrlsButton');
  const notificationBell = document.getElementById('notificationBell');

  // Get the current state of protection and notification settings
  chrome.storage.sync.get(['protectionEnabled', 'notificationsEnabled'], data => {
    toggle.checked = data.protectionEnabled !== undefined ? data.protectionEnabled : true;
    if (toggle.checked) {
      fetchUrlsAndDisplay();
    }
    if (data.notificationsEnabled !== undefined ? data.notificationsEnabled : true) {
      notificationBell.src = 'icons/bell_on.png';
      notificationBell.classList.add('active');
    } else {
      notificationBell.src = 'icons/bell_off.png';
      notificationBell.classList.remove('active');
    }
  });

  // Add event listener for toggle switch
  toggle.addEventListener('change', () => {
    const protectionEnabled = toggle.checked;
    chrome.storage.sync.set({ protectionEnabled }, () => {
      if (protectionEnabled) {
        fetchUrlsAndDisplay();
      } else {
        scannedUrlList.innerHTML = '';
        malwareUrlList.innerHTML = '';
      }
    });
  });

  // Add event listener for notification bell
  notificationBell.addEventListener('click', () => {
    chrome.storage.sync.get('notificationsEnabled', data => {
      const notificationsEnabled = data.notificationsEnabled !== undefined ? data.notificationsEnabled : true;
      const newNotificationsEnabled = !notificationsEnabled;
      chrome.storage.sync.set({ notificationsEnabled: newNotificationsEnabled }, () => {
        if (newNotificationsEnabled) {
          notificationBell.src = 'icons/bell_on.png';
          notificationBell.classList.add('active');
        } else {
          notificationBell.src = 'icons/bell_off.png';
          notificationBell.classList.remove('active');
        }
      });
    });
  });

  // Add event listener for toggling scanned URLs visibility
  toggleScannedUrlsButton.addEventListener('click', () => {
    toggleListVisibility(scannedUrlList, malwareUrlList, toggleScannedUrlsButton, 'Scanned');
  });

  // Add event listener for toggling malware URLs visibility
  toggleMalwareUrlsButton.addEventListener('click', () => {
    toggleListVisibility(malwareUrlList, scannedUrlList, toggleMalwareUrlsButton, 'Malware');
  });

  // Function to fetch URLs
  function fetchUrls() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchUrls' }, (response) => {
          if (response && response.urls) {
            resolve(response.urls);
          } else {
            reject('No URLs found.');
          }
        });
      });
    });
  }

  // Function to send URLs to FastAPI server for validation
  function validateUrls(urls) {
    return fetch('https://j431gdqv0f.execute-api.us-east-1.amazonaws.com/stage/urlcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: JSON.stringify({ urls }),
    }).then(response => response.json());
  }

  // Function to fetch URLs and display them
  function fetchUrlsAndDisplay() {
    fetchUrls()
      .then(validateUrls)
      .then(validatedUrls => {
        updateScannedUrls(validatedUrls);
        displayMaliciousUrls(validatedUrls);
      })
      .catch(error => console.error('Error fetching and displaying URLs:', error));
  }

  // Function to display only safe URLs in the scanned URLs section
  function updateScannedUrls(validatedUrls) {
    scannedUrlList.innerHTML = '';
    for (const url in validatedUrls) {
      if (!validatedUrls[url]) { // Only display safe URLs
        const urlItem = document.createElement('p');
        urlItem.textContent = `${url} - Safe`;
        urlItem.className = 'scanned-url';
        scannedUrlList.appendChild(urlItem);
      }
    }
  }

  // Function to update and display only malicious URLs
  function displayMaliciousUrls(validatedUrls) {
    malwareUrlList.innerHTML = '';
    for (const url in validatedUrls) {
      if (validatedUrls[url]) { // Only display malicious URLs
        const urlItem = document.createElement('a');
        urlItem.href = url;
        urlItem.textContent = url;
        urlItem.className = 'malware-url';
        urlItem.style.color = 'red'; // Style the link to indicate it's malicious
        urlItem.target = '_blank'; // Open the link in a new tab
        malwareUrlList.appendChild(urlItem);
        const breakLine = document.createElement('br');
        malwareUrlList.appendChild(breakLine); // Add a break line for better readability
      }
    }
  }

  // Function to toggle list visibility
  function toggleListVisibility(listToShow, listToHide, button, type) {
    if (listToShow.style.display === 'none' || listToShow.style.display === '') {
      listToShow.style.display = 'block';
      listToHide.style.display = 'none';
      button.textContent = `Hide ${type} URLs`;
    } else {
      listToShow.style.display = 'none';
      button.textContent = `Show ${type} URLs`;
    }
  }
});
