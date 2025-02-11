export class Calc {
  static randomNumber(min?: number, max?: number) {
    if (typeof min === "undefined") {
      max = 1;
      min = 0;
    } else if (typeof max === "undefined") {
      max = min;
      min = 0;
    }
    return min == max ? min : Math.random() * (max - min) + min;
  }
}