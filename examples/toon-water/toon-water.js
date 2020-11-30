// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)


const shader = `
uniform vec2 iResolution;
varying vec2 vUv;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
   vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1
   fragColor = vec4(uv.x, uv.y, 0.0, 1.0);
}

void main() {
   mainImage(gl_FragColor, vUv * gl_FragCoord.xy);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const uniforms = {
   iTime: { value: 0 },
   iResolution: { value: new THREE.Vector3() }
}

const geometry = new THREE.PlaneGeometry(5, 5, 1)
// const material = new THREE.MeshBasicMaterial({ color: '#FFF' })
const material = new THREE.ShaderMaterial({ 
   vertexShader: vertexShader, 
   fragmentShader: shader, 
   uniforms: uniforms,
   // transparent: true,
   // opacity: 0.95,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



// render
function render(time) {
   uniforms.iResolution.value.set(1000, 1000)
   uniforms.iTime.value = time * 0.001
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   // mesh.rotation.x += 0.01
   // mesh.rotation.y += 0.01
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
