const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdownEl = document.getElementById("countdown");
const shutter = document.getElementById("shutter");
const download = document.getElementById("download");
const captureBtn = document.querySelector(".capture");

let currentFilter = "none";
let photoCount = 0;
let w, h;

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("Camera permission denied"));

// Apply live filter
function setFilter(filter) {
  currentFilter = filter;
  video.style.filter = filter;
}

// Start PhotoBooth
async function startBooth() {
  photoCount = 0;
  download.style.display = "none";
  captureBtn.style.display = "inline-block";

  if (video.videoWidth === 0) {
    await new Promise(res => video.onloadedmetadata = res);
  }

  w = video.videoWidth;
  h = video.videoHeight;

  canvas.width = w;
  canvas.height = h * 4;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Countdown
function runCountdown(seconds) {
  return new Promise(resolve => {
    let t = seconds;
    countdownEl.style.display = "flex";
    countdownEl.textContent = t;

    const timer = setInterval(() => {
      t--;
      countdownEl.textContent = t;
      if (t === 0) {
        clearInterval(timer);
        countdownEl.style.display = "none";
        resolve();
      }
    }, 1000);
  });
}

// Capture photo step-by-step
async function captureStep() {
  if (photoCount >= 4) return;

  await runCountdown(3);

  shutter.currentTime = 0;
  shutter.play();

  ctx.filter = currentFilter;
  ctx.drawImage(video, 0, photoCount * h, w, h);

  photoCount++;

  if (photoCount === 4) {
    captureBtn.style.display = "none";
    download.href = canvas.toDataURL("image/png");
    download.style.display = "block";
  }
}
