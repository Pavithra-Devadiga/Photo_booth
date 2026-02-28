const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdownEl = document.getElementById("countdown");
const shutter = document.getElementById("shutter");
const download = document.getElementById("download");

let filter = "none";
let photosTaken = 0;

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

// Set live filter
function setFilter(value) {
  filter = value;
  video.style.filter = value;
}

// Countdown logic
function countdown(seconds) {
  return new Promise(resolve => {
    let i = seconds;
    countdownEl.textContent = i;
    const timer = setInterval(() => {
      i--;
      countdownEl.textContent = i || "";
      if (i <= 0) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

// Start photobooth
async function startBooth() {
  photosTaken = 0;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight * 4;

  for (let i = 0; i < 4; i++) {
    await countdown(3);
    takePhoto(i);
  }

  download.style.display = "block";
  download.href = canvas.toDataURL();
}

// Capture photo
function takePhoto(index) {
  shutter.play();
  ctx.filter = filter;
  ctx.drawImage(
    video,
    0,
    index * video.videoHeight,
    video.videoWidth,
    video.videoHeight
  );
}