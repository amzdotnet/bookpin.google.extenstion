document.addEventListener("DOMContentLoaded", async () => {
  // ✅ read URL passed from popup.js
  const params = new URLSearchParams(window.location.search);
  const pageUrl = params.get("url");
  if (pageUrl) {
    document.getElementById("pageLink").textContent = pageUrl;
  }

  // ✅ fetch tags from your API
  const dropdown = document.getElementById("tags");
  try {
    const { accessToken } = await chrome.storage.local.get("accessToken");
    debugger;
    if (!accessToken) {
      alert("🚨 No token found. Please login first!");
      return;
    }
    const response = await fetch(
      "http://localhost:5118/api/tag/get-all-active-tag",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ yahan token add
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      dropdown.innerHTML = '<option value="">-- Select Tag --</option>';
      if (data.tagDtoList && Array.isArray(data.tagDtoList)) {
        data.tagDtoList.forEach((tag) => {
          const option = document.createElement("option");
          option.value = tag.tagID;
          option.textContent = tag.name;
          dropdown.appendChild(option);
        });
      }
    } else {
      dropdown.innerHTML = '<option value="">Error loading tags</option>';
    }
  } catch (err) {
    console.error("API error:", err);
    dropdown.innerHTML = '<option value="">API Error</option>';
  }
});

async function handleSubmit() {
  debugger;

  var link = document.getElementById("pageLink").textContent;
  var tagID = document.getElementById("tags").value;
  var name = document.getElementById("name").value;
  var desc = document.getElementById("message").value;

  // Build payload that matches your TagDto model
  const payload = {
    tagId: tagID,
    name: name,
    desc: desc,
    link: link,
  };

  try {
    const { accessToken } = await chrome.storage.local.get("accessToken");
    if (!accessToken) {
      alert("🚨 No token found. Please login first!");
      return;
    }
    const response = await fetch(
      "http://localhost:5118/api/userTag/post-user-tag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 👈 token add here
        },
        body: JSON.stringify(payload),
        Authorization: `Bearer ${accessToken}`, // 👈 token add here
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert("✅ Tag submitted successfully!");
      console.log("Response:", result);
    } else {
      const errorText = await response.text();
      console.error("❌ API error:", errorText);
      alert("❌ Failed: " + response.status);
    }
  } catch (err) {
    console.error("🚨 Network error:", err);
    alert("🚨 Error submitting tag");
  }
}

document.getElementById("submitBtn").addEventListener("click", handleSubmit);
