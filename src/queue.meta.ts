/**
 * @module Queue
 */

/**
 * State names exposed by the Queue public API
 * @category Metadata: State
 * @enum
 */
export const State = {
  ORDER: "order",
  CONDITION: "condition"
} as const;

/**
 * State names exposed by the Queue public API
 * @category Metadata: State
 */
export type State = (typeof State)[keyof typeof State];

/**
 * Value domain of the `order` state: the order in which the queue hands out its waiting items
 * @category Metadata: State
 * @enum
 */
export const Order = {
  FIFO: "fifo",
  PRIORITY: "priority"
} as const;

/**
 * Value domain of the `order` state
 * @category Metadata: State
 */
export type Order = (typeof Order)[keyof typeof Order];

/**
 * Value domain of the `condition` state: the condition of the queue as a whole
 * @category Metadata: State
 * @enum
 */
export const Condition = {
  EMPTY: "empty",
  WAITING: "waiting",
  BUSY: "busy"
} as const;

/**
 * Value domain of the `condition` state
 * @category Metadata: State
 */
export type Condition = (typeof Condition)[keyof typeof Condition];

/**
 * Data names exposed by the Queue public API
 * @category Metadata: Data
 * @enum
 */
export const Datum = {
  WAITING: "waiting",
  WORKING: "working"
} as const;

/**
 * Data names exposed by the Queue public API
 * @category Metadata: Data
 */
export type Datum = (typeof Datum)[keyof typeof Datum];

/**
 * Value domain of an item's `priority`: a whole number from `LOWEST` to `HIGHEST`
 * @category Metadata: Data
 * @enum
 */
export const Priority = {
  LOWEST: 1,
  HIGHEST: 10
} as const;

/**
 * An item of the queue: the host's own object, with an `id` that is unique in the queue and a
 * `priority` from 1 (lowest) to 10 (highest); the queue keeps every other field as the host gave it
 * @category Metadata: Data
 */
export type Item<T extends object = Record<string, unknown>> = T & {
  id: string;
  priority: number;
};

/**
 * An item as the host component gives it: the `priority` may be left out, and is then 1
 * @category Metadata: Data
 */
export type Entry<T extends object = Record<string, unknown>> = T & {
  id: string;
  priority?: number;
};

/**
 * A list of items, as the queue holds it
 * @category Metadata: Data
 */
export type Items<T extends object = Record<string, unknown>> = readonly Item<T>[];

/**
 * The options a host component gives the queue when it creates it; read once, not kept
 * @category Configuration
 */
export type Options = {
  order?: Order;
};

/**
 * Operation names exposed by the Queue public API
 * @category Metadata: Operations
 * @enum
 */
export const Operation = {
  ADD: "add",
  TAKE: "take",
  PEEK: "peek",
  UPDATE: "update",
  REMOVE: "remove",
  PUT_BACK: "putBack"
} as const;

/**
 * Operation names exposed by the Queue public API
 * @category Metadata: Operations
 */
export type Operation = (typeof Operation)[keyof typeof Operation];

/**
 * Event names dispatched by the Queue
 * @category Metadata: Events
 * @enum
 */
export const Event = {
  ON_ADD: "onadd",
  ON_TAKE: "ontake",
  ON_UPDATE: "onupdate",
  ON_REMOVE: "onremove",
  ON_PUT_BACK: "onputback",
  ON_WAITING: "onwaiting"
} as const;

/**
 * Event names dispatched by the Queue
 * @category Metadata: Events
 */
export type Event = (typeof Event)[keyof typeof Event];

/**
 * Every state the queue must have
 * @category Metadata
 */
export type States = Record<State, unknown>;

/**
 * Every data item the queue must have
 * @category Metadata
 */
export type Data = Record<Datum, unknown>;

/**
 * Every operation the queue must have
 * @category Metadata
 */
export type Operations = Record<Operation, (...parameters: any[]) => unknown>;

/**
 * Every event the queue must have a subscription property for
 * @category Metadata
 */
export type Events = Record<Event, EventListener | null>;

/**
 * Everything the metadata says the queue has: implemented by the queue
 * @category Metadata
 */
export type Meta = States & Data & Operations & Events;
