export type MaterialOptions = {
  friction?: number
  restitution?: number
}

/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param {object} [options]
 * @author schteppe
 */
export class Material {
  name: string // Material name.
  id: number // Material id.
  friction: number // Friction for this material. If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
  restitution: number // Restitution for this material. If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.

  static idCounter: number

  constructor(options: MaterialOptions | string = {}) {
    let name = ''

    // Backwards compatibility fix
    if (typeof options === 'string') {
      name = options
      options = {}
    }

    this.name = name
    this.id = Material.idCounter++
    this.friction = typeof options.friction !== 'undefined' ? options.friction : -1
    this.restitution = typeof options.restitution !== 'undefined' ? options.restitution : -1
  }
}

Material.idCounter = 0
