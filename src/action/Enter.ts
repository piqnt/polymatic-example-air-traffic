/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Point } from "../Track";

export interface EnterActionConfig {
  type: "enter";
  enter: Point;
}

export class EnterAction {
  type = "enter";
  enter: Point;

  start = (item: Plane, d: EnterActionConfig) => {
    this.enter = d.enter;
  };

  tick = (item: Plane) => {
    item.position = {
      x: this.enter.x,
      y: this.enter.y,
    }
    item.action = null;
  };
}
