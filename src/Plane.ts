/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type ActionConfig, type Action } from "./Action";
import { type Track } from "./Track";

export class Plane {
  key = "plane-" + Math.random();
  type = "plane";

  radius = 120; // used for collision

  position: {x: number, y: number} = null;
  z = 0; // elevation, for collision
  angle = 0;
  speed = 0.1;

  exploded = false;

  actions: ActionConfig[] = [];
  action: Action | null = null;

  track: Track | null;
  delete: boolean;
}
