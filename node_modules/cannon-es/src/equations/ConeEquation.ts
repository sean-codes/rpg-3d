import { Vec3 } from '../math/Vec3'
import { Equation } from '../equations/Equation'
import type { Body } from '../objects/Body'

export type ConeEquationOptions = {
  maxForce?: number
  axisA?: Vec3
  axisB?: Vec3
  angle?: number
}

/**
 * Cone equation. Works to keep the given body world vectors aligned, or tilted within a given angle from each other.
 * @class ConeEquation
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec3} [options.axisA] Local axis in A
 * @param {Vec3} [options.axisB] Local axis in B
 * @param {Vec3} [options.angle] The "cone angle" to keep
 * @param {number} [options.maxForce=1e6]
 * @extends Equation
 */
export class ConeEquation extends Equation {
  axisA: Vec3
  axisB: Vec3
  angle: number // The cone angle to keep.

  constructor(bodyA: Body, bodyB: Body, options: ConeEquationOptions = {}) {
    const maxForce = typeof options.maxForce !== 'undefined' ? options.maxForce : 1e6

    super(bodyA, bodyB, -maxForce, maxForce)

    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0)
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0)
    this.angle = typeof options.angle !== 'undefined' ? options.angle : 0
  }

  computeB(h: number): number {
    const a = this.a
    const b = this.b
    const ni = this.axisA
    const nj = this.axisB
    const nixnj = tmpVec1
    const njxni = tmpVec2
    const GA = this.jacobianElementA
    const GB = this.jacobianElementB

    // Caluclate cross products
    ni.cross(nj, nixnj)
    nj.cross(ni, njxni)

    // The angle between two vector is:
    // cos(theta) = a * b / (length(a) * length(b) = { len(a) = len(b) = 1 } = a * b

    // g = a * b
    // gdot = (b x a) * wi + (a x b) * wj
    // G = [0 bxa 0 axb]
    // W = [vi wi vj wj]
    GA.rotational.copy(njxni)
    GB.rotational.copy(nixnj)

    const g = Math.cos(this.angle) - ni.dot(nj)
    const GW = this.computeGW()
    const GiMf = this.computeGiMf()

    const B = -g * a - GW * b - h * GiMf

    return B
  }
}

const tmpVec1 = new Vec3()
const tmpVec2 = new Vec3()
