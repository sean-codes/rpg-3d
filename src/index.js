// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import C3 from './C3';


const init = function(c3) {
   c3.camera.position.set(0, 4, 2)

   // Orbit Camera
   const controls = new OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 0, 0)
   controls.update()

   const ambientLight = new THREE.AmbientLight('#FFF', 0.75)
   c3.scene.add(ambientLight);

   const directionalLight = new THREE.DirectionalLight('#FFF');
   directionalLight.position.y += 4
   c3.scene.add(directionalLight);

   const lonGeometry = new THREE.BoxGeometry(1, 2)
   const lonMaterial = new THREE.MeshPhongMaterial({ color: '#F22' })
   const lonMesh = new THREE.Mesh(lonGeometry, lonMaterial)
   c3.scene.add(lonMesh)

   const latGeometry = new THREE.BoxGeometry(2, 1)
   const latMaterial = new THREE.MeshPhongMaterial({ color: '#F22' })
   const latMesh = new THREE.Mesh(latGeometry, latMaterial)
   lonMesh.add(latMesh)

   const latLonPointGeometry = new THREE.SphereGeometry(0.25)
   const latlonPointMaterial = new THREE.MeshPhongMaterial({ color: '#FF4' })
   const latLonPointMesh = new THREE.Mesh(latLonPointGeometry, latlonPointMaterial)
   latLonPointMesh.position.z = 2
   latMesh.add(latLonPointMesh)

   c3.datGui.add(lonMesh.rotation, 'y', -Math.PI, Math.PI, 0.001)
   c3.datGui.add(latMesh.rotation, 'x', -Math.PI, Math.PI, 0.001)
}

const render = function(c3) {

}


new C3({ init, render })
