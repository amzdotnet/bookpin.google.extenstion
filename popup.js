document.addEventListener("DOMContentLoaded", async () => {
  const loginDiv = document.getElementById("loginDiv");
  const loggedInDiv = document.getElementById("loggedInDiv");
  const message = document.getElementById("message");

  // Jab popup open ho → token check
  const { accessToken } = await chrome.storage.local.get(["accessToken"]);
  debugger
  if (accessToken) {
    showLoggedIn();
  } else {
    showLogin();
  }

  // Login button
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch("http://localhost:5118/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        debugger
        await chrome.storage.local.set({
          accessToken: data.token,
          // refreshToken: data.refreshToken
        });

        showLoggedIn();
      } else {
        message.innerText = "Invalid credentials!";
      }
    } catch (err) {
      console.error(err);
      message.innerText = "Error connecting to server";
    }
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await chrome.storage.local.remove(["accessToken", "refreshToken"]);
    showLogin();
  });

  function showLogin() {
    loginDiv.style.display = "block";
    loggedInDiv.style.display = "none";
  }

  function showLoggedIn() {
    debugger
    loginDiv.style.display = "none";
    loggedInDiv.style.display = "block";
  }
});



document.getElementById("copyLink").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // ✅ Open your packaged link.html instead of writing new doc
  let newWin = window.open(
    chrome.runtime.getURL("link.html") + "?url=" + encodeURIComponent(tab.url),
    "_blank"
  );
});
// Screenshot Button
document.getElementById("screenshot").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "capture" });
});
