class C3_Model {
   constructor({ loadInfo, object, isClone = false }) {
      this.loadInfo = loadInfo
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
               if (!isClone) {   
                  part.geometry.rotateX(loadInfo.rotation[0])
                  part.geometry.rotateY(loadInfo.rotation[1])
                  part.geometry.rotateZ(loadInfo.rotation[2])
               }
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
         let clipName = definedClip ? definedClip.name : animation.name
         let adjustedClip = animation
         if (definedClip) {
            if (definedClip.type === 'ADD') {  
               THREE.AnimationUtils.makeClipAdditive(adjustedClip)
            }
            
            if (definedClip.pose) {
               const { at } = definedClip.pose
               adjustedClip = THREE.AnimationUtils.subclip(adjustedClip, animation.name, at, at+1, 30)
            }
         }
            
            
         const clip = this.mixer.clipAction(adjustedClip)
         clip.setEffectiveTimeScale(1)
         clip.time = 1
         clip.c3_startAt = definedClip ? definedClip.startAt || 0 : 0
         clip.setEffectiveWeight(0)
         clip.play()
         this.clips[clipName] = clip
      })
   }
   
   clone(name) {
      const clone = THREE.SkeletonUtils.clone(this.object)
      clone.animations = this.object.animations
   
      const newModel = c3.models.add({
         loadInfo: { ...this.loadInfo, name },
         object: clone,
         isClone: true
      })
      
      return newModel
   }
   
   boneToggle(boneName, model) {
      const bone = this.bones[boneName]
      const object = model.uuid ? model : model.object
      
      let isToggled = false
      bone.traverse((part) => {   
         if (part.uuid === object.uuid) isToggled = true
      })
      
      isToggled 
         ? this.boneRemove(boneName, model) 
         : this.boneAdd(boneName, model)
   }
   
   boneAdd(boneName, model) {
      this.bones[boneName].add(model.object ? model.object : model)
   }
   
   boneRemove(boneName, model) {
      this.bones[boneName].remove(model.object ? model.object : model)
   }
   
   animateSetClipTime(clipName, time) {
      const clip = this.clips[clipName]
      clip.time = time
   }
   
   animateStart(clipName, { time = 0 } = {}) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.setEffectiveWeight(1)
      clip.play()
      
      clip.time = time
      
      this.currentClip = clip
   }
   
   animateTo(clipName, time) {
      const outClip = this.currentClip
      const inClip = this.clips[clipName]
      if (outClip === inClip) return
      
      
      inClip.time = 0
      inClip.enabled = true
      inClip.setEffectiveWeight(1)
      inClip.crossFadeFrom(outClip, time)
      
      this.currentClip = inClip
   }
   
   animateAdd(clipName, time=0) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.reset()
      clip.setEffectiveWeight(1)
      clip.fadeIn(time)
   }
   
   animateRemove(clipName, time=0) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.reset()
      clip.setEffectiveWeight(0)
      clip.fadeOut(time)
   }
   
   animateOnce(clipName, time=0.1, onEnd) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.reset()
      clip.time = clip.c3_startAt
      clip.setEffectiveWeight(1)
      clip.fadeIn(time)

      const stopAnimation = (e) => {
         clip.fadeOut(time)
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
