// Background Service Worker for Waqas Mehmood AI Engine
chrome.runtime.onInstalled.addListener(() => {
  console.log('Waqas Mehmood - AI SEO, AEO & GEO Engine installed successfully.');
});

// Listener for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PING') {
    sendResponse({ status: 'PONG', engine: 'Waqas Mehmood AI Engine v1.0' });
  }
  return true;
});
