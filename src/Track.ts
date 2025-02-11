export type Point = { x: number; y: number };

abstract class Track {
  point = { x: 0, y: 0 };
  prog = 0;

  step = (t: number, speed: number) => {
    // todo: use current point to calculate stretch?
    // todo: record angle here

    const e = 0.01;

    this.locate(this.prog, this.point);
    let x1 = this.point.x;
    let y1 = this.point.y;

    this.locate(this.prog + e, this.point);
    let x2 = this.point.x;
    let y2 = this.point.y;

    let dx = x2 - x1;
    let dy = y2 - y1;
    const stretch = Math.sqrt(dx * dx + dy * dy) / e;

    this.prog += (t * speed) / stretch;

    this.locate(this.prog, this.point);
    return this.prog >= 1;
  };

  abstract locate: (t: number, result: Point) => Point;
}

export class LineTrack extends Track {
  a = { x: 0, y: 0 };
  b = { x: 0, y: 0 };

  constructor(ps: Point[]) {
    super();
    this.b.x = ps[0].x;
    this.b.y = ps[0].y;
    this.a.x = ps[1].x - ps[0].x;
    this.a.y = ps[1].y - ps[0].y;
  }

  locate = (t: number, point = { x: 0, y: 0 }) => {
    const x = this.b.x + t * this.a.x;
    const y = this.b.y + t * this.a.y;
    point.x = x;
    point.y = y;
    return point;
  };
}

export class BezierTrack extends Track {
  a = { x: 0, y: 0 };
  b = { x: 0, y: 0 };
  c = { x: 0, y: 0 };
  d = { x: 0, y: 0 };

  constructor(ps: Point[]) {
    super();

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

  locate = (t: number, point = { x: 0, y: 0 }) => {
    const t2 = t * t;
    const t3 = t * t * t;
    const x = this.a.x * t3 + this.b.x * t2 + this.c.x * t + this.d.x;
    const y = this.a.y * t3 + this.b.y * t2 + this.c.y * t + this.d.y;
    point.x = x;
    point.y = y;
    return point;
  };
}
