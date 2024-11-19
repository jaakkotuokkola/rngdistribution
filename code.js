let intervalId;

function generateHistogram() {
  if (intervalId) clearInterval(intervalId);

  const numRandomNumbers = +document.getElementById("num-random-numbers").value;
  const interval = +document.getElementById("interval").value;
  const data = Array(100).fill(0);

  const barCanvas = document.getElementById("bar-canvas");
  const lineCanvas = document.getElementById("line-canvas");

  barCanvas.width = 500;
  barCanvas.height = 300;
  lineCanvas.width = 500;
  lineCanvas.height = 300;

  const barCtx = barCanvas.getContext("2d");
  const lineCtx = lineCanvas.getContext("2d");
  barCtx.clearRect(0, 0, barCanvas.width, barCanvas.height);
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

  let i = 0;
  intervalId = setInterval(() => {
    if (i >= numRandomNumbers) return clearInterval(intervalId);

    // update histogram data
    data[Math.floor(Math.random() * 100)]++;

    const scaleX = barCanvas.width / 100;
    const scaleY = barCanvas.height / (numRandomNumbers / 100);

    // draw histogram bars
    barCtx.clearRect(0, 0, barCanvas.width, barCanvas.height);
    data.forEach((count, j) => {
      const barHeight = count * scaleY;
      barCtx.fillStyle = "black";
      barCtx.strokeStyle = "black";
      barCtx.fillRect(j * scaleX, barCanvas.height - barHeight, scaleX, barHeight);
      barCtx.strokeRect(j * scaleX, barCanvas.height - barHeight, scaleX, barHeight);
    });

    // draw cumulative average line and gradient under the line
    lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    let cumulativeSum = 0;
    const gradient = lineCtx.createLinearGradient(0, 0, 0, lineCanvas.height);

    // gradient color stops
    gradient.addColorStop(0, "rgba(255, 69, 0, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");

    lineCtx.beginPath();
    data.forEach((count, j) => {
      cumulativeSum += count;
      const avg = cumulativeSum / (j + 1);
      lineCtx.lineTo(j * scaleX, lineCanvas.height - avg * scaleY);
    });

    // fill area  with gradient
    lineCtx.lineTo(99 * scaleX, lineCanvas.height);
    lineCtx.lineTo(0, lineCanvas.height);
    lineCtx.closePath();

    lineCtx.fillStyle = gradient;
    lineCtx.fill();

    // draw cumulative average line
    lineCtx.strokeStyle = "orangered";
    lineCtx.lineWidth = 4;
    lineCtx.stroke();

    i++;
  }, interval);
}
