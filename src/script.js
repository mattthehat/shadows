import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui';

const gui = new dat.GUI({
    width: 400
})

const params = {
    color: 0x0000ff,
    spin: () => {
        gsap.to(mesh.rotation, {duration: 2, y: mesh.rotation.y + Math.PI * 2})
    },
    height: 1
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Object
 */

const projectionWallGeometry = new THREE.BoxBufferGeometry(80, 30, 1)
const projectionMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
const wallProjection = new THREE.Mesh(projectionWallGeometry, projectionMaterial)

wallProjection.position.set(0,5, -10)

const floorProjectionGeometry = new THREE.BoxBufferGeometry(80, 1, 30)
const floorProjection = new THREE.Mesh(floorProjectionGeometry, projectionMaterial)

floorProjection.position.y = -10
floorProjection.position.z  = 5

wallProjection.receiveShadow = true
floorProjection.receiveShadow = true

scene.add(wallProjection, floorProjection)

const boxGeometry = new THREE.BoxBufferGeometry(3,3,3)
const boxMaterial = new THREE.MeshStandardMaterial({color: 0xf4f4f4})
boxMaterial.roughness = 5
const box = new THREE.Mesh(boxGeometry, boxMaterial)

box.position.set(-30,0,18)

box.castShadow = true

scene.add(box)

const torusGeometry = new THREE.TorusBufferGeometry(5, 1, 16, 100)
const torus = new THREE.Mesh(torusGeometry, boxMaterial)

torus.castShadow = true
torus.receiveShadow = true

scene.add(torus)

torus.position.set(12, 3, 8)

const octGeometry = new THREE.OctahedronGeometry(6, 2)
const oct = new THREE.Mesh(octGeometry, boxMaterial)
oct.position.set(-12, 0, 10)
oct.castShadow = true
oct.receiveShadow = true

scene.add(oct)


const lightConfig = {
    colour: 0xde5555,
    colour2: 0x334a87,
    colour3: 0xcfb633
}

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1) 
scene.add(ambientLight)

const pointLight = new THREE.PointLight(lightConfig.colour, 0.6)
scene.add(pointLight)

pointLight.position.set(0, 8, 32)

pointLight.castShadow = true



const pointLightHelper = new THREE.PointLightHelper(pointLight, 3)


// scene.add(pointLightHelper)

gui.addColor(lightConfig, 'colour' )
    .onChange(() => {
        pointLight.color.set(lightConfig.colour)
    })
    .name('Light Colour')

gui.add(pointLight, 'intensity')
    .min(0.1)
    .max(1)
    .step(0.01)
    .name('Light Intensity')

gui.add(pointLight.position, 'y')
    .min(0)
    .max(15)
    .step(0.1)
    .name('Light Height')    
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-11,24,51)
scene.add(camera)

scene.fog = new THREE.Fog(0xf4f4f4, 10, 1000)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */

const cursor = {
    x:0,
    y:0
} 

gsap.to(box.position, {duration: 4, x: 30, repeat: -1, yoyo: true, ease: 'easeInOut'})
gsap.to(box.position, {duration: 4, y: 15, repeat: -1, yoyo: true, ease: 'easeInOut'})
gsap.to(oct.position, {duration: 1, y: 8, repeat: -1, yoyo: true})

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    box.rotation.y = elapsedTime * 3
    oct.rotation.x = elapsedTime 
   
    torus.rotation.y = elapsedTime 
    torus.rotation.x = elapsedTime 

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()