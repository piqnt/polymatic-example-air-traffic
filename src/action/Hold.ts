/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";

export interface HoldActionConfig {
  type: "hold";
}

export class HoldAction {
  type = "hold";

  start = (item: Plane, d: HoldActionConfig) => {
  };

  tick = (item: Plane) => {
    item.z = 0;
  };

  click = (item: Plane) => {
    item.action = null;
  };
}
