/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type Plane } from "./Plane";

import { type DelayActionConfig, DelayAction } from "./action/Delay";
import { type EnterActionConfig, EnterAction } from "./action/Enter";
import { type HoldActionConfig, HoldAction } from "./action/Hold";
import { type LandActionConfig, ArrivalAction } from "./action/Arrival";
import { type TakeoffActionConfig, DepartureAction } from "./action/Departure";
import { type TaxiActionConfig, TaxiAction } from "./action/Taxi";

export type ActionConfig =
  | EnterActionConfig
  | LandActionConfig
  | TakeoffActionConfig
  | TaxiActionConfig
  | DelayActionConfig
  | HoldActionConfig;

export const ActionFactory = {
  "enter": () => new EnterAction(),
  "arrival": () => new ArrivalAction(),
  "departure": () => new DepartureAction(),
  "taxi": () => new TaxiAction(),
  "delay": () => new DelayAction(),
  "hold": () => new HoldAction(),
};

export interface Action {
  type: string;
  start(entity: Plane, config: ActionConfig): void;
  tick(entity: Plane, dt: number): void;
  click?(entity: Plane): void;
}
