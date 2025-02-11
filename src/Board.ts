import { Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { LevelOne } from "./Level";
import { Plane } from "./Plane";
import { createAction } from "./Action";
import { type Point } from "./Track";

export class Board extends Middleware<MainContext> {
  level: LevelOne;

  items: Plane[] = [];
  deleted = [];

  globalTime = 0;
  nextPlaneTime = 0;

  constructor() {
    super();
    this.level = new LevelOne();
    this.on("activate", this.handleActivate);
    this.on("terminal-tick", this.handleTick);
    this.on("user-click-plane", this.handleClickPlane);
  }

  handleActivate = () => {
    this.context.items = this.items;
  };

  handleTick = (dt: number) => {
    this.globalTime += dt;

    if (this.globalTime > this.nextPlaneTime) {
      this.addPlane(new Plane());
      this.nextPlaneTime += this.level.delay();
    }

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this.tickAction(item, dt);
    }

    let obj: Plane;
    while ((obj = this.deleted.pop())) {
      let i = this.items.indexOf(obj);
      if (i >= 0) {
        this.items.splice(i, 1);
      }
    }
  };

  handleClickPlane = (plane: Plane) => {
    plane.action?.click?.();
  };

  addPlane = (plane: Plane) => {
    plane.actions = this.level.getActions();
    this.items.push(plane);
  };

  removePlane = (plane: Plane) => {
    this.deleted.push(plane);
  };

  tickAction = (plane: Plane, dt: number) => {
    if (!plane.action && plane.actions.length) {
      const action = createAction(plane.actions.shift());
      action.start(plane, this);
      plane.action = action;
    }
    if (plane.action) {
      plane.action.tick(dt);
      if (plane.action.done) {
        plane.action = null;
      }
    }
  };

  movePlane = (plane: Plane, target: Point, dt?: number, speed?: number) => {
    let nx: number;
    let ny: number;
    if (typeof dt == "number" && typeof speed == "number") {
      let dx = target.x - plane.x;
      let dy = target.y - plane.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      let m = (plane.s * speed * dt) / d;
      if (m >= 1) {
        nx = target.x;
        ny = target.y;
      } else {
        nx = plane.x + dx * m;
        ny = plane.y + dy * m;
      }
      // todo
      plane.arrived = m >= 1;
    } else {
      nx = target.x;
      ny = target.y;
    }

    let dx = nx - plane.x;
    let dy = ny - plane.y;
    plane.a = Math.atan2(dy, dx);

    for (let i = 0; i < this.items.length; i++) {
      let that = this.items[i];
      if (plane == that) {
        continue;
      }
      dx = nx - that.x;
      dy = ny - that.y;
      if (dx * dx + dy * dy < 240) {
        if (plane.z == 0 && that.z == 0) {
          plane.blocked = true;
          return;
        } else {
          plane.exploded = true;
          that.exploded = true;
          this.removePlane(plane);
          this.removePlane(that);
          return;
        }
      }
    }
    plane.x = nx;
    plane.y = ny;
    plane.blocked = false;
  };
}
