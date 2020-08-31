import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'
import type { Shape } from '../shapes/Shape'

/**
 * Storage for Ray casting data.
 * @class RaycastResult
 * @constructor
 */
export class RaycastResult {
  rayFromWorld: Vec3
  rayToWorld: Vec3
  hitNormalWorld: Vec3
  hitPointWorld: Vec3
  hasHit: boolean
  shape: Shape | null
  body: Body | null
  hitFaceIndex: number // The index of the hit triangle, if the hit shape was a trimesh.
  distance: number // Distance to the hit. Will be set to -1 if there was no hit.
  shouldStop: boolean // If the ray should stop traversing the bodies.

  constructor() {
    this.rayFromWorld = new Vec3()
    this.rayToWorld = new Vec3()
    this.hitNormalWorld = new Vec3()
    this.hitPointWorld = new Vec3()
    this.hasHit = false
    this.shape = null
    this.body = null
    this.hitFaceIndex = -1
    this.distance = -1
    this.shouldStop = false
  }

  /**
   * Reset all result data.
   * @method reset
   */
  reset(): void {
    this.rayFromWorld.setZero()
    this.rayToWorld.setZero()
    this.hitNormalWorld.setZero()
    this.hitPointWorld.setZero()
    this.hasHit = false
    this.shape = null
    this.body = null
    this.hitFaceIndex = -1
    this.distance = -1
    this.shouldStop = false
  }

  /**
   * @method abort
   */
  abort(): void {
    this.shouldStop = true
  }

  /**
   * @method set
   * @param {Vec3} rayFromWorld
   * @param {Vec3} rayToWorld
   * @param {Vec3} hitNormalWorld
   * @param {Vec3} hitPointWorld
   * @param {Shape} shape
   * @param {Body} body
   * @param {number} distance
   */
  set(
    rayFromWorld: Vec3,
    rayToWorld: Vec3,
    hitNormalWorld: Vec3,
    hitPointWorld: Vec3,
    shape: Shape,
    body: Body,
    distance: number
  ): void {
    this.rayFromWorld.copy(rayFromWorld)
    this.rayToWorld.copy(rayToWorld)
    this.hitNormalWorld.copy(hitNormalWorld)
    this.hitPointWorld.copy(hitPointWorld)
    this.shape = shape
    this.body = body
    this.distance = distance
  }
}
