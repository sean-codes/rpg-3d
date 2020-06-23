
// Cats, Code, and Coffee
class C3 {
   constructor({ init, render }) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.shadowMap.enabled = true
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.001, 1000)
      this.scene = new THREE.Scene()
      this.clock = new THREE.Clock()
      this.datGui = new dat.GUI();
      this.keys = {}

      this.userObject = {};
      this.userInitFunction = init.bind(this.userObject);
      this.userRenderFunction = render.bind(this.userObject);
   }

   async init() {
      this.renderer.domElement.tabIndex = 1
      document.body.appendChild(this.renderer.domElement);
      window.onresize = () => this.handleResize();
      this.handleResize();
      document.body.addEventListener('keydown', e => { !e.repeat && this.onKeyDown(e.keyCode)})
      document.body.addEventListener('keyup', e => { this.onKeyUp(e.keyCode) })

      await this.userInitFunction({
         c3: this,
         scene: this.scene,
         renderer: this.renderer,
         camera: this.camera,
         datGui: this.datGui,
         clock: this.clock
      });
      window.requestAnimationFrame((time) => this.render(time));
   }

   handleResize() {
      const pixelRatio = 1 //window.devicePixelRatio

      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.renderer.domElement.width = width;
      this.renderer.domElement.height = height;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width/height;
      this.camera.updateProjectionMatrix();
   }

   render(time) {
      window.requestAnimationFrame((time) => this.render(time));
      this.renderer.render(this.scene, this.camera);

      this.userRenderFunction({
         c3: this,
         time,
         scene: this.scene,
         renderer: this.renderer,
         camera: this.camera,
         datGui: this.datGui,
         clock: this.clock
      });

      this.resetKeys()
   }

   toStringVec3(v3, precision = 3) {
      return `${v3.x.toFixed(precision)}, ${v3.y.toFixed(precision)}, ${v3.z.toFixed(precision)}`;
   }

   logSceneGraph(obj, isFirst = true, lines = [], isLast = true, prefix = '') {
      const localPrefix = isLast ? '└─' : '├─';
      lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
      const dataPrefix = obj.children.length
        ? (isLast ? '  │ ' : '│ │ ')
        : (isLast ? '    ' : '│   ');
      lines.push(`${prefix}${dataPrefix}  pos: ${this.toStringVec3(obj.position)}`);
      lines.push(`${prefix}${dataPrefix}  rot: ${this.toStringVec3(obj.rotation)}`);
      lines.push(`${prefix}${dataPrefix}  scl: ${this.toStringVec3(obj.scale)}`);
      const newPrefix = prefix + (isLast ? '  ' : '│ ');
      const lastNdx = obj.children.length - 1;
      obj.children.forEach((child, ndx) => {
         const isLast = ndx === lastNdx;
         this.logSceneGraph(child, false, lines, isLast, newPrefix);
      });

      if (isFirst) console.log(lines.join('\n'));
      else return lines;
   }

   logAnimations(object) {
      const animations = []
      for (const i in object.animations) {
         animations.push(`[${i}] ${object.animations[i].name}`)
      }

      console.log(animations.join('\n'))
   }


   // weak keyboard util
   onKeyDown(keyCode) {
      this.keys[keyCode] = { up: false, down: true, held: true }
   }

   onKeyUp(keyCode) {
      this.keys[keyCode] = { up: true, down: false, held: false }
   }

   checkKey(keyCode) {
      return this.keys[keyCode] || { up: false, down: false, help: false }
   }

   resetKeys() {
      for (const keyId in this.keys) {
         this.keys[keyId].up = false
         this.keys[keyId].down = false
      }
   }
   
   async loadModels(models) {
      const loader = new THREE.FBXLoader()

      return new Promise((yay, nay) => {
         let loading = Object.keys(models).length
         for (const modelName in models) {
            const model = models[modelName]
            loader.load(model.file, (object) => {
               model.log && console.log('loaded model: ' + modelName, object)
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
               model.mixer = 
               model.mixers = {}
               model.clips = {}
               model.object.animations.forEach((animation) => {
                  const mappedClip = model.clipMap ? model.clipMap.find(c => c.map === animation.name) : undefined
                  const additive = mappedClip ? mappedClip.add : false
                  const isPose = mappedClip ? mappedClip.pose : false
                  const object = mappedClip && mappedClip.object ? model.object.getObjectByName(mappedClip.object) : model.object
                  if (mappedClip && mappedClip.object ) {
                     console.log('found object', object)
                     
                  }
                  if (additive) {
                     THREE.AnimationUtils.makeClipAdditive(animation)
                     
                     
                  }
                  const mixer = model.mixers[object.name] || new THREE.AnimationMixer(object)
                  if (isPose) {
                     animation = THREE.AnimationUtils.subclip( animation, animation.name, 2, 3, 30 );
                  }
                  let clip = mixer.clipAction(animation)
                  clip.setEffectiveWeight(0)
                  clip.play()
                  model.mixers[object.name] = mixer
                  model.clips[animation.name] = clip
               })
               
               if (model.log) {
                  console.log('Setup Model: ' + model.name, model)
               }
               // finish loading
               loading -= 1
               if (!loading) yay(models)
            }, null, (e) => { throw e })
         }
      })
   }
}
