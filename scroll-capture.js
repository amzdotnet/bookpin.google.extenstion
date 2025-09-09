(async () => {
  const body = document.body;
  const html = document.documentElement;

  const totalWidth = Math.max(body.scrollWidth, html.scrollWidth);
  const totalHeight = Math.max(body.scrollHeight, html.scrollHeight);

  const viewportHeight = window.innerHeight;
  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const context = canvas.getContext("2d");

  let y = 0;

  while (y < totalHeight) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 300));

    const shot = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: "capture" }, (response) => {
        resolve(response.dataUrl);
      });
    });

    const img = new Image();
    img.src = shot;
    await img.decode();
    context.drawImage(img, 0, y);

    y += viewportHeight;
  }

  window.scrollTo(0, 0); // back to top

  const finalImage = canvas.toDataURL("image/png");
  chrome.storage.local.set({ screenshot: finalImage }, () => {
    chrome.runtime.sendMessage({ action: "openScreenshot" });
  });
})();
