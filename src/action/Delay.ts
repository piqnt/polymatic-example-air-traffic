/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";

export interface DelayActionConfig {
  type: "delay";
  time: number;
}

export class DelayAction {
  type = "delay";
  time: number;

  start = (item: Plane, d: DelayActionConfig) => {
    this.time = d.time;
  };

  tick = (item: Plane, dt: number) => {
    item.z = 0;
    this.time -= dt;
    if (this.time <= 0) {
      item.action = null;
    }
  };
}
