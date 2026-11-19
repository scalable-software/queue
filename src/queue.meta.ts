/**
 * @module Queue
 */

/**
 * State names exposed by the Queue public API
 * @category Metadata: State
 * @enum
 */
export const State = {} as const;

/**
 * State names exposed by the Queue public API
 * @category Metadata: State
 */
export type State = (typeof State)[keyof typeof State];

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
