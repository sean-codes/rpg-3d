// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 5

// hold all the verticies in an array [x0, y0, z0, x1, y1, z1, xn, yn, zn]
const verticies = [] 
for (var i = 0; i < 100; i++) {
   verticies.push(
      Math.random()*10-5,
      Math.random()*10-5,
      Math.random()*10-5,
   )
}

// material to set color or points
const material = new THREE.PointsMaterial( { color: '#FF0000', transparent: true })

// Can use either of these. THREE docs recommends .setAttribute
// geometry.attributes.position = positions
const positions = new THREE.Float32BufferAttribute(verticies, 3)
const geometry  = new THREE.BufferGeometry()
geometry.setAttribute('position', positions)

// Put the geometry and material together!
const points = new THREE.Points(geometry, material)
scene.add(points)


// render
function render() {
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
