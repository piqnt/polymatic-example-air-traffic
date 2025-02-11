import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { Loader } from "./Loader";
import { Terminal } from "./Terminal";
import { Board } from "./Board";
import { Plane } from "./Plane";

export interface MainContext {
  stage?: Stage.Root;
  items?: Plane[];
}

export class Main extends Middleware<MainContext> {
  constructor() {
    super();
    this.use(new Loader());
    this.use(new Terminal());
    this.use(new Board());
  }
}
