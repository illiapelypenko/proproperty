export const spinner = document.querySelector('.spinner');
const canvas = document.querySelector('.spinner-canvas');
const ctx = canvas.getContext('2d');
const rnd = Math.random() * 10;
let startAngle = 0;
let drawId = 0;
const spinnerX = canvas.width / 2;
const spinnerY = canvas.height / 2;
const lineWidth = 50;

export function drawSpinner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(spinnerX, spinnerY, spinnerX - lineWidth, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = '#32363e';
  ctx.stroke();

  // pink spinner itself
  ctx.beginPath();
  ctx.arc(
    spinnerX,
    spinnerY,
    spinnerX - lineWidth,
    startAngle + rnd,
    1 + startAngle + rnd
  );
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#4aff4a';
  ctx.stroke();
  startAngle += 0.1;
  drawId = requestAnimationFrame(drawSpinner);
}
