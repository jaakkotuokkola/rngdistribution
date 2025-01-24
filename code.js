class HistogramVisualizer {
  constructor() {
    this.animationId = null;
    this.config = {
      barColor: 'rgba(76, 175, 80, 0.8)',
      lineColor: 'rgba(255, 69, 0, 0.8)',
      canvasWidth: 800,
      canvasHeight: 400
    };

    this.initElements();
    this.setupCanvases();
    this.bindEvents();
    this.counterElement = document.getElementById('counter');
    this.rangeInput = document.getElementById('interval');
    this.rangeOutput = document.getElementById('interval-value');

    this.runButton = document.getElementById('run-btn');
    this.btnText = this.runButton.querySelector('.btn-text');
    this.btnLoader = this.runButton.querySelector('.btn-loader');

    this.isAnimating = false;
    this.startTime = null;
    this.framesProcessed = 0;

    this.rangeInput.addEventListener('input', (e) => {
      this.rangeOutput.value = e.target.value;
    });
    this.runButton.addEventListener('click', () => this.handleRunClick());

    this.paused = false;
    this.currentInterval = 0;
  }

  initElements() {
    this.barCanvas = document.getElementById('bar-canvas');
    this.lineCanvas = document.getElementById('line-canvas');
    this.barCtx = this.barCanvas.getContext('2d');
    this.lineCtx = this.lineCanvas.getContext('2d');
    this.runButton = document.querySelector('button');
  }

  setupCanvases() {
    [this.barCanvas, this.lineCanvas].forEach(canvas => {
      canvas.width = this.config.canvasWidth;
      canvas.height = this.config.canvasHeight;
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.setupCanvases());
  }

  resetState() {
    this.data = Array(100).fill(0);
    this.sum = 0;
    this.count = 0;
    this.averages = [];
    this.clearCanvases();
  }

  clearCanvases() {
    this.barCtx.clearRect(0, 0, this.barCanvas.width, this.barCanvas.height);
    this.lineCtx.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
  }

  generateNumber() {
    const value = Math.floor(Math.random() * 100);
    this.data[value]++;
    this.sum += value + 1;
    this.count++;
    this.averages.push(this.sum / this.count);
  }

  drawHistogram() {
    const scaleX = this.barCanvas.width / 100;
    const maxCount = Math.max(...this.data) || 1;
    const scaleY = this.barCanvas.height / maxCount;

    this.data.forEach((count, i) => {
      const barHeight = count * scaleY;
      this.barCtx.fillStyle = this.config.barColor;
      this.barCtx.fillRect(
        i * scaleX,
        this.barCanvas.height - barHeight,
        scaleX - 1,
        barHeight
      );
    });
  }

  drawLineChart() {
    if (this.averages.length === 0) return;

    const scaleX = this.lineCanvas.width / this.averages.length;
    const minAvg = Math.min(...this.averages);
    const maxAvg = Math.max(...this.averages);
    const range = maxAvg - minAvg || 1;
    const scaleY = this.lineCanvas.height / range;

    const gradient = this.lineCtx.createLinearGradient(
      0, 0, 0, this.lineCanvas.height
    );
    gradient.addColorStop(0, 'rgba(255, 69, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 69, 0, 0.05)');

    this.lineCtx.beginPath();
    this.averages.forEach((avg, i) => {
      const y = this.lineCanvas.height - ((avg - minAvg) * scaleY);
      i === 0 
        ? this.lineCtx.moveTo(i * scaleX, y)
        : this.lineCtx.lineTo(i * scaleX, y);
    });
    this.lineCtx.strokeStyle = this.config.lineColor;
    this.lineCtx.lineWidth = 2;
    this.lineCtx.stroke();
  }

  updateCounter(value) {
    this.counterElement.textContent = value.toLocaleString();
  }

  animate(frameCount) {
    this.generateNumber();
    this.clearCanvases();
    this.drawHistogram();
    this.drawLineChart();
    this.updateCounter(frameCount);

    if (frameCount < this.totalFrames) {
      this.animationId = requestAnimationFrame(() => this.animate(++frameCount));
    } else {
      this.stopAnimation();
    }
  }

  startAnimation(totalNumbers, interval) {
    if (this.isAnimating) return;
    
    this.stopAnimation();
    this.resetState();
    this.totalFrames = totalNumbers;
    this.currentInterval = interval;
    
    this.runButton.disabled = false;
    this.btnText.textContent = 'Stop';
    this.btnLoader.hidden = false;
    
    this.isAnimating = true;
    this.startTime = performance.now();
    this.framesProcessed = 0;
    
    this.animationLoop();
  }

  animationLoop() {
    if (!this.isAnimating) return;

    // Get fresh interval value from input
    this.currentInterval = +document.getElementById('interval').value;
    
    const elapsed = performance.now() - this.startTime;
    const targetFrames = this.currentInterval > 0 
      ? Math.floor(elapsed / this.currentInterval)
      : this.totalFrames;

    // Process frames
    const framesToProcess = Math.min(
      targetFrames - this.framesProcessed,
      this.currentInterval === 0 ? this.totalFrames : 100
    );

    for (let i = 0; i < framesToProcess; i++) {
      if (this.framesProcessed >= this.totalFrames) break;
      this.generateNumber();
      this.framesProcessed++;
    }

    // Update visuals
    this.updateCounter(this.framesProcessed);
    this.clearCanvases();
    this.drawHistogram();
    this.drawLineChart();

    // Continue or stop
    if (this.framesProcessed < this.totalFrames) {
      requestAnimationFrame(() => this.animationLoop());
    } else {
      this.stopAnimation();
    }
  }

  stopAnimation() {
    this.isAnimating = false;
    this.btnText.textContent = 'Run';
    this.btnLoader.hidden = true;
    this.runButton.disabled = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  handleRunClick() {
    if (this.isAnimating) {
      this.stopAnimation();
    } else {
      const numRandomNumbers = +document.getElementById('num-random-numbers').value;
      const interval = +document.getElementById('interval').value;
      
      if (numRandomNumbers <= 0 || interval < 0) {
        alert('Please enter valid numbers (interval ≥ 0)');
        return;
      }
      
      this.startAnimation(numRandomNumbers, interval);
    }
  }
}

const visualizer = new HistogramVisualizer();

function generateHistogram() {
  const numRandomNumbers = +document.getElementById('num-random-numbers').value;
  const interval = +document.getElementById('interval').value;

  if (numRandomNumbers <= 0 || interval <= 0) {
    alert('Please enter valid positive numbers');
    return;
  }

  visualizer.startAnimation(numRandomNumbers, interval);
}