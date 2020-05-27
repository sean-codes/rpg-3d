# Equipment Points / Attaching objects to bones
![Equipment Points](./images/equipment-points.gif)

```js
// 1. Load a bunch of models
// Going to add some modifiers for scale/rotation to get them positioned right
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


         // 2. Loop over all the parts of the model
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

            // 3. Add Bones to the model
            if (part.type === 'Bone') {
               model.bones[part.name] = part
            }

            // 4. Adjust rotation/offset(axis)
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

         // 5. Add animation mixer and clips to the model
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

// 6. Attach the models to the correct bones
// After I did this is when I went back up and messed around with rotation/offset
models.character.bones.Head.add(models.helmet.object)
models.character.bones.PalmR.add(models.sword.object)
models.character.bones.PalmL.add(models.shield.object)
models.character.bones.Neck.add(models.shoulderPads.object)

// 7. Play a clip for demo
models.character.clips['HumanArmature|Walking'].enabled = true
models.character.clips['HumanArmature|Walking'].setEffectiveWeight(1)
models.character.clips['HumanArmature|Walking'].play()

// 8. Add to scene!
scene.add(models.character.object)

// 9. OPTIONAL DatGUI setup
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
```
