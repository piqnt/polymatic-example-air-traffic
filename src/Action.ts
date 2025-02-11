import { Board } from "./Board";
import { Plane } from "./Plane";
import { BezierTrack, type Point } from "./Track";

export type ActionData =
  | EnterActionData
  | LandActionData
  | TakeoffActionData
  | TaxiActionData
  | DelayActionData
  | HoldActionData;

export abstract class Action {
  started = false;
  done = false;
  board: Board;
  item: Plane;

  start(item: Plane, board: Board) {
    this.started = true;
    this.item = item;
    this.board = board;
  }
  abstract tick: (dt: number) => void;
  click?: () => void;
}

export const createAction = (d: ActionData): Action => {
  switch (d.type) {
    case "enter":
      return new EnterAction(d);
    case "land":
      return new LandAction(d);
    case "takeoff":
      return new TakeoffAction(d);
    case "taxi":
      return new TaxiAction(d);
    case "delay":
      return new DelayAction(d);
    case "hold":
      return new HoldAction(d);
    default: // todo
      throw new Error("Unknown action type");
  }
};

interface EnterActionData {
  type: "enter";
  enter: Point;
}

class EnterAction extends Action {
  enter: Point;

  constructor(d: EnterActionData) {
    super();
    this.enter = d.enter;
  }

  tick = (dt: number) => {
    this.item.x = this.enter.x;
    this.item.y = this.enter.y;
    this.done = true;
  };
}

interface LandActionData {
  type: "land";
  runway: [Point, Point];
}

class LandAction extends Action {
  runway: [Point, Point];
  exit: Point;

  flyPath: BezierTrack;

  landed = false;

  constructor(d: LandActionData) {
    super();
    this.runway = d.runway;
    this.exit = d.runway[1];
  }

  start(item: Plane, board: Board): void {
    super.start(item, board);
    this.flyPath = new BezierTrack([
      this.item,
      this.item,
      {
        x: 2 * this.runway[0].x - 1 * this.runway[1].x,
        y: 2 * this.runway[0].y - 1 * this.runway[1].y,
      },
      this.runway[0],
    ]);
  }

  tick = (dt: number) => {
    if (!this.landed) {
      this.item.z = 1;
      // todo
      const pathCompleted = this.flyPath.step(dt, 0.1);
      this.board.movePlane(this.item, this.flyPath.point);
      if (pathCompleted && !this.item.exploded) {
        this.landed = true;
      }
    } else {
      this.item.z = 0.5;
      this.board.movePlane(this.item, this.runway[1], dt, 0.6);
      // todo
      if (this.item.arrived) {
        this.done = true;
      }
    }
  };
}

interface TakeoffActionData {
  type: "takeoff";
  runway: [Point, Point];
  exit: Point;
}

class TakeoffAction extends Action {
  runway: [Point, Point];
  exit: Point;

  flyPath: BezierTrack;

  flying = false;

  constructor(d: TakeoffActionData) {
    super();
    this.runway = d.runway;
    this.exit = d.exit;
  }

  start(item: Plane, board: Board): void {
    super.start(item, board);
    this.flyPath = new BezierTrack([
      this.runway[1],
      {
        x: 2 * this.runway[1].x - 1 * this.runway[0].x,
        y: 2 * this.runway[1].y - 1 * this.runway[0].y,
      },
      this.exit,
      this.exit,
    ]);
  }

  tick = (dt: number) => {
    this.item.z = 0.5;
    if (!this.flying) {
      this.board.movePlane(this.item, this.runway[1], dt, 2);
      if (this.item.arrived) {
        this.flying = true;
      }
    } else {
      this.item.z = 1;
      const pathCompleted = this.flyPath.step(dt, 0.1);
      this.board.movePlane(this.item, this.flyPath.point);
      if (pathCompleted && !this.item.exploded) {
        this.board.removePlane(this.item);
        this.done = true;
      }
    }
  };
}

interface TaxiActionData {
  type: "taxi";
  to: Point;
}

class TaxiAction extends Action {
  to: Point;

  constructor(d: TaxiActionData) {
    super();
    this.to = d.to;
  }

  tick = (dt: number) => {
    this.item.z = 0;
    this.board.movePlane(this.item, this.to, dt, 0.4);
    // todo
    if (this.item.arrived) {
      this.done = true;
    }
  };
}

interface DelayActionData {
  type: "delay";
  time: number;
}

class DelayAction extends Action {
  time: number;
  constructor(d: DelayActionData) {
    super();
    this.time = d.time;
  }
  tick = (dt: number) => {
    this.item.z = 0;
    this.time -= dt;
    if (this.time <= 0) {
      this.done = true;
    }
  };
}

interface HoldActionData {
  type: "hold";
}

class HoldAction extends Action {
  constructor(d: HoldActionData) {
    super();
  }
  tick = (dt: number) => {
    this.item.z = 0;
  };
  click = () => {
    this.done = true;
  };
}
