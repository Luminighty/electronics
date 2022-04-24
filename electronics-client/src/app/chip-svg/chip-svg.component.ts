import { Component, Input, OnInit } from '@angular/core';

interface PinData {
  label: string,
  textAnchor: string,
  isRightSide: boolean,
  x: number,
  y: number,
}

@Component({
  selector: 'app-chip-svg',
  templateUrl: './chip-svg.component.html',
  styleUrls: ['./chip-svg.component.scss']
})
export class ChipSvgComponent implements OnInit {
  @Input() public pins: string[] = [];
  pinData: PinData[] = [];

  pinLabelMaxLength = 0;
  pathData = "";

  PINSIZE = 10;
  CHIP_CHAR_WIDTH = 15;
  LABEL_OFFSET = 5;

  WIDTH = 75;
  OFFSET_Y = 20;
  PADDING_Y = 25;

  HEIGHT = 0;
  OFFSET_X = 0;

  constructor() { }

  ngOnInit(): void {
    this.render();
  }

  render(): void {
    this.pinLabelMaxLength = this.pins.reduce((max, label) => (max < label.length) ? label.length : max, 0);
    this.HEIGHT = this.OFFSET_Y + (Math.ceil(this.pins.length / 2)-0.5) * this.PADDING_Y;
    this.OFFSET_X = this.CHIP_CHAR_WIDTH * this.pinLabelMaxLength - this.PINSIZE + this.LABEL_OFFSET;
    this.pinData = this.pins.map((pin, index) => {
      let isRightSide = this.isRightSide(index);
      return {
        label: pin,
        isRightSide,
        x: this.pinX(index) + this.OFFSET_X,
        y: this.pinY(index) + this.OFFSET_Y,
        textAnchor: isRightSide ? "start" : "end",
      }
    });

    this.pathData = `M${this.OFFSET_X + (this.WIDTH+this.PINSIZE)/4},${1 + this.OFFSET_Y - this.PINSIZE} a1,1 0,0 0 ${(this.WIDTH+this.PINSIZE)/2},0`;
  }

  isRightSide(index: number): boolean {
    return index >= Math.floor(this.pins.length / 2);
  }

  pinX(index: number): number {
    if (this.isRightSide(index))
      return this.WIDTH;
    return 0;
  }

  ngOnChanges() {
    this.render();
  }

  pinY(index: number): number {
    if (this.isRightSide(index))
      index = (this.pins.length - 1) - index;
    return index * this.PADDING_Y;
  }

}
