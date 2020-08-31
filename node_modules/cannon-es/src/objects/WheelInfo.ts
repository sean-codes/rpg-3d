import { Vec3 } from '../math/Vec3'
import { Transform } from '../math/Transform'
import { RaycastResult } from '../collision/RaycastResult'
import { Utils } from '../utils/Utils'
import type { Body } from '../objects/Body'

export type WheelInfoOptions = {
  chassisConnectionPointLocal?: Vec3
  chassisConnectionPointWorld?: Vec3
  directionLocal?: Vec3
  directionWorld?: Vec3
  axleLocal?: Vec3
  axleWorld?: Vec3
  suspensionRestLength?: number
  suspensionMaxLength?: number
  radius?: number
  suspensionStiffness?: number
  dampingCompression?: number
  dampingRelaxation?: number
  frictionSlip?: number
  steering?: number
  rotation?: number
  deltaRotation?: number
  rollInfluence?: number
  maxSuspensionForce?: number
  isFrontWheel?: boolean
  clippedInvContactDotSuspension?: number
  suspensionRelativeVelocity?: number
  suspensionForce?: number
  slipInfo?: number
  skidInfo?: number
  suspensionLength?: number
  maxSuspensionTravel?: number
  useCustomSlidingRotationalSpeed?: boolean
  customSlidingRotationalSpeed?: number
}

export type WheelRaycastResult = RaycastResult &
  Partial<{
    suspensionLength: number
    directionWorld: Vec3
    groundObject: number
  }>

/**
 * @class WheelInfo
 * @constructor
 * @param {Object} [options]
 *
 * @param {Vec3} [options.chassisConnectionPointLocal]
 * @param {Vec3} [options.chassisConnectionPointWorld]
 * @param {Vec3} [options.directionLocal]
 * @param {Vec3} [options.directionWorld]
 * @param {Vec3} [options.axleLocal]
 * @param {Vec3} [options.axleWorld]
 * @param {number} [options.suspensionRestLength=1]
 * @param {number} [options.suspensionMaxLength=2]
 * @param {number} [options.radius=1]
 * @param {number} [options.suspensionStiffness=100]
 * @param {number} [options.dampingCompression=10]
 * @param {number} [options.dampingRelaxation=10]
 * @param {number} [options.frictionSlip=10000]
 * @param {number} [options.steering=0]
 * @param {number} [options.rotation=0]
 * @param {number} [options.deltaRotation=0]
 * @param {number} [options.rollInfluence=0.01]
 * @param {number} [options.maxSuspensionForce]
 * @param {boolean} [options.isFrontWheel=true]
 * @param {number} [options.clippedInvContactDotSuspension=1]
 * @param {number} [options.suspensionRelativeVelocity=0]
 * @param {number} [options.suspensionForce=0]
 * @param {number} [options.skidInfo=0]
 * @param {number} [options.suspensionLength=0]
 * @param {number} [options.maxSuspensionTravel=1]
 * @param {boolean} [options.useCustomSlidingRotationalSpeed=false]
 * @param {number} [options.customSlidingRotationalSpeed=-0.1]
 */
export class WheelInfo {
  maxSuspensionTravel: number // Max travel distance of the suspension, in meters.
  customSlidingRotationalSpeed: number // Speed to apply to the wheel rotation when the wheel is sliding.
  useCustomSlidingRotationalSpeed: boolean // If the customSlidingRotationalSpeed should be used.
  sliding: boolean
  chassisConnectionPointLocal: Vec3 // Connection point, defined locally in the chassis body frame.
  chassisConnectionPointWorld: Vec3
  directionLocal: Vec3
  directionWorld: Vec3
  axleLocal: Vec3
  axleWorld: Vec3
  suspensionRestLength: number
  suspensionMaxLength: number
  radius: number
  suspensionStiffness: number
  dampingCompression: number
  dampingRelaxation: number
  frictionSlip: number
  steering: number
  rotation: number // Rotation value, in radians.
  deltaRotation: number
  rollInfluence: number
  maxSuspensionForce: number
  engineForce: number
  brake: number
  isFrontWheel: boolean
  clippedInvContactDotSuspension: number
  suspensionRelativeVelocity: number
  suspensionForce: number
  slipInfo: number
  skidInfo: number
  suspensionLength: number
  sideImpulse: number
  forwardImpulse: number
  raycastResult: WheelRaycastResult // The result from raycasting.
  worldTransform: Transform // Wheel world transform.
  isInContact: boolean

  constructor(options: WheelInfoOptions = {}) {
    options = Utils.defaults(options, {
      chassisConnectionPointLocal: new Vec3(),
      chassisConnectionPointWorld: new Vec3(),
      directionLocal: new Vec3(),
      directionWorld: new Vec3(),
      axleLocal: new Vec3(),
      axleWorld: new Vec3(),
      suspensionRestLength: 1,
      suspensionMaxLength: 2,
      radius: 1,
      suspensionStiffness: 100,
      dampingCompression: 10,
      dampingRelaxation: 10,
      frictionSlip: 10000,
      steering: 0,
      rotation: 0,
      deltaRotation: 0,
      rollInfluence: 0.01,
      maxSuspensionForce: Number.MAX_VALUE,
      isFrontWheel: true,
      clippedInvContactDotSuspension: 1,
      suspensionRelativeVelocity: 0,
      suspensionForce: 0,
      slipInfo: 0,
      skidInfo: 0,
      suspensionLength: 0,
      maxSuspensionTravel: 1,
      useCustomSlidingRotationalSpeed: false,
      customSlidingRotationalSpeed: -0.1,
    })

    this.maxSuspensionTravel = options.maxSuspensionTravel!
    this.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed!
    this.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed!
    this.sliding = false
    this.chassisConnectionPointLocal = options.chassisConnectionPointLocal!.clone()
    this.chassisConnectionPointWorld = options.chassisConnectionPointWorld!.clone()
    this.directionLocal = options.directionLocal!.clone()
    this.directionWorld = options.directionWorld!.clone()
    this.axleLocal = options.axleLocal!.clone()
    this.axleWorld = options.axleWorld!.clone()
    this.suspensionRestLength = options.suspensionRestLength!
    this.suspensionMaxLength = options.suspensionMaxLength!
    this.radius = options.radius!
    this.suspensionStiffness = options.suspensionStiffness!
    this.dampingCompression = options.dampingCompression!
    this.dampingRelaxation = options.dampingRelaxation!
    this.frictionSlip = options.frictionSlip!
    this.steering = 0
    this.rotation = 0
    this.deltaRotation = 0
    this.rollInfluence = options.rollInfluence!
    this.maxSuspensionForce = options.maxSuspensionForce!
    this.engineForce = 0
    this.brake = 0
    this.isFrontWheel = options.isFrontWheel!
    this.clippedInvContactDotSuspension = 1
    this.suspensionRelativeVelocity = 0
    this.suspensionForce = 0
    this.slipInfo = 0
    this.skidInfo = 0
    this.suspensionLength = 0
    this.sideImpulse = 0
    this.forwardImpulse = 0
    this.raycastResult = new RaycastResult()
    this.worldTransform = new Transform()
    this.isInContact = false
  }

  updateWheel(chassis: Body): void {
    const raycastResult = this.raycastResult

    if (this.isInContact) {
      const project = raycastResult.hitNormalWorld.dot(raycastResult.directionWorld!)
      raycastResult.hitPointWorld.vsub(chassis.position, relpos)
      chassis.getVelocityAtWorldPoint(relpos, chassis_velocity_at_contactPoint)
      const projVel = raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint)
      if (project >= -0.1) {
        this.suspensionRelativeVelocity = 0.0
        this.clippedInvContactDotSuspension = 1.0 / 0.1
      } else {
        const inv = -1 / project
        this.suspensionRelativeVelocity = projVel * inv
        this.clippedInvContactDotSuspension = inv
      }
    } else {
      // Not in contact : position wheel in a nice (rest length) position
      raycastResult.suspensionLength = this.suspensionRestLength
      this.suspensionRelativeVelocity = 0.0
      raycastResult.directionWorld!.scale(-1, raycastResult.hitNormalWorld)
      this.clippedInvContactDotSuspension = 1.0
    }
  }
}

const chassis_velocity_at_contactPoint = new Vec3()
const relpos = new Vec3()
