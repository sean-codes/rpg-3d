class C3_Model {
   constructor({ loadInfo, object }) {
      this.name = loadInfo.name
      this.object = object
      this.bones = {}
      this.currentClip = undefined

      object.traverse((part) => {
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
            this.bones[part.name] = part
         }

         if (part.type === 'Mesh' || part.type === 'SkinnedMesh') {
            part.receiveShadow = true
            part.castShadow = true

            if (loadInfo.offset) {
               part.geometry.translate(...loadInfo.offset)
            }

            if (loadInfo.rotation) {
               part.geometry.rotateX(loadInfo.rotation[0])
               part.geometry.rotateY(loadInfo.rotation[1])
               part.geometry.rotateZ(loadInfo.rotation[2])
            }
         }
      })

      // scale
      // scale after so we can adjust axis
      this.object.scale.x = loadInfo.scale
      this.object.scale.y = loadInfo.scale
      this.object.scale.z = loadInfo.scale

      //animations
      this.mixer = new THREE.AnimationMixer(this.object)
      this.clips = {}
      this.object.animations.forEach((animation) => {
         const definedClip = loadInfo.clips && loadInfo.clips.find(c => c.map === animation.name)
         if (definedClip) {
            if (definedClip.type === 'ADD') {            
               THREE.AnimationUtils.makeClipAdditive(animation)
            }
            
            const clip = this.mixer.clipAction(animation)
            clip.setEffectiveWeight(0)
            clip.play()
            this.clips[definedClip.name] = clip
         }
      })
   }
   
   clone() {
      return THREE.SkeletonUtils.clone(this.object)
   }
   
   boneToggle(boneName, model) {
      const bone = this.bones[boneName]
      let isToggled = false
      bone.traverse((part) => {
         if (part.uuid === model.object.uuid) isToggled = true
      })
      
      isToggled 
         ? this.boneRemove(boneName, model) 
         : this.boneAdd(boneName, model)
   }
   
   boneAdd(boneName, model) {
      this.bones[boneName].add(model.object)
   }
   
   boneRemove(boneName, model) {
      this.bones[boneName].remove(model.object)
   }
   
   animateStart(clipName) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.setEffectiveWeight(1)
      clip.play()
      
      this.currentClip = clip
   }
   
   animateTo(clipName, time) {
      const outClip = this.currentClip
      const inClip = this.clips[clipName]
      if (outClip === inClip) return
      
      inClip.setEffectiveWeight(1)
      inClip.crossFadeFrom(outClip, 0.1)
      inClip.enabled = true
      
      this.currentClip = inClip
   }
   
   animateOnce(clipName, onEnd) {
      const clip = this.clips[clipName]
      clip.reset()
      clip.setEffectiveWeight(1)

      const stopAnimation = (e) => {
         clip.setEffectiveWeight(0)
         onEnd && onEnd()
      }

      this.mixer.addEventListener('loop', (e) => {
         if (e.action.getClip().name === clip._clip.name) {
            stopAnimation()
         }
      })
   }
}

c3.Model = C3_Model