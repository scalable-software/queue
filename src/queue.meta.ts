/**
 * @module Queue
 */

/**
 * State names exposed by the Queue public API
 * @category Metadata: State
 * @enum
 */
export const State = {
  ORDER: "order"
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
 * Operation names exposed by the Queue public API
 * @category Metadata: Operations
 * @enum
 */
export const Operation = {} as const;

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
export const Event = {} as const;

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
export type Meta = States & Operations & Events;
