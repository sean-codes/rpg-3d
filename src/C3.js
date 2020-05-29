
// Cats, Code, and Coffee
class C3 {
   constructor({ init, render }) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.shadowMap.enabled = true;
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.001, 1000);
      this.scene = new THREE.Scene();
      this.datGui = new dat.GUI();
      this.keys = {}
      this.clock = new THREE.Clock()

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
}
