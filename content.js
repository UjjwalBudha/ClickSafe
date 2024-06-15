// Function to fetch threat level from local storage
async function fetchThreatLevel(url) {
  try {
    let result = await new Promise((resolve) => {
      chrome.storage.local.get('validatedUrls', (data) => {
        resolve(data.validatedUrls ? data.validatedUrls[url] : 'unknown');
      });
    });
    return result !== 'unknown' ? result : 'unknown';
  } catch (error) {
    console.error('Error fetching threat level:', error);
    return 'unknown';
  }
}

// Function to create and show the threat level indicator
function showThreatLevelIndicator(threatLevel, element) {
  let indicator = document.createElement('div');
  indicator.id = 'threat-level-indicator';

  let color, symbol;
  if (threatLevel === true) {
    color = '#ED5565'; // Grammarly-like red for true (threat)
    symbol = '✗';
  } else if (threatLevel === false) {
    color = '#00A651'; // Grammarly-like green for false (no threat)
    symbol = '✓';
  } else {
    color = '#AAB2BD'; // Grammarly-like gray for unknown
    symbol = '?';
  }

  indicator.style.backgroundColor = color;
  indicator.textContent = symbol;
  indicator.style.fontSize = '20px'; // Make the identifier smaller

  // Position the indicator
  let rect = element.getBoundingClientRect();
  indicator.style.position = 'absolute';
  indicator.style.top = `${rect.top + window.scrollY - 26}px`; // Position just above the link
  indicator.style.left = `${rect.left + window.scrollX + 20}px`; // Align with the start of the link
  indicator.style.width = '24px';
  indicator.style.height = '24px';
  indicator.style.borderRadius = '50%';
  indicator.style.display = 'flex';
  indicator.style.alignItems = 'center';
  indicator.style.justifyContent = 'center';
  indicator.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  indicator.style.color = 'white';
  indicator.style.zIndex = '1000';
  indicator.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

  document.body.appendChild(indicator);

  // Trigger the animation
  setTimeout(() => {
    indicator.style.transform = 'scale(1.1)';
    indicator.style.opacity = '1';
  }, 0);
  setTimeout(() => {
    indicator.style.transform = 'scale(1.0)';
    indicator.style.opacity = '1';
  }, 300);

  // Modify link styling similar to Grammarly's underline approach
  element.style.borderBottom = `2px dotted ${color}`;
  element.parentElement.insertBefore(indicator, element.nextSibling); // Insert indicator after link
}

// Function to remove the threat level indicator and border
function removeThreatLevelIndicator() {
  let indicator = document.getElementById('threat-level-indicator');
  if (indicator) {
    indicator.remove();
  }

  // Remove the indicator styling from the links
  let links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.borderBottom = 'none';
  });
}

// Event listener for mouse over
async function onMouseOver(event) {
  chrome.storage.sync.get('protectionEnabled', async (data) => {
    if (data.protectionEnabled) {
      let target = event.target;
      if (target.tagName.toLowerCase() === 'a') {
        removeThreatLevelIndicator(); // Ensure previous indicators are removed
        let url = target.href;
        let threatLevel = await fetchThreatLevel(url);
        showThreatLevelIndicator(threatLevel, target);
      }
    }
  });
}

// Event listener for mouse out
function onMouseOut(event) {
  let target = event.target;
  if (target.tagName.toLowerCase() === 'a') {
    // Check if the mouse is moving out of a link or its descendants
    if (!event.relatedTarget || !event.relatedTarget.closest('a')) {
      removeThreatLevelIndicator();
    }
  }
}

// Add event listeners
document.addEventListener('mouseover', onMouseOver);
document.addEventListener('mouseout', onMouseOut);

// Listen for messages from the background or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchUrls') {
    const urls = getAllUrls();
    sendResponse({ urls });
  }
});

// Listen for changes in protectionEnabled to dynamically enable/disable functionality
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.protectionEnabled) {
    if (changes.protectionEnabled.newValue) {
      // Re-add event listeners if protection is enabled
      document.addEventListener('mouseover', onMouseOver);
      document.addEventListener('mouseout', onMouseOut);
    } else {
      // Remove event listeners if protection is disabled
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      removeThreatLevelIndicator(); // Clean up any remaining indicators
    }
  }
});

function getAllUrls() {
  const links = Array.from(document.getElementsByTagName('a'));
  const urls = links.map(link => link.href);
  return urls;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchUrls') {
    const urls = getAllUrls();
    sendResponse({ urls });
  }
});

// Function to fetch URLs and send to FastAPI server
async function fetchAndSendUrls() {
  try {
    const urls = getAllUrls();
    const response = await fetch('https://j431gdqv0f.execute-api.us-east-1.amazonaws.com/stage/urlcheck', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({ urls })
    });
    const data = await response.json();
    console.log('Validated URLs:', data);
    // Store the validated URLs locally
    chrome.storage.local.set({ validatedUrls: data });
  } catch (error) {
    console.error('Error fetching and sending URLs:', error);
  }
}

// Event listener for page load or protection toggle
async function onPageLoadOrToggle() {
  chrome.storage.sync.get('protectionEnabled', async (data) => {
    if (data.protectionEnabled) {
      await fetchAndSendUrls();
    }
  });
}

// Listen for page load events
window.addEventListener('load', onPageLoadOrToggle);

// Listen for message from background or popup to fetch URLs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchUrls') {
    fetchAndSendUrls();
  }
});