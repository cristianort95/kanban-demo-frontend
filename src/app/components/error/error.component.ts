import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.sass'
})
export class ErrorComponent implements AfterViewInit {
  @ViewChild('visor') visor?: ElementRef<HTMLCanvasElement>;
  @ViewChild('cord') cord?: ElementRef<HTMLCanvasElement>;
  y1 = 160;
  y2 = 100;
  y3 = 100;

  y1Forward = true;
  y2Forward = false;
  y3Forward = true;
  constructor() {
  }

  ngAfterViewInit() {
    this.drawVisor();
    this.animate();
  }

  drawVisor = () => {
    const ctx = this.visor?.nativeElement.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(5, 45);
      ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);

      ctx.lineTo(55, 20);
      ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);

      ctx.lineTo(15, 10);

      ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
      ctx.lineTo(5, 45);

      ctx.fillStyle = '#2f3640';
      ctx.strokeStyle = '#f5f6fa';
      ctx.fill();
      ctx.stroke();
    }
  }

  animate = () => {
    const ctx = this.cord?.nativeElement.getContext("2d");
    if (ctx) {
      requestAnimationFrame(this.animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      ctx.beginPath();
      ctx.moveTo(130, 170);
      ctx.bezierCurveTo(250, this.y1, 345, this.y2, 400, this.y3);

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 8;
      ctx.stroke();


      if (this.y1 === 100) {
        this.y1Forward = true;
      }

      if (this.y1 === 300) {
        this.y1Forward = false;
      }

      if (this.y2 === 100) {
        this.y2Forward = true;
      }

      if (this.y2 === 310) {
        this.y2Forward = false;
      }

      if (this.y3 === 100) {
        this.y3Forward = true;
      }

      if (this.y3 === 317) {
        this.y3Forward = false;
      }

      this.y1Forward ? this.y1 += 1 : this.y1 -= 1;
      this.y2Forward ? this.y2 += 1 : this.y2 -= 1;
      this.y3Forward ? this.y3 += 1 : this.y3 -= 1;
    }
  }

}
