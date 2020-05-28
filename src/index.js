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

   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)

   const dirLight = new THREE.DirectionalLight('#FFF', 0.75)
   dirLight.position.set(12, 6, 10)
   scene.add(dirLight)

   // a plane under
   const planeGeo = new THREE.PlaneBufferGeometry(50, 50)
   const planeMat = new THREE.MeshBasicMaterial({ color: '#cdcdff' })
   this.planeMes = new THREE.Mesh(planeGeo, planeMat)
   this.planeMes.rotation.x -= Math.PI * 0.5
   this.planeMes.position.y -= 0.001
   scene.add(this.planeMes)

   // a grid
   const gridHelper = new THREE.GridHelper(50, 50)
   scene.add(gridHelper)

   const models = {
      helmet: { file: './assets/models/knight/Helmet1.fbx', scale: 0.01, offset: [0.08, 0.05, 0.65] },
      sword: { file: './assets/models/knight/Sword.fbx', scale: 0.01, rotation: [0, -Math.PI*0.5, 0], offset: [0.1, 0.05, -0.15] },
      shield: { file: './assets/models/knight/Shield_Round.fbx', scale: 0.01, rotation: [-0.1, Math.PI*0.5, 0], offset: [0.2, -0.3, 0] },
      character: { file: './assets/models/knight/KnightCharacter.fbx', scale: 0.01 },
      shoulderPads: { file: './assets/models/knight/ShoulderPads.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
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

   models.character.clips['HumanArmature|Idle'].enabled = true
   models.character.clips['HumanArmature|Idle'].setEffectiveWeight(1)
   models.character.clips['HumanArmature|Idle'].play()

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
   const playerMat = new THREE.MeshBasicMaterial({
      color: '#000',
      wireframe: true,
      opacity: 0.1,
      transparent: true,
   })
   const playerMes = new THREE.Mesh(playerGeo, playerMat)
   playerMes.position.y += 4
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
   const playerBodyTopMes = new THREE.Mesh(playerBodyTopGeo, playerMat)

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

   // add some random boxes
   const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
   const boxBodyMaterial = new CANNON.Material({ friction: 0 })
   for (var i = 0; i < 10; i++) {
      const size = Math.random() * 3 + 1
      const boxGeo = new THREE.BoxGeometry(size, size, size)
      const boxMes = new THREE.Mesh(boxGeo, boxMat)
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


   // globals
   this.models = models
   this.world = world
   this.playerRotator = playerRotatorMesh
   this.models = models
   this.physicsObjects = physicsObjects


   playerMes.add(cameraLookY)
   this.cameraLookY = cameraLookY
   this.cameraLookX = cameraLookX
}

const render = function({ c3, time, clock, camera }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      model.mixer.update(delta)
   }

   // Player keyboard movement
   const player = this.physicsObjects.find(o => o.name === 'player')


   if (c3.checkKey(68).held) {
      const { body, mesh } = player
      this.playerRotator.rotation.y -= 0.1
      this.cameraLookY.rotation.y += 0.1
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.playerRotator.rotation.y);
   }

   if (c3.checkKey(65).held) {
      const { body, mesh } = player
      this.playerRotator.rotation.y += 0.1
      this.cameraLookY.rotation.y -= 0.1
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.playerRotator.rotation.y);
   }

   const { body, mesh, accel } = player

   // changing animation
   const modelCharacter = this.models.character
   const characterMixer = modelCharacter.mixer
   const clipIdle = modelCharacter.clips['HumanArmature|Idle']
   const clipWalk = modelCharacter.clips['HumanArmature|Run_swordRight']
   const clipAttack = modelCharacter.clips['HumanArmature|Run_swordAttack']

   if (c3.checkKey(87).held || modelCharacter.isAttacking) {
      player.accel = Math.min(accel + 1, 8)
   } else {
      player.accel = Math.max(0, accel - 0.5)
   }

   if (c3.checkKey(87).down) {
      if (!modelCharacter.isAttacking) {
         clipWalk.setEffectiveWeight(1)
         clipWalk.crossFadeFrom(clipIdle, 0.1)
         clipWalk.enabled = true
      }
   }

   if (c3.checkKey(87).up) {
      if (!modelCharacter.isAttacking) {
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

   if (c3.checkKey(16).up) {
      // we could get pretty detailed here with the animatios but I'm not ready
      modelCharacter.isAttacking = true
      const clipToStop = c3.checkKey(87).held ? clipWalk : clipIdle
      clipAttack.reset()
      clipAttack.setEffectiveWeight(1)
      clipAttack.crossFadeFrom(clipToStop, 0.2)

      const stopAttackAnimation = (e) => {
         const clipToStart = c3.checkKey(87).held ? clipWalk : clipIdle
         modelCharacter.isAttacking = false
         characterMixer.removeEventListener('loop', stopAttackAnimation)
         clipToStart.reset()
         clipToStart.setEffectiveWeight(1)
         clipToStart.crossFadeFrom(clipAttack, 0.2)
      }

      characterMixer.addEventListener('loop', (e) => {
         if (e.action.getClip().name === 'HumanArmature|Run_swordAttack') {
            stopAttackAnimation()
         }
      })
   }

   const playerDirection = mesh.getWorldDirection(new THREE.Vector3())
   // console.log(playerDirection)
   body.velocity.set(
      playerDirection.x*player.accel,
      body.velocity.y,//playerDirection.y*player.accel,
      playerDirection.z*player.accel,
   )


   // camera
   if (player.accel > 0) {
      this.cameraLookY.rotation.y -= this.cameraLookY.rotation.y * 0.1
   }

   if (c3.checkKey(39).held) {
      this.cameraLookY.rotation.y += 0.1
   }

   if (c3.checkKey(37).held) {
      this.cameraLookY.rotation.y -= 0.1
   }

   if (c3.checkKey(38).held) {
      this.cameraLookX.rotation.x += 0.1

   }

   if (c3.checkKey(40).held) {
      this.cameraLookX.rotation.x -= 0.1
   }

   // constrain
   if (cameraLookY.rotation.y < -Math.PI) {
      cameraLookY.rotation.y = Math.PI*2 + cameraLookY.rotation.y
   }

   if (cameraLookY.rotation.y > Math.PI) {
      cameraLookY.rotation.y = -Math.PI*2 + cameraLookY.rotation.y
   }

   cameraLookX.rotation.x = Math.max(-0.8, cameraLookX.rotation.x)
   cameraLookX.rotation.x = Math.min(0.8, cameraLookX.rotation.x)

   // moved this to the bottom. it fixes some weirdness i was experiencing with changing some values
   // and not seeing them immediately or camera not picking them up
   this.world.step(1/60)

   for (const { mesh, body } of this.physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
   }
}


window.c3 = new C3({ init, render })
window.c3.init()
