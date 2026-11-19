/**
 * @module Queue
 */

import type { Options } from "./queue.meta.js";

/**
 * Validators for every value that enters the queue from outside
 * @category Validation
 */
export class Validate {
  /**
   * Validate the options given to the constructor
   * @category Validation
   */
  public static options = (value: unknown) => {
    return value as Options;
  };
}
