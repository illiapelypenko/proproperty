import {
  propertySpinnerContainer,
  propertySpinnerCanvas,
  searchSpinnerContainer,
  searchSpinnerCanvas,
} from './elements';

class Spinner {
  drawId = 0;
  startAngle = 0;
  rnd = Math.random() * 10;

  constructor(spinner, canvas) {
    this.spinner = spinner;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.spinnerX = this.canvas.width / 2;
    this.spinnerY = this.canvas.height / 2;
  }

  draw = () => {
    const lineWidth = 50;

    // inner circle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(
      this.spinnerX,
      this.spinnerY,
      this.spinnerX - lineWidth,
      0,
      2 * Math.PI
    );
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = '#32363e';
    this.ctx.stroke();

    // spinner itself
    this.ctx.beginPath();
    this.ctx.arc(
      this.spinnerX,
      this.spinnerY,
      this.spinnerX - lineWidth,
      this.startAngle + this.rnd,
      1 + this.startAngle + this.rnd
    );
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#9f98ff';
    this.ctx.stroke();
    this.startAngle += 0.1;
    this.drawId = requestAnimationFrame(this.draw);
  };

  toogleVisibility(show) {
    if (show) {
      this.draw();
      this.spinner.style.display = 'flex';
      this.spinner.classList.remove('spinner--hide');
    } else {
      this.spinner.classList.add('spinner--hide'); // for opacity transition before hiding
      this.spinner.style.display = 'none';
      cancelAnimationFrame(this.drawId);
    }
  }
}

export const propertySpinner = new Spinner(
  propertySpinnerContainer,
  propertySpinnerCanvas
);
export const searchSpinner = new Spinner(
  searchSpinnerContainer,
  searchSpinnerCanvas
);