import type { Equation } from '../equations/Equation'
import type { World } from '../world/World'

/**
 * Constraint equation solver base class.
 * @class Solver
 * @constructor
 * @author schteppe / https://github.com/schteppe
 */
export class Solver {
  equations: Equation[] // All equations to be solved

  constructor() {
    this.equations = []
  }

  /**
   * Should be implemented in subclasses!
   * @method solve
   * @param  {Number} dt
   * @param  {World} world
   * @return {Number} number of iterations performed
   */
  solve(dt: number, world: World): number {
    return (
      // Should return the number of iterations done!
      0
    )
  }

  /**
   * Add an equation
   * @method addEquation
   * @param {Equation} eq
   */
  addEquation(eq: Equation): void {
    if (eq.enabled) {
      this.equations.push(eq)
    }
  }

  /**
   * Remove an equation
   * @method removeEquation
   * @param {Equation} eq
   */
  removeEquation(eq: Equation): void {
    const eqs = this.equations
    const i = eqs.indexOf(eq)
    if (i !== -1) {
      eqs.splice(i, 1)
    }
  }

  /**
   * Add all equations
   * @method removeAllEquations
   */
  removeAllEquations(): void {
    this.equations.length = 0
  }
}
