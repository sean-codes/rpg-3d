// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#cdcdff')
   camera.position.set(0, 15, -15)
   camera.near = 1
   camera.far = 100
   camera.updateProjectionMatrix()
   camera.lookAt(0, 0, 0)


   cameraLookX = new THREE.Object3D()
   cameraLookY = new THREE.Object3D()
   cameraLookY.add(cameraLookX)
   cameraLookX.add(camera)
   scene.add(cameraLookY)
   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)

   const dirLight = new THREE.DirectionalLight('#FFF', 1)
   dirLight.castShadow = true
   dirLight.position.set(12, 20, 10)
   dirLight.shadow.mapSize.width = 2048
   dirLight.shadow.mapSize.height = 2048
   dirLight.shadow.camera.right = 30;
   dirLight.shadow.camera.left = -30;
   dirLight.shadow.camera.top = 30;
   dirLight.shadow.camera.bottom = -30;
   scene.add(dirLight)

   // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
   // scene.add(dirLightHelper)
   //
   // const dirLightShadowHelper = new THREE.CameraHelper(dirLight.shadow.camera)
   // scene.add(dirLightShadowHelper)

   // a plane under
   const planeGeo = new THREE.PlaneBufferGeometry(100, 100)
   const planeMat = new THREE.MeshPhongMaterial({ color: '#4b7' })
   planeMat.flatShading = true
   planeMat.reflectivity = 0
   planeMat.shininess = 0
   this.planeMes = new THREE.Mesh(planeGeo, planeMat)
   this.planeMes.receiveShadow = true
   this.planeMes.rotation.x -= Math.PI * 0.5
   this.planeMes.position.y -= 0.001
   scene.add(this.planeMes)

   // a grid
   // const gridHelper = new THREE.GridHelper(50, 50)
   // scene.add(gridHelper)

   const models = {
      helmet: { file: './assets/models/knight/Helmet1.fbx', scale: 0.01, offset: [0.08, 0.05, 0.65] },
      sword: { file: './assets/models/knight/Sword.fbx', scale: 0.01, rotation: [0, -Math.PI*0.5, 0], offset: [0.1, 0.05, -0.15] },
      shield: { file: './assets/models/knight/Shield_Round.fbx', scale: 0.01, rotation: [-0.1, Math.PI*0.5, 0], offset: [0.2, -0.3, 0] },
      character: { file: './assets/models/knight/KnightCharacter_edited.fbx', scale: 0.01 },
      shoulderPads: { file: './assets/models/knight/ShoulderPads.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      dragon: { file: './assets/models/monsters/FBX/Dragon_Edited.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
   }

   const loader = new THREE.FBXLoader()

   await new Promise((yay, nay) => {
      let loading = Object.keys(models).length
      for (const modelName in models) {
         const model = models[modelName]
         loader.load(model.file, (object) => {
            model.object = object
            model.bones = {}

            model.object.traverse((part) => {
               // flat shading
               if (part.material) {
                  const makeMaterialFlat = (material) => {
                     material.flatShading = true
                     material.reflectivity = 0
                     material.shininess = 0
                  }

                  if (part.material.length) part.material.forEach(makeMaterialFlat)
                  else makeMaterialFlat(part.material)
               }

               // bones
               if (part.type === 'Bone') {
                  model.bones[part.name] = part
               }

               if (part.type === 'Mesh' || part.type === 'SkinnedMesh') {
                  part.receiveShadow = true
                  part.castShadow = true

                  if (model.offset) {
                     part.geometry.translate(...model.offset)
                  }

                  if (model.rotation) {
                     part.geometry.rotateX(model.rotation[0])
                     part.geometry.rotateY(model.rotation[1])
                     part.geometry.rotateZ(model.rotation[2])
                  }
               }
            })

            // scale
            // scale after so we can adjust axis
            model.object.scale.x = model.scale
            model.object.scale.y = model.scale
            model.object.scale.z = model.scale

            //animations
            model.mixer = new THREE.AnimationMixer(model.object)
            model.clips = {}
            model.object.animations.forEach((animation) => {
               if (animation.name === 'HumanArmature|Run_swordAttack') {
                  console.log(animation)
                  THREE.AnimationUtils.makeClipAdditive(animation)
               }
               const clip = model.mixer.clipAction(animation)
               clip.setEffectiveWeight(0)
               clip.play()
               model.clips[animation.name] = clip
            })
            // finish loading
            loading -= 1
            if (!loading) yay()
         }, null, (e) => { throw e })
      }
   })

   models.character.bones.Head.add(models.helmet.object)
   models.character.bones.PalmR.add(models.sword.object)
   models.character.bones.PalmL.add(models.shield.object)
   models.character.bones.Neck.add(models.shoulderPads.object)
   // scene.add(models.character.object) // Adding this to the physics box

   models.character.clips['HumanArmature|Idle_swordRight'].enabled = true
   models.character.clips['HumanArmature|Idle_swordRight'].setEffectiveWeight(1)
   models.character.clips['HumanArmature|Idle_swordRight'].play()

   datGui.add({ equip: true }, 'equip').name('Equip Helmet').onChange((value) => {
      models.character.bones.Head[value ? 'add' : 'remove'](models.helmet.object)
   })
   datGui.add({ equip: true }, 'equip').name('Equip Sword').onChange((value) => {
      models.character.bones.PalmR[value ? 'add' : 'remove'](models.sword.object)
   })
   datGui.add({ equip: true }, 'equip').name('Equip Shield').onChange((value) => {
      models.character.bones.PalmL[value ? 'add' : 'remove'](models.shield.object)
   })
   datGui.add({ equip: true }, 'equip').name('Equip Shoulders').onChange((value) => {
      models.character.bones.Neck[value ? 'add' : 'remove'](models.shoulderPads.object)
   })


   // wonder if we can add physics to this!
   const world = new CANNON.World()
   world.gravity.set(0, -40, 0)
   const physicsObjects = []
   const groundBodyMaterial = new CANNON.Material({ friction: -1, restitution: 0 })
   const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: groundBodyMaterial
   })

   groundBody.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2)

   world.add(groundBody)

   // I'm not going to use the model for this. Will create a cube and attach the model to it!
   const playerGeo = new THREE.SphereGeometry(0.75)
   const wireFrameMat = new THREE.MeshBasicMaterial({
      color: '#000',
      wireframe: true,
      opacity: 0.05,
      transparent: true,
   })
   const playerMes = new THREE.Mesh(playerGeo, wireFrameMat)
   playerMes.position.y += 4
   playerMes.position.x += 10
   playerMes.position.z -= 5
   playerMes.add(models.character.object)
   models.character.object.position.y -= 0.75

   // this is here since i had nowhere to put it at
   models.character.changeToIdle = () => {
      models.character.stopWalking = false
      const idleMixer = models.character.mixer
      const clipIdle = models.character.clips['HumanArmature|Idle']
      const clipWalk = models.character.clips['HumanArmature|Run_swordRight']

      clipIdle.setEffectiveWeight(1)
      clipIdle.crossFadeFrom(clipWalk, 0.25)
      clipIdle.time = 0
      clipIdle.enabled = true
      idleMixer.removeEventListener('loop', models.character.changeToIdle)
   }
   scene.add(playerMes)

   const playerRotatorMesh = new THREE.Object3D()
   scene.add(playerRotatorMesh)

   const playerBodyMaterial = new CANNON.Material({ friction: 0.1, restitution: 0 })

   const playerBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(playerMes.position.x, playerMes.position.y, playerMes.position.z),
      shape: new CANNON.Sphere(0.75),
      material: playerBodyMaterial
   })

   const playerBodyTopGeo = new THREE.CylinderGeometry( 1, 1, 5, 10 )
   const playerBodyTopMes = new THREE.Mesh(playerBodyTopGeo, wireFrameMat)

   playerMes.add(playerBodyTopMes)
   playerBodyTopMes.position.y += 2

   const shape = new CANNON.Cylinder(1, 1, 5, 10);
   var quat = new CANNON.Quaternion();
   quat.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
   var translation = new CANNON.Vec3(0,0,0);
   shape.transformAllPoints(translation,quat);
   playerBody.addShape(shape, new CANNON.Vec3(0, 2, 0))


   playerBody.fixedRotation = true
   playerBody.updateMassProperties()
   world.addBody(playerBody)
   physicsObjects.push({ name: 'player', body: playerBody, mesh: playerMes, accel: 0, isOnGround: false })

   // contact material gorund and player
   const contactMaterial = new CANNON.ContactMaterial(playerBodyMaterial, groundBodyMaterial, {
      friction: 0,
      restitution: 0
   })

   world.addContactMaterial(contactMaterial)

   playerBody.addEventListener('collide', (event) => {
      const { contact, body, target, type } = event;
      const { ni, bj, bi } = contact

      const contactNormal = new CANNON.Vec3()
      const upAxis = new CANNON.Vec3(0, 1, 0)
      const directionOfCollision = bi.id === playerBody.id ? -ni.y : ni.y

      if (directionOfCollision > 0.9) {
         this.physicsObjects[0].isOnGround = true
      }
   })


   // creating a weapon collider type of object thing?
   const weaponGeo = new THREE.BoxGeometry(4, 1, 1)
   const weaponMes = new THREE.Mesh(weaponGeo, wireFrameMat)
   weaponMes.position.x -= 2
   // weaponMes.position.y = 5
   models.character.bones.PalmR.add(weaponMes)
   // scene.add(weaponMes)
   const weaponBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(2, 0.5, 0.5)),
      position: new CANNON.Vec3(weaponMes.position.x, weaponMes.position.y, weaponMes.position.z),
   })
   weaponBody.collisionResponse = false

   world.add(weaponBody)
   physicsObjects.push({ name: 'sword', body: weaponBody, mesh: weaponMes, linkToMesh: true })
   weaponBody.addEventListener('collide', (e) => {
      if (!models.character.isAttacking) return
      const dragons = physicsObjects.filter(o => o.name === 'dragon')
      for (const dragon of dragons) {
         if (e.body.id === dragon.body.id) {
            const clipFlying = dragon.clips['DragonModel|Dragon_Flying']
            const clipDeath = dragon.clips['DragonModel|Dragon_Death']

            clipDeath.enabled = true
            clipDeath.time = 0
            clipDeath.setEffectiveWeight(1)
            clipDeath.crossFadeFrom(clipFlying, 0.5)

            const whenDead = (e) => {
               if (e.action.getClip().name === 'DragonModel|Dragon_Death') {
                  dragon.mixer.removeEventListener('loop', whenDead)
                  scene.remove(dragon.mesh)
                  world.remove(dragon.body)
               }
            }
            dragon.mixer.addEventListener('loop', whenDead)
         }
      }
   })

   // add some random boxes
   const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
   const boxBodyMaterial = new CANNON.Material({ friction: 0 })
   for (var i = 0; i < 10; i++) {
      const size = Math.random() * 3 + 1
      const boxGeo = new THREE.BoxGeometry(size, size, size)
      const boxMes = new THREE.Mesh(boxGeo, boxMat)
      boxMes.receiveShadow = true
      boxMes.castShadow = true
      const boxBody = new CANNON.Body({
         mass: 0,
         position: new CANNON.Vec3(Math.random()*-10, size/2, Math.random()*20-10),
         shape: new CANNON.Box(new CANNON.Vec3(size/2, size/2, size/2)),
         material: boxBodyMaterial
      })
      scene.add(boxMes)
      world.addBody(boxBody)
      physicsObjects.push({ name: 'box_'+i, body: boxBody, mesh: boxMes })
   }

   // make a ramp?
   const rampGeo = new THREE.BoxGeometry(10, 1, 10)
   const rampMat = new THREE.MeshPhongMaterial({ color: '#F66' })
   const rampMes = new THREE.Mesh(rampGeo, rampMat)
   rampMes.receiveShadow = true
   rampMes.castShadow = true
   scene.add(rampMes)

   const rampBodyMaterial = new CANNON.Material({ friction: 0.1 })
   const rampBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, -10),
      shape: new CANNON.Box(new CANNON.Vec3(5, 0.5, 5)),
      material: rampBodyMaterial
   })
   rampBody.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 0.1)
   world.addBody(rampBody)
   physicsObjects.push({ name: 'ramp', body: rampBody, mesh: rampMes })

   const contactMaterialRamp = new CANNON.ContactMaterial(rampBodyMaterial, playerBodyMaterial, {
      friction: 0.1,
      restitution: 0
   })
   world.addContactMaterial(contactMaterialRamp)
   // a few platforms
   // an object the player could go under on accident
   const platformGeo = new THREE.BoxGeometry(10, 1, 10)
   const platformMat = new THREE.MeshPhongMaterial({ color: '#F66' })
   const platformMes = new THREE.Mesh(platformGeo, platformMat)
   platformMes.receiveShadow = true
   platformMes.castShadow = true
   scene.add(platformMes)

   const platformBodyMaterial = new CANNON.Material({ friction: 0 })
   const platformBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 2.5, 15),
      shape: new CANNON.Box(new CANNON.Vec3(5, 0.5, 5)),
      material: platformBodyMaterial
   })
   world.addBody(platformBody)
   physicsObjects.push({ name: 'platform', body: platformBody, mesh: platformMes })

   const platform2Geo = new THREE.BoxGeometry(10, 1, 10)
   const platform2Mat = new THREE.MeshPhongMaterial({ color: '#F66' })
   const platform2Mes = new THREE.Mesh(platform2Geo, platform2Mat)
   platform2Mes.receiveShadow = true
   platform2Mes.castShadow = true
   scene.add(platform2Mes)

   const platform2BodyMaterial = new CANNON.Material({ friction: 0 })
   const platform2Body = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(5, 5, 15),
      shape: new CANNON.Box(new CANNON.Vec3(5, 0.5, 5)),
      material: platform2BodyMaterial
   })
   world.addBody(platform2Body)
   physicsObjects.push({ name: 'platform2', body: platform2Body, mesh: platform2Mes })

   // TESTING match cannon cylinder to three
   {
      // Make a threejs cylinder
      const cylinderGeo = new THREE.CylinderGeometry( 1, 1, 5, 10 )
      const cylinderMat = new THREE.MeshPhongMaterial({ color: '#99a', flatShading: true })
      const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat)
      cylinderMesh.receiveShadow = true
      cylinderMesh.castShadow = true
      scene.add(cylinderMesh)


      // Make a cannon cylinder shape and rotate its points
      const shapeCylinder = new CANNON.Cylinder(1, 1, 5, 10);
      const quatToRotateCylinder = new CANNON.Quaternion();
      quatToRotateCylinder.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
      const translationCylinder = new CANNON.Vec3(0, 0, 0);
      shapeCylinder.transformAllPoints(translationCylinder, quatToRotateCylinder);

      const cylBody = new CANNON.Body({
         mass: 2,
         shape: shapeCylinder,
         position: new CANNON.Vec3(5, 10, 0),
         material: new CANNON.Material({ friction: 0.1, restitution: 0 })
      })

      cylBody.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 0.1)
      world.addBody(cylBody)
      physicsObjects.push({ name: 'cylTest', body: cylBody, mesh: cylinderMesh })
   }

   // A monster bunch of monsters
   // It's certainly getting to the point we need a game object class! :]
   const dragonBodyMaterial = new CANNON.Material({ friction: 0 })

   world.addContactMaterial(new CANNON.ContactMaterial(dragonBodyMaterial, groundBodyMaterial, {
      friction: 0,
      restitution: 0
   }))

   for (let i = 0; i < 2; i++) {
      for (let o = 0; o < 2; o++) {
         const dragonGeo = new THREE.SphereGeometry(2)
         const dragonMes = new THREE.Mesh(dragonGeo, wireFrameMat)
         const dragonModel = THREE.SkeletonUtils.clone(models.dragon.object)
         // console.log(dragonModel)
         // skeleton utils does not clone AnimationMixer
         const mixer = new THREE.AnimationMixer(dragonModel)
         const clips = {}
         models.dragon.object.animations.forEach((animation) => {
            const clip = mixer.clipAction(animation)
            clip.setEffectiveWeight(0)
            clip.play()
            // model.clips[animation.name] = clip
            if (animation.name === 'DragonModel|Dragon_Flying') {
               clip.time = Math.random() * 15
               clip.setEffectiveWeight(1)
               clip.enabled = true
            }
            clips[animation.name] = clip
         })

         models[`dragon_${i}-${o}`] = { mixer: mixer}

         dragonMes.position.set(15+o*6, 3, -15+i*6)
         dragonMes.add(dragonModel)
         dragonModel.position.y -= 2
         scene.add(dragonMes)

         const dragonBody = new CANNON.Body({
            mass: 0.1,
            shape: new CANNON.Sphere(2),
            position: new CANNON.Vec3(dragonMes.position.x, dragonMes.position.y, dragonMes.position.z),
            material: dragonBodyMaterial,
            fixedRotation: true
         })
         // dragonBody.fixedRotation = true
         // dragonBody.updateMassProperties()
         world.addBody(dragonBody)
         physicsObjects.push({ name: 'dragon', body: dragonBody, mesh: dragonMes, mixer: mixer, clips: clips, accel: 0 })
      }
   }

   // target pointer
   const targetGeo = new THREE.SphereGeometry()
   const targetMat = new THREE.MeshBasicMaterial({ color: '#FFF', depthTest: false, flatShading: true})
   const targetMes = new THREE.Mesh(targetGeo, targetMat)
   targetMes.renderOrder = 1000

   // globals
   this.models = models
   this.world = world
   this.playerRotator = playerRotatorMesh
   this.models = models
   this.physicsObjects = physicsObjects
   this.targetMes = targetMes
   this.target = undefined

   this.cameraLookY = cameraLookY
   this.cameraLookX = cameraLookX
}

const render = function({ c3, time, clock, camera, scene }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      model.mixer.update(delta)
   }


   // Dragon chase player
   const player = this.physicsObjects.find(o => o.name === 'player')
   const dragons = this.physicsObjects.filter(o => o.name === 'dragon')

   for (const dragon of dragons) {
      const distanceFromPlayer = dragon.mesh.position.distanceTo(player.mesh.position)
      // console.log(distanceFromPlayer)
      if (distanceFromPlayer < 10 && distanceFromPlayer > 4) {
         const direction = player.mesh.position.clone().sub(dragon.mesh.position)
         const targetAngle = new THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2)
         let angleDiff = angleToAngle(dragon.mesh.rotation.y, targetAngle)
         const newAngle = loopAngle(dragon.mesh.rotation.y + angleDiff / 10)
         dragon.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), newAngle);
         dragon.accel = Math.min(5, dragon.accel + 1)
      } else {
         dragon.accel = Math.max(0, dragon.accel - 0.5)
      }

      const dragonDirection = dragon.mesh.getWorldDirection(new THREE.Vector3())
      // console.log(dragonDirection, dragon.accel)
      dragon.body.velocity.set(
         dragonDirection.x*dragon.accel,
         dragon.body.velocity.y,//playerDirection.y*player.accel,
         dragonDirection.z*dragon.accel,
      )
   }




   this.cameraLookY.position.copy(player.mesh.position)
   // Player keyboard movement

   // targeting
   if (c3.checkKey(69).down) {
      if (this.target) {
         this.target = undefined
      } else {
         // find nearest dragon
         const player = this.physicsObjects.find(o => o.name === 'player')

         let closestDragon = undefined
         let closestDistance = 100000000000
         for (const object of this.physicsObjects) {
            if (object.name === 'dragon') {
               const distanceFromPlayer = player.mesh.position.distanceTo(object.mesh.position)
               if (distanceFromPlayer < 20 && distanceFromPlayer < closestDistance) {
                  closestDragon = object
                  closestDistance = distanceFromPlayer
               }
            }
         }

         if (closestDragon) {
            this.target = closestDragon
         }
      }
   }

   this.targetMes.rotation.y += 0.01
   this.targetMes.rotation.x += 0.01
   if (this.target) {
      scene.add(this.targetMes)
      this.targetMes.position.copy(this.target.mesh.position)
      const cameraPosition = camera
      const distanceFromCamera = this.target.mesh.position.distanceTo(c3.camera.getWorldPosition(new THREE.Vector3()))
      const targetScale = distanceFromCamera/100
      this.targetMes.scale.set(targetScale, targetScale, targetScale)

      // point player
      const direction = this.target.mesh.position.clone().sub(player.mesh.position)
      // const angle = new THREE.Vector2(-direction.x, direction.z).angle() + Math.PI*2*0.75 // see below
      const angle = new THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2)
      this.playerRotator.rotation.y = angle
      this.cameraLookY.rotation.y = angle

      // check if target is dead
      if (!this.target.mesh.parent) {
         this.target = undefined
      }
   } else {
      scene.remove(this.targetMes)
   }

   // these are goign to get twisted / player will rotate > 180 deg sometimes
   const spinSpeed = 10
   if (c3.checkKey(68).held) {
      const { body, mesh } = player
      if (!this.target) {
         const targetAngle = loopAngle(this.cameraLookY.rotation.y - Math.PI/2)
         // let angleDiff = this.playerRotator.rotation.y - targetAngle
         let angleDiff = angleToAngle(this.playerRotator.rotation.y, targetAngle)
         this.playerRotator.rotation.y = loopAngle(this.playerRotator.rotation.y + angleDiff / spinSpeed)
      } else {
         const direction = this.target.mesh.position.clone().sub(player.mesh.position)
         // const angle = new THREE.Vector2(-direction.x, direction.z).angle() + Math.PI*2*0.75 // idk I guessed a bunch of times
         // it was because (0, 1) = 90 deg in vector2. Lets only subtract 90 from the angle
         // and the x axis is flipped!
         const angle = new THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2)
         this.playerRotator.rotation.y = angle - Math.PI/2
      }
   }

   if (c3.checkKey(65).held) {
      const { body, mesh } = player

      if (!this.target) {
         const targetAngle = loopAngle(this.cameraLookY.rotation.y + Math.PI/2)
         // const angleDiff = this.playerRotator.rotation.y - targetAngle
         const angleDiff = angleToAngle(this.playerRotator.rotation.y, targetAngle)
         this.playerRotator.rotation.y = loopAngle(this.playerRotator.rotation.y + angleDiff / spinSpeed)
      } else {
         const direction = this.target.mesh.position.clone().sub(player.mesh.position)
         const angle = new THREE.Vector2(-direction.x, direction.z).angle() + Math.PI*2*0.75 // idk I guessed a bunch of times
         this.playerRotator.rotation.y = angle + Math.PI/2
      }
   }

   if (c3.checkKey(87).held && !this.target) {
      const { body, mesh } = player
      const targetAngle = this.cameraLookY.rotation.y
      const angleDiff = angleToAngle(this.playerRotator.rotation.y, targetAngle)
      if (angleDiff > Math.PI) console.log('something is wrong', angleDiff, this.playerRotator.rotation.y, this.cameraLookY.rotation.y)
      this.playerRotator.rotation.y = loopAngle(this.playerRotator.rotation.y + angleDiff / spinSpeed)
   }

   if (c3.checkKey(83).held) {
      const { body, mesh } = player
      if (!this.target) {
         const targetAngle = loopAngle(this.cameraLookY.rotation.y + Math.PI)
         const angleDiff = angleToAngle(this.playerRotator.rotation.y, targetAngle)
         this.playerRotator.rotation.y = loopAngle(this.playerRotator.rotation.y + angleDiff / spinSpeed)
      } else {
         const direction = this.target.mesh.position.clone().sub(player.mesh.position)
         const angle = new THREE.Vector2(-direction.x, direction.z).angle() + Math.PI*2*0.75 // idk I guessed a bunch of times
         this.playerRotator.rotation.y = angle - Math.PI
      }
   }


   const { body, mesh, accel } = player

   // changing animation
   const modelCharacter = this.models.character
   const characterMixer = modelCharacter.mixer
   const clipIdle = modelCharacter.clips['HumanArmature|Idle_swordRight']
   const clipWalk = modelCharacter.clips['HumanArmature|Run_swordRight']
   const clipAttack = modelCharacter.clips['HumanArmature|Run_swordAttack']

   if (c3.checkKey(87).held || c3.checkKey(68).held || c3.checkKey(65).held || c3.checkKey(83).held) {
      player.accel = Math.min(accel + 1, 12)
   } else {
      player.accel = Math.max(0, accel - 0.5)
   }

   if (
      (c3.checkKey(87).down && (!c3.checkKey(68).held && !c3.checkKey(65).held && !c3.checkKey(83).held)) //lazy
      || (c3.checkKey(68).down && (!c3.checkKey(87).held && !c3.checkKey(65).held && !c3.checkKey(83).held))
      || (c3.checkKey(65).down && (!c3.checkKey(87).held && !c3.checkKey(68).held && !c3.checkKey(83).held))
      || (c3.checkKey(65).down && (!c3.checkKey(87).held && !c3.checkKey(68).held && !c3.checkKey(83).held))
      || (c3.checkKey(83).down && (!c3.checkKey(87).held && !c3.checkKey(68).held && !c3.checkKey(65).held))
   ) {
         clipWalk.setEffectiveWeight(1)
         clipWalk.crossFadeFrom(clipIdle, 0.1)
         clipWalk.enabled = true
   }

   if (c3.checkKey(87).up || c3.checkKey(68).up || c3.checkKey(65).up || c3.checkKey(83).up) {
      if (!c3.checkKey(87).held && !c3.checkKey(68).held && !c3.checkKey(65).held && !c3.checkKey(83).held) {
         clipIdle.setEffectiveWeight(1)
         clipIdle.crossFadeFrom(clipWalk, 0.2)
         clipIdle.enabled = true
      }
   }

   if (c3.checkKey(32).down) {
      if (player.isOnGround) {
         body.velocity.y = 18
         player.isOnGround = false
      }
   }

   if (c3.checkKey(16).up && !modelCharacter.isAttacking) {
      // we could get pretty detailed here with the animatios but I'm not ready
      modelCharacter.isAttacking = true
      const clipToStop = c3.checkKey(87).held ? clipWalk : clipIdle
      clipAttack.reset()
      clipAttack.setEffectiveWeight(1)

      const stopAttackAnimation = (e) => {
         clipAttack.setEffectiveWeight(0)
         modelCharacter.isAttacking = false
      }

      characterMixer.addEventListener('loop', (e) => {
         if (e.action.getClip().name === 'HumanArmature|Run_swordAttack') {
            stopAttackAnimation()
         }
      })
   }

   // rotate player
   player.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.playerRotator.rotation.y);

   const playerDirection = mesh.getWorldDirection(new THREE.Vector3())
   // console.log(playerDirection)

   //hmmmmmmmmm!
   body.velocity.set(
      playerDirection.x*player.accel,
      body.velocity.y,//playerDirection.y*player.accel,
      playerDirection.z*player.accel,
   )




   // camera
   if (c3.checkKey(87).held) {
      // this.cameraLookY.rotation.y -= this.cameraLookY.rotation.y * 0.01
   }

   if (c3.checkKey(37).held) {
      this.cameraLookY.rotation.y += 0.1
   }

   if (c3.checkKey(39).held) {
      this.cameraLookY.rotation.y -= 0.1
   }

   if (c3.checkKey(38).held) {
      this.cameraLookX.rotation.x += 0.1
   }

   if (c3.checkKey(40).held) {
      this.cameraLookX.rotation.x -= 0.1
   }

   // constrain
   cameraLookY.rotation.y = loopAngle(cameraLookY.rotation.y)


   cameraLookX.rotation.x = Math.max(-0.8, cameraLookX.rotation.x)
   cameraLookX.rotation.x = Math.min(0.8, cameraLookX.rotation.x)




   // moved this to the bottom. it fixes some weirdness i was experiencing with changing some values
   // and not seeing them immediately or camera not picking them up
   this.world.step(1/60)

   for (const { mesh, body, linkToMesh } of this.physicsObjects) {
      if (linkToMesh) {
         // console.log('inking')
         const meshWorldPosition = mesh.getWorldPosition(new THREE.Vector3())
         body.position.copy(meshWorldPosition)
         body.quaternion.copy(body.quaternion)
      } else {
         mesh.position.copy(body.position)
         mesh.quaternion.copy(body.quaternion)
      }
   }
}

function angleToAngle(a1, a2) {
   let right = a2 - a1
   if (right < 0) {
      right = Math.PI*2 + right
   }

   let left = a1 - a2
   if (left < 0) {
      left = Math.PI*2 + left
   }

   return right > left ? -left : right
}

function loopAngle(a) {
   let modAngle = a % (Math.PI*2)
   if (modAngle < 0) {
      modAngle = Math.PI*2 + modAngle
   }

   if (modAngle > Math.PI*2) {
      modAngle = -Math.PI*2 + modAngle
   }

   return modAngle
}

window.c3 = new C3({ init, render })
window.c3.init()
