// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#cdcdff')
   camera.position.set(0, 6, 10)
   camera.near = 1
   camera.far = 100
   camera.updateProjectionMatrix()
   camera.lookAt(0, 0, 0)

   // orbitable camera
   const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
   orbitControls.target.set(0, 3, 0)
   orbitControls.update()

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
            console.log(object)
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
               model.clips[animation.name] = clip
            })
            // finish loading
            loading -= 1
            if (!loading) yay()
         }, null, (e) => { throw e })
      }
   })

   console.log('Finished Loading!', models)

   models.character.bones.Head.add(models.helmet.object)
   models.character.bones.PalmR.add(models.sword.object)
   models.character.bones.PalmL.add(models.shield.object)
   models.character.bones.Neck.add(models.shoulderPads.object)
   scene.add(models.character.object)

   models.character.clips['HumanArmature|Walking'].enabled = true
   models.character.clips['HumanArmature|Walking'].setEffectiveWeight(1)
   models.character.clips['HumanArmature|Walking'].play()

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

   // globals
   this.models = models
}

const render = function({ c3, time, clock }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      model.mixer.update(delta)
   }
}


window.c3 = new C3({ init, render })
window.c3.init()
