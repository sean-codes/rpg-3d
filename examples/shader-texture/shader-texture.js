// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)


const fShader = `
uniform vec2 iResolution;
varying vec2 vUv;
uniform sampler2D iChannel0;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
   fragColor = texture2D(iChannel0, fragCoord);
}

void main() {
   mainImage(gl_FragColor, vUv * gl_FragCoord.xy);
}
`

const vShader = `
varying vec2 vUv;
void main() {
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const texture = new THREE.TextureLoader().load('../../assets/grass.png', tex => {
   tex.minFilter = THREE.NearestFilter;
   tex.magFilter = THREE.NearestFilter;
   tex.wrapS = THREE.RepeatWrapping;
   tex.wrapT = THREE.RepeatWrapping;
   const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iChannel0: { value: texture },
      // texSize: { value : new THREE.Vector2(texture.image.width, texture.image.height) }
   }
   
   console.log(texture.image.width, texture.image.height)

   const geometry = new THREE.PlaneGeometry(5, 5, 1)
   const material = new THREE.ShaderMaterial({ 
      vertexShader: vShader, 
      fragmentShader: fShader, 
      uniforms: uniforms,
   })
   const mesh = new THREE.Mesh(geometry, material)
   scene.add(mesh)
   
})





// render
function render(time) {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
