chrome.storage.local.get("screenshot", (data) => {
  if (data.screenshot) {
    document.getElementById(
      "shot"
    ).innerHTML = `<img src="${data.screenshot}" alt="Screenshot"/>`;
  } else {
    document.getElementById("shot").textContent = "No screenshot found!";
  }
});

// document.addEventListener("DOMContentLoaded", async () => {
//   const dropdown = document.getElementById("tags");

//   try {
//     const response = await fetch(
//       "http://localhost:5118/api/tag/get-all-active-tag",
//       {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       // console.log("✅ API Response:", data);

//       // Clear existing
//       dropdown.innerHTML = '<option value="">-- Select Tag --</option>';

//       // Fill dropdown with TagDtoList
//       if (data.tagDtoList && Array.isArray(data.tagDtoList)) {
//         data.tagDtoList.forEach((tag) => {
//           const option = document.createElement("option");
//           option.value = tag.id; // tag id
//           option.textContent = tag.name; // tag name
//           dropdown.appendChild(option);
//         });
//       } else {
//         dropdown.innerHTML = '<option value="">No tags found</option>';
//       }
//     } else {
//       dropdown.innerHTML = '<option value="">Error loading tags</option>';
//       console.error(
//         "❌ Failed to fetch tags:",
//         response.status,
//         response.statusText
//       );
//     }
//   } catch (err) {
//     dropdown.innerHTML = '<option value="">API Error</option>';
//     // console.error("🚨 API error:", err);
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  const dropdown = document.getElementById("tags");

  try {
    debugger;
    // token get karo storage se
    const { accessToken } = await chrome.storage.local.get("accessToken");

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

      // Reset dropdown
      dropdown.innerHTML = '<option value="">-- Select Tag --</option>';

      // Fill with tags
      if (data.tagDtoList && Array.isArray(data.tagDtoList)) {
        data.tagDtoList.forEach((tag) => {
          const option = document.createElement("option");
          option.value = tag.tagID; // use tag id from DB
          option.textContent = tag.name; // use tag name
          dropdown.appendChild(option);
        });
      } else {
        dropdown.innerHTML = '<option value="">No tags found</option>';
      }
    } else {
      dropdown.innerHTML = '<option value="">Error loading tags</option>';
      console.error(
        "❌ Failed to fetch tags:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    dropdown.innerHTML = '<option value="">API Error</option>';
    console.error("🚨 API error:", err);
  }

  // ✅ Listen for change event to get selected tag
  dropdown.addEventListener("change", () => {
    const selectedTagId = dropdown.value;
    const selectedTagName = dropdown.options[dropdown.selectedIndex].text;

    if (selectedTagId) {
      // alert(`Selected TagId: ${selectedTagId}, Name: ${selectedTagName}`);
      // 👉 you can call another API here with selectedTagId
    }
  });
});

// document.getElementById("screenshot").addEventListener("click", () => {
//   chrome.runtime.sendMessage({ action: "capture" }, (response) => {
//     if (response && response.dataUrl) {
//       console.log("Screenshot captured, but here we’re just showing tags now.");
//     }
//   });
// });

async function handleSubmit() {
  debugger;
  const imgElement = document.querySelector("#shot img");
  const screenshot = imgElement ? imgElement.src : null;

  var tagID = document.getElementById("tags").value;
  var name = document.getElementById("name").value;
  var desc = document.getElementById("message").value;

  // Build payload that matches your TagDto model
  const payload = {
    tagId: tagID,
    name: name,
    desc: desc,
    screenshot: screenshot,
  };

  try {
    // token get karo storage se
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

// function handleSubmit() {
//   debugger;
//   var tagID = document.getElementById("tags").value;
//   var name = document.getElementById("name").value;
//   var desc = document.getElementById("message").value;
// }

document.getElementById("submitBtn").addEventListener("click", handleSubmit);
