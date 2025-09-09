chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      chrome.storage.local.set({ screenshot: dataUrl }, () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("screenshot.html") });
      });
    });
  }
});
