import { Utils } from '../utils/Utils'
import type { Body } from '../objects/Body'
import type { Equation } from '../equations/Equation'

export type ConstraintOptions = {
  collideConnected?: boolean
  wakeUpBodies?: boolean
}

/**
 * Constraint base class
 * @class Constraint
 * @author schteppe
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {object} [options]
 * @param {boolean} [options.collideConnected=true]
 * @param {boolean} [options.wakeUpBodies=true]
 */
export class Constraint {
  equations: Equation[] // Equations to be solved in this constraint.
  bodyA: Body
  bodyB: Body
  id: number
  collideConnected: boolean // Set to true if you want the bodies to collide when they are connected.

  static idCounter: number

  constructor(bodyA: Body, bodyB: Body, options: ConstraintOptions = {}) {
    options = Utils.defaults(options, {
      collideConnected: true,
      wakeUpBodies: true,
    })

    this.equations = []
    this.bodyA = bodyA
    this.bodyB = bodyB
    this.id = Constraint.idCounter++
    this.collideConnected = options.collideConnected!

    if (options.wakeUpBodies) {
      if (bodyA) {
        bodyA.wakeUp()
      }
      if (bodyB) {
        bodyB.wakeUp()
      }
    }
  }

  /**
   * Update all the equations with data.
   * @method update
   */
  update(): void {
    throw new Error('method update() not implmemented in this Constraint subclass!')
  }

  /**
   * Enables all equations in the constraint.
   * @method enable
   */
  enable(): void {
    const eqs = this.equations
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = true
    }
  }

  /**
   * Disables all equations in the constraint.
   * @method disable
   */
  disable(): void {
    const eqs = this.equations
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = false
    }
  }
}

Constraint.idCounter = 0
