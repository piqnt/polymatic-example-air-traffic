/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { BezierPath, LinePath, Track, type Point } from "../Track";

export interface TakeoffActionConfig {
  type: "departure";
  runway: [Point, Point];
  exit: Point;
}

export class DepartureAction {
  type = "departure";
  taxiPath: Track;
  flyPath: Track;

  start = (item: Plane, d: TakeoffActionConfig) => {
    this.taxiPath = new Track(new LinePath([d.runway[0], d.runway[1]]), 0.09);
    this.flyPath = new Track(
      new BezierPath([
        d.runway[1],
        {
          x: 2 * d.runway[1].x - 1 * d.runway[0].x,
          y: 2 * d.runway[1].y - 1 * d.runway[0].y,
        },
        d.exit,
        d.exit,
      ]),
      0.1
    );
  };

  tick = (item: Plane) => {
    if (this.taxiPath.progress < 1) {
      item.z = 0.5;
      item.track = this.taxiPath;
    } else if (this.flyPath.progress < 1) {
      item.z = 1;
      item.track = this.flyPath;
    } else {
      item.track = null;
      item.delete = true;
      item.action = null;
    }
  };
}
