
// Cats, Code, and Coffee
class C3 {
   constructor({ init, render }) {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.shadowMap.enabled = true;
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 31, 10001);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#666')
      this.datGui = new dat.GUI();

      this.userObject = {};
      this.userInitFunction = init.bind(this.userObject);
      this.userRenderFunction = render.bind(this.userObject);
   }

   async init() {
      document.body.appendChild(this.renderer.domElement);
      window.onresize = () => this.handleResize();
      this.handleResize();

      await this.userInitFunction(this);
      window.requestAnimationFrame((time) => this.render(time));
   }

   handleResize() {
      const pixelRatio = window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.renderer.domElement.width = width;
      this.renderer.domElement.height = height;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width/height;
      this.camera.updateProjectionMatrix();
   }

   render(time) {
      // console.log(time)

      window.requestAnimationFrame((time) => this.render(time));
      this.renderer.render(this.scene, this.camera);

      this.userRenderFunction(this, time);
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
}
