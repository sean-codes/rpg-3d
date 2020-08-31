/**
 * For pooling objects that can be reused.
 * @class Pool
 * @constructor
 */
export class Pool {
  objects: any[]
  type: any

  constructor() {
    this.objects = []
    this.type = Object
  }

  /**
   * Release an object after use
   * @method release
   * @param {Object} obj
   */
  release(...args: any[]): Pool {
    const Nargs = args.length
    for (let i = 0; i !== Nargs; i++) {
      this.objects.push(args[i])
    }
    return this
  }

  /**
   * Get an object
   * @method get
   * @return {mixed}
   */
  get(): any {
    if (this.objects.length === 0) {
      return this.constructObject()
    } else {
      return this.objects.pop()
    }
  }

  /**
   * Construct an object. Should be implemented in each subclass.
   * @method constructObject
   * @return {mixed}
   */
  constructObject(): void {
    throw new Error('constructObject() not implemented in this Pool subclass yet!')
  }

  /**
   * @method resize
   * @param {number} size
   * @return {Pool} Self, for chaining
   */
  resize(size: number): Pool {
    const objects = this.objects

    while (objects.length > size) {
      objects.pop()
    }

    while (objects.length < size) {
      objects.push(this.constructObject())
    }

    return this
  }
}
