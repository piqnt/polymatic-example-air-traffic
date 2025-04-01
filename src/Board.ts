/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { Plane } from "./Plane";
import { ActionFactory } from "./Action";

/**
 * Manages actions and movements.
 */
export class Board extends Middleware<MainContext> {
  globalTime = 0;
  nextPlaneTime = 0;

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("terminal-tick", this.handleTick);
    this.on("user-click-plane", this.handleClickPlane);
    this.on("user-click", this.handleClick);
  }

  handleActivate = () => {
    this.context.items = [];
  };

  handleTick = (dt: number) => {
    for (let i = 0; i < this.context.items.length; i++) {
      let item = this.context.items[i];
      this.takeAction(item, dt);
    }

    for (let i = 0; i < this.context.items.length; i++) {
      let item = this.context.items[i];
      this.moveEntity(item, dt);
    }

    for (let i = this.context.items.length - 1; i >= 0; i--) {
      let item = this.context.items[i];
      if (item.delete) this.context.items.splice(i, 1);
    }
  };

  takeAction = (item: Plane, dt: number) => {
    if (!item.action && item.actions.length) {
      const config = item.actions.shift();
      const factory = ActionFactory[config.type];
      if (factory) {
        item.action = factory();
        item.action.start(item, config as any);
      } else {
        console.log("Unknown action type", config.type);
      }
    }

    item.action?.tick(item, dt);
  };

  handleClick = () => {
    const plane = this.context.items?.find((item) => item.type === "plane");
    if (plane) this.handleClickPlane(plane);
  };

  handleClickPlane = (item: Plane) => {
    item.action?.click?.(item);
  };

  moveEntity = (plane: Plane, dt: number) => {
    if (!plane.track) return;

    plane.track.step(dt);

    for (let i = 0; i < this.context.items.length; i++) {
      let other = this.context.items[i];
      if (plane == other) continue;
      const dx = plane.track.point.x - other.position.x;
      const dy = plane.track.point.y - other.position.y;
      const d = dx * dx + dy * dy;
      const contact = d < plane.radius + other.radius;
      if (contact) {
        if (plane.z == 0 && other.z == 0) {
          // both on the ground, undo step
          plane.track.undo();
        } else {
          plane.exploded = true;
          other.exploded = true;
          plane.delete = true;
          other.delete = true;
        }
        return;
      }
    }

    plane.angle = plane.track.angle;
    plane.position.x = plane.track.point.x;
    plane.position.y = plane.track.point.y;
  };
}
