import type { Body } from '../objects/Body'

/**
 * Records what objects are colliding with each other
 * @class ObjectCollisionMatrix
 * @constructor
 */
export class ObjectCollisionMatrix {
  matrix: Record<string, boolean> // The matrix storage.

  constructor() {
    this.matrix = {}
  }

  /**
   * @method get
   * @param  {Body} i
   * @param  {Body} j
   * @return {boolean}
   */
  get(bi: Body, bj: Body): boolean {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    return `${i}-${j}` in this.matrix
  }

  /**
   * @method set
   * @param  {Body} i
   * @param  {Body} j
   * @param {boolean} value
   */
  set(bi: Body, bj: Body, value: boolean): void {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    if (value) {
      this.matrix[`${i}-${j}`] = true
    } else {
      delete this.matrix[`${i}-${j}`]
    }
  }

  /**
   * Empty the matrix
   * @method reset
   */
  reset(): void {
    this.matrix = {}
  }

  /**
   * Set max number of objects
   * @method setNumObjects
   * @param {Number} n
   */
  setNumObjects(n: number): void {}
}
