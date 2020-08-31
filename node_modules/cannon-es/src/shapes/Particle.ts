import { Shape } from '../shapes/Shape'
import { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'

/**
 * Particle shape.
 * @class Particle
 * @constructor
 * @author schteppe
 * @extends Shape
 */
export class Particle extends Shape {
  constructor() {
    super({ type: Shape.types.PARTICLE })
  }

  /**
   * @method calculateLocalInertia
   * @param  {Number} mass
   * @param  {Vec3} target
   * @return {Vec3}
   */
  calculateLocalInertia(mass: number, target = new Vec3()): Vec3 {
    target.set(0, 0, 0)
    return target
  }

  volume(): number {
    return 0
  }

  updateBoundingSphereRadius(): void {
    this.boundingSphereRadius = 0
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    // Get each axis max
    min.copy(pos)
    max.copy(pos)
  }
}
