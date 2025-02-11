import { type ActionData, type Action } from "./Action";

export class Plane {
  key = "plane-" + Math.random();
  type = "plane";

  x = 0;
  y = 0;
  z = 0; // elevation, for collision
  a = 0; // angle
  s = 0.1; // speed

  exploded = false;
  blocked = false;
  arrived = false;

  actions: ActionData[] = [];
  action: Action;
}
