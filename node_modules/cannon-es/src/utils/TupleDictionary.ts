/**
 * @class TupleDictionary
 * @constructor
 */
export class TupleDictionary {
  data: { [id: string]: any; keys: string[] }

  constructor() {
    this.data = { keys: [] }
  }

  /**
   * @method get
   * @param  {Number} i
   * @param  {Number} j
   * @return {Object}
   */
  get(i: number, j: number): any {
    if (i > j) {
      // swap
      const temp = j
      j = i
      i = temp
    }
    return this.data[`${i}-${j}`]
  }

  /**
   * @method set
   * @param  {Number} i
   * @param  {Number} j
   * @param {Object} value
   */
  set(i: number, j: number, value: any): void {
    if (i > j) {
      const temp = j
      j = i
      i = temp
    }
    const key = `${i}-${j}`

    // Check if key already exists
    if (!this.get(i, j)) {
      this.data.keys.push(key)
    }

    this.data[key] = value
  }

  /**
   * @method reset
   */
  reset(): void {
    const data = this.data
    const keys = data.keys
    while (keys.length > 0) {
      const key = keys.pop()!
      delete data[key]
    }
  }
}
