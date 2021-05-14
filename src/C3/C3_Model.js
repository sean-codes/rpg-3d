class C3_Model {
   constructor({ loadInfo, object, isClone = false }) {
      
      this.loadInfo = loadInfo
      this.name = loadInfo.name
      // makes it easier to scale rorate etc without breaking animations
      this.object = new THREE.Object3D()
      this.object.add(object)
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
         }
      })
      
      if (loadInfo.offset) {
         object.translateX(loadInfo.offset[0] / loadInfo.scale)
         object.translateY(loadInfo.offset[1] / loadInfo.scale)
         object.translateZ(loadInfo.offset[2] / loadInfo.scale)
      }

      if (loadInfo.rotation) {
         object.rotateX(loadInfo.rotation[0])
         object.rotateY(loadInfo.rotation[1])
         object.rotateZ(loadInfo.rotation[2])
      }

      // scale
      // scale after so we can adjust axis
      this.object.scale.x = loadInfo.scale
      this.object.scale.y = loadInfo.scale
      this.object.scale.z = loadInfo.scale

      //animations
      this.mixer = new THREE.AnimationMixer(object)
      this.clips = {}
      object.animations && object.animations.forEach((animation) => {
         const definedClip = loadInfo.clips && loadInfo.clips.find(c => c.map === animation.name)
         let clipName = definedClip ? definedClip.name : animation.name
         let adjustedClip = animation
         if (definedClip) {
            if (definedClip.add) {  
               THREE.AnimationUtils.makeClipAdditive(adjustedClip)
            }
            
            if (definedClip.pose) {
               const { at } = definedClip.pose
               adjustedClip = THREE.AnimationUtils.subclip( animation, animation.name, 1, 2, 24 )
            }
            
            if(definedClip.stringed) {
               adjustedClip = THREE.AnimationUtils.subclip( animation, animation.name, 2, Math.round(animation.time * 24), 24 )
            }
         }
            
            
         const clip = this.mixer.clipAction(adjustedClip)
         clip.setEffectiveTimeScale(1)
         clip.setEffectiveWeight(0)
         clip.play()
         
         clip.c3_startAt = definedClip ? definedClip.startAt || 0 : 0
         clip.c3_weightCurrent = 0
         clip.c3_weightTarget = 0
         clip.c3_weightDampen = 0.25
         this.clips[clipName] = clip
      })
   }
   
   clone(name) {
      const clone = THREE.SkeletonUtils.clone(this.object.children[0])
      clone.animations = this.object.children[0].animations
   
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
   
   boneClear(boneName) {
      const bone = this.bones[boneName]
      
      for (let i = bone.children.length - 1; i > 0; i--) {
         bone.remove(bone.children[i])
      }
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
   
   animateAdd(clipName, { fade=0, syncWith=undefined }) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.reset()
      clip.play()
      clip.setEffectiveWeight(1)
      clip.fadeIn(fade)
      
      if (syncWith) {
         clip.time = this.clips[syncWith].time
      }
   }
   
   animateRemove(clipName, { fade=0 }) {
      const clip = this.clips[clipName]
      clip.fadeOut(fade)
   }
   
   animateOnce(clipName, onEnd) {
      const clip = this.clips[clipName]
      clip.reset()
      clip.enabled = true
      clip.clampWhenFinished = true
      clip.setLoop(THREE.LoopOnce, 1)
      clip.time = 0
      this.animateWeight(clipName, 1, true)
      const stopAnimation = (e) => {
         if (e.action.getClip().name === clip._clip.name) {
            this.mixer.removeEventListener('finished', stopAnimation)
            this.animateWeight(clipName, 0, true)
            onEnd && onEnd()
         }
      }

      this.mixer.addEventListener('finished', stopAnimation)
   }
   
   animateTime(clipName, time) {
      this.clips[clipName].time = time
   }
   
   animateScale(clipName, scale) {
      this.clips[clipName].timeScale = scale
   }
   
   animateWeight(clipName, weight, iSaidRightMeow = false) {
      // this.clips[clipName].setEffectiveWeight(weight)
      this.clips[clipName].c3_weightTarget = weight
      if (iSaidRightMeow) {
         this.clips[clipName].c3_weightCurrent = weight
      }
   }
   
   animateIsPlaying(clipName) {
      return this.clips[clipName].getEffectiveWeight() > 0
   }
   
   animateGetWeight(clipName) {
      return this.clips[clipName].c3_weightCurrent
   }
   
   loop(delta) {
      this.loopClipWeights(delta)
      this.mixer.update(delta)
   }
   
   loopClipWeights(delta) {
      // delta should probably be used in here somewhere
      for (const clipName in this.clips) {
         const clip = this.clips[clipName]
         
         const dampen = clip.c3_weightDampen
         
         const currentWeight = this.clips[clipName].c3_weightCurrent
         const targetWeight = this.clips[clipName].c3_weightTarget
         
         const diffWeight = targetWeight - currentWeight
         const newWeight = currentWeight + diffWeight * dampen // need math
         
         clip.c3_weightCurrent = newWeight
         clip.weight = newWeight
         clip.setEffectiveWeight(newWeight)
      }
   }
}

c3.Model = C3_Model
