import { type ActionData } from "./Action";
import { Calc } from "./Calc";
import { type Point } from "./Track";

export class LevelOne {
  runway: [Point, Point] = [
    { x: -66, y: -111 },
    { x: 132, y: -2 },
  ];
  station1 = { x: 52, y: 120 };
  station2 = { x: -38, y: 68 };
  station3 = { x: -141, y: 2 };
  station4 = { x: -78, y: -91 };

  getActions = () => {
    const actions: ActionData[] = [
      {
        type: "enter",
        enter: { x: -500, y: Calc.randomNumber(-200, 200) },
      },
      {
        type: "land",
        runway: this.runway,
      },
      {
        type: "taxi",
        to: this.station1,
      },
      {
        type: "taxi",
        to: this.station2,
      },
      {
        type: "delay",
        time: 1000,
      },
      {
        type: "taxi",
        to: this.station3,
      },
      {
        type: "taxi",
        to: this.station4,
      },
      {
        type: "hold",
      },
      {
        type: "taxi",
        to: this.runway[0],
      },
      {
        type: "takeoff",
        runway: this.runway,
        exit: { x: 500, y: Calc.randomNumber(-300, 300) },
      },
    ];
    return actions;
  };

  delay() {
    return Calc.randomNumber() * 3000 + 5000;
  }
}
