export function createSpinner(spinnerQuerySelector, canvasQuerySelector) {
  const SPINNER = document.querySelector(spinnerQuerySelector);
  const CANVAS = document.querySelector(canvasQuerySelector);
  const ctx = CANVAS.getContext('2d');
  const rnd = Math.random() * 10;
  let startAngle = 0;
  let drawId = 0;
  const spinnerX = CANVAS.width / 2;
  const spinnerY = CANVAS.height / 2;
  const lineWidth = 50;

  function drawSpinner() {
    // inner circle
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.beginPath();
    ctx.arc(spinnerX, spinnerY, spinnerX - lineWidth, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#32363e';
    ctx.stroke();

    // spinner itself
    ctx.beginPath();
    ctx.arc(spinnerX, spinnerY, spinnerX - lineWidth, startAngle + rnd, 1 + startAngle + rnd);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#9f98ff';
    ctx.stroke();
    startAngle += 0.1;
    drawId = requestAnimationFrame(drawSpinner);
  }

  drawSpinner();

  return function setSpinner(show) {
    if (show) {
      SPINNER.style.display = 'flex';
      SPINNER.classList.remove('spinner--hide');
    } else {
      SPINNER.classList.add('spinner--hide');
      SPINNER.style.display = 'none';
    }
  };
}
