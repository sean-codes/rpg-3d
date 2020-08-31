import { Pool } from '../utils/Pool'
import { Vec3 } from '../math/Vec3'

/**
 * @class Vec3Pool
 * @constructor
 * @extends Pool
 */
export class Vec3Pool extends Pool {
  type: typeof Vec3

  constructor() {
    super()

    this.type = Vec3
  }

  /**
   * Construct a vector
   * @method constructObject
   * @return {Vec3}
   */
  constructObject(): Vec3 {
    return new Vec3()
  }
}
