(async () => {
  const body = document.body;
  const html = document.documentElement;

  const totalHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  const viewportHeight = window.innerHeight;

  let y = 0;
  let images = [];

  while (y < totalHeight) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 400)); // wait for scroll to settle

    const dataUrl = await chrome.runtime.sendMessage({ action: "capture" });
    images.push({ y, dataUrl });

    y += viewportHeight;
  }

  // Send all images to background for stitching
  chrome.runtime.sendMessage({ action: "stitch", images, totalHeight, width: window.innerWidth });
})();
