/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { LinePath, Track, type Point } from "../Track";

export interface TaxiActionConfig {
  type: "taxi";
  to: Point;
}

export class TaxiAction {
  type = "taxi";
  taxiPath: Track;

  start = (item: Plane, d: TaxiActionConfig) => {
    this.taxiPath = new Track(new LinePath([item.position, d.to]), 0.05);
  };

  tick = (item: Plane) => {
    if (this.taxiPath.progress < 1) {
      item.z = 0;
      item.track = this.taxiPath;
    } else {
      item.track = null;
      item.action = null;
    }
  };
}
