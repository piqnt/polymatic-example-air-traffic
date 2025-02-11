/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Point = { x: number; y: number };

export interface Path {
  locate: (t: number, result: Point) => Point;
}

export class Track {
  path: Path;
  speed: number;

  point = { x: 0, y: 0 };
  angle = 0;
  progress = 0;

  // snapshot is used to undo if step is blocked
  private snapshot = {
    point: { x: 0, y: 0 },
    angle: 0,
    progress: 0,
  };

  constructor(path: Path, speed: number) {
    this.path = path;
    this.speed = speed;
  }

  step = (t: number) => {
    this.snapshot.point.x = this.point.x;
    this.snapshot.point.y = this.point.y;
    this.snapshot.progress = this.progress;

    const e = 0.01;

    this.path.locate(this.progress, this.point);
    const x1 = this.point.x;
    const y1 = this.point.y;

    this.path.locate(this.progress + e, this.point);
    const x2 = this.point.x;
    const y2 = this.point.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const stretch = Math.sqrt(dx * dx + dy * dy) / e;

    this.angle = Math.atan2(dy, dx);

    this.progress += (t * this.speed) / stretch;

    this.path.locate(this.progress, this.point);
    return this.progress >= 1;
  };

  undo = () => {
    this.point.x = this.snapshot.point.x;
    this.point.y = this.snapshot.point.y;
    this.angle = this.snapshot.angle;
    this.progress = this.snapshot.progress;
  };
}

export class LinePath implements Path {
  a = { x: 0, y: 0 };
  b = { x: 0, y: 0 };

  constructor(ps: [Point, Point]) {
    this.b.x = ps[0].x;
    this.b.y = ps[0].y;
    this.a.x = ps[1].x - ps[0].x;
    this.a.y = ps[1].y - ps[0].y;
  }

  locate = (p: number, point = { x: 0, y: 0 }) => {
    const x = this.b.x + p * this.a.x;
    const y = this.b.y + p * this.a.y;
    point.x = x;
    point.y = y;
    return point;
  };
}

export class BezierPath implements Path {
  a = { x: 0, y: 0 };
  b = { x: 0, y: 0 };
  c = { x: 0, y: 0 };
  d = { x: 0, y: 0 };

  constructor(ps: [Point, Point, Point, Point]) {
    if (!ps || !ps.length) {
      throw new Error("Invalid points");
    }

    this.d.x = ps[0].x;
    this.d.y = ps[0].y;

    this.c.x = 3 * (ps[1].x - ps[0].x);
    this.c.y = 3 * (ps[1].y - ps[0].y);

    this.b.x = 3 * (ps[2].x - ps[1].x) - this.c.x;
    this.b.y = 3 * (ps[2].y - ps[1].y) - this.c.y;

    this.a.x = ps[3].x - ps[0].x - this.c.x - this.b.x;
    this.a.y = ps[3].y - ps[0].y - this.c.y - this.b.y;
  }

  locate = (p: number, point = { x: 0, y: 0 }) => {
    const t2 = p * p;
    const t3 = p * p * p;
    const x = this.a.x * t3 + this.b.x * t2 + this.c.x * p + this.d.x;
    const y = this.a.y * t3 + this.b.y * t2 + this.c.y * p + this.d.y;
    point.x = x;
    point.y = y;
    return point;
  };
}
