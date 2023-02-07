import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import waterVertexShader from '../shaders/water/vertex.glsl'
import waterFragmentShader from '../shaders/water/fragment.glsl'

const scene = new THREE.Scene()
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.append(renderer.domElement)

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(3, 3, 3)
scene.add(camera)

// camera controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//responsivity
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

// Debug
const gui = new dat.GUI({ width: 350 })
const debugObject = {}

//objects
const geometry = new THREE.PlaneGeometry(50,50,1000,1000);

// Colors
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
gui.addColor(debugObject, 'depthColor').onChange(() => { material.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })


const material = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {value: 0},
        uBigWavesSpeed: {value: 1 },


        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 0.3 },
        uSmallWavesSpeed: { value: 0.2 },

        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 0.5 }
    }
})


gui.add(material.uniforms.uBigWavesSpeed, "value").min(0).max(2).step(0.001).name("uBigWavesSpeed");
gui.add(material.uniforms.uBigWavesElevation, "value").min(0).max(1).step(0.001).name("uBigWavesElevation");
gui.add(material.uniforms.uBigWavesFrequency.value, "x").min(0).max(10).step(0.001).name("uBigWavesFrequencyX");
gui.add(material.uniforms.uBigWavesFrequency.value, "y").min(0).max(10).step(0.001).name("uBigWavesFrequencyY");
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(0.5).step(0.001).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(0.5).step(0.001).name('uSmallWavesSpeed')

gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(2).step(0.001).name('uColorMultiplier')




const mesh = new THREE.Mesh(geometry, material);

mesh.rotation.x = - Math.PI * 0.5;
scene.add(mesh)

//animate
function animate(time) {

    material.uniforms.uTime.value = time/1000
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)