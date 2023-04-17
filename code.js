
//histogram
let intervalId;

function generateHistogram() {
  if (intervalId) clearInterval(intervalId);

  const numRandomNumbers = parseInt(document.getElementById("num-random-numbers").value);
  const interval = parseInt(document.getElementById("interval").value);
  const data = Array.from({length: 100}, () => 0);

  const canvas = document.getElementById("histogram");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let i = 0;
  intervalId = setInterval(() => {
    if (i >= numRandomNumbers) {
      clearInterval(intervalId);
      return;
    }

    const val = Math.floor(Math.random() * 100) + 1;
    data[val - 1] += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxY = numRandomNumbers / 100;
    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / maxY;

    for (let j = 0; j < 100; j++) {
      ctx.beginPath();
      ctx.rect(j * scaleX, canvas.height - data[j] * scaleY, scaleX, data[j] * scaleY);
      ctx.fillStyle = "black";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }

    // line that follows the distribution averages
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (data[0] / maxY) * canvas.height);

    for (let j = 1; j < 100; j++) {
      const avg = data.slice(0, j+1).reduce((a, b) => a + b, 0) / (j+1);
      ctx.lineTo(j * scaleX, canvas.height - (avg / maxY) * canvas.height);
    }

    ctx.strokeStyle = "orangered";
    ctx.lineWidth = 4;
    ctx.stroke();
    i++;
  }, interval);
}
