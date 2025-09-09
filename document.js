chrome.storage.local.get("savedUrl", function (data) {
  if (data.savedUrl) {
    document.getElementById("link").textContent = data.savedUrl;
  } else {
    document.getElementById("link").textContent = "No link found";
  }
});
