/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { BezierPath, LinePath, Track, type Point } from "../Track";

export interface LandActionConfig {
  type: "arrival";
  runway: [Point, Point];
}

export class ArrivalAction {
  type = "arrival";
  flyPath: Track;
  taxiPath: Track;

  start = (item: Plane, d: LandActionConfig) => {
    this.flyPath = new Track(
      new BezierPath([
        item.position,
        item.position,
        {
          x: 2 * d.runway[0].x - 1 * d.runway[1].x,
          y: 2 * d.runway[0].y - 1 * d.runway[1].y,
        },
        d.runway[0],
      ]),
      0.1
    );
    this.taxiPath = new Track(new LinePath([d.runway[0], d.runway[1]]), 0.06);
  };

  tick = (item: Plane) => {
    if (this.flyPath.progress < 1) {
      item.z = 1;
      item.track = this.flyPath;
    } else if (this.taxiPath.progress < 1) {
      item.z = 0.5;
      item.track = this.taxiPath;
    } else {
      item.track = null;
      item.action = null;
    }
  };
}
