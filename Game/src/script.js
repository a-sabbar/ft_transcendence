import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon'
import Stats from 'stats.js'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// FPS METER

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS (frame time), 2: MB (memory usage)
document.body.appendChild(stats.dom);

// Scene
const scene = new THREE.Scene()

// SOUND
const histsound = new Audio('/sounds/hit.mp3')
const rollsound = new Audio('/sounds/ball_roll.mp3')

rollsound.volume = 0
histsound.volume = 1
const playHitSound = (collision) =>
{
  const impctstrenght = collision.contact.getImpactVelocityAlongNormal()

  if(impctstrenght > 0.5 && ballBody.position.x != 0)
  {
    histsound.currentTime = 0
    histsound.play()
    rollsound.pause()
  }

}



// Models

// const modellight = new THREE.AmbientLight(0xffffff, 10);
// modellight.position.set(0, 0, 0);

const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/naturescene/naturescene.glb', (gltf) => {
  // console.log(gltf)
  const model1 = gltf.scene
  model1.position.set(0, 3, 0);
  model1.scale.set(50, 50, 50);
  model1.add(ambientLight);
  model1.roughness  = 0
  model1.metalness  = 0
  model1.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true; 
    }
  });
  scene.add(model1)
})

gltfLoader.load('/models/house/house.glb', (gltf) => {
  // console.log(gltf)
  const model1 = gltf.scene
  model1.position.set(0, 6, 120);
  model1.scale.set(50, 20, 20);
  model1.rotation.y = Math.PI
  model1.traverse((child) => {
    if (child.isMesh) {
      const material = child.material;

      if (material.hasOwnProperty('roughness')) {
        material.roughness = 5;
      }

      if (material.hasOwnProperty('metalness')) {
        material.metalness = 0; 
      }
    }
  });
  model1.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true; 
    }
  });

  scene.add(model1)
})

gltfLoader.load('/models/bigrock/bigrock.glb', (gltf) => {
  // console.log(gltf)
  const model1 = gltf.scene
  model1.position.set(-10.1, -1.12, -0.34);
  // model1.rotation.y = - Math.PI * 0.5
  model1.scale.set(11, 5 , 16.7);

  model1.traverse((child) => {
    if (child.isMesh) {
      const material = child.material;

      if (material.hasOwnProperty('roughness')) {
        material.roughness = 5;
      }

      if (material.hasOwnProperty('metalness')) {
        material.metalness = 0; 
      }
    }
  });

  model1.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true; 
      // child.receiveShadow = true;
    }
  });

  const model2 = model1.clone()
  model2.position.set(10.1, -1.12, 0.34);
  model2.rotation.y = Math.PI
  scene.add(model1)
  scene.add(model2)
})

// gltfLoader.load('/models/rocks/rocks.glb', (gltf) => {
//   console.log(gltf)
//   const model1 = gltf.scene
//   model1.position.set(-9, 2, 0);
//   model1.rotation.y = - Math.PI * 0.5
//   model1.scale.set(50, 30, 30);

//   model1.traverse((child) => {
//     if (child.isMesh) {
//       const material = child.material;

//       if (material.hasOwnProperty('roughness')) {
//         material.roughness = 5;
//       }

//       if (material.hasOwnProperty('metalness')) {
//         material.metalness = 0; 
//       }
//     }
//   });

//   const model2 = model1.clone()
//   model2.position.set(9, 2, 0);
//   model2.rotation.y = Math.PI * 0.5
//   // scene.add(model1)
//   // scene.add(model2)
// })

// TREES

// gltfLoader.load('/models/trees/Trees.glb', (gltf) => {
//   console.log(gltf)
//   const model = gltf.scene
//   model.position.set(-22, -1, 0);
//   model.scale.set(0.05, 0.05, 0.05);
//   const model2 = model.clone();
//   model2.position.set(26, -1, 0);
//   scene.add(model)
//   scene.add(model2)
// })

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcaptexture = textureLoader.load('/textures/matcaps/8.png')
const golfballtexture = textureLoader.load('/textures/golfball/obeaj.png')
const tennistexture = textureLoader.load('/textures/tennis/tennis_Color.png')

const ballstonecolor = textureLoader.load('/textures/ballstone/ballstone_basecolor.jpg')
const ballstoneambientOcclusion = textureLoader.load('/textures/ballstone/ballstone_ambientOcclusion.jpg')
const ballstoneheight = textureLoader.load('/textures/ballstone/ballstone_height.png')
const ballstonenormal = textureLoader.load('/textures/ballstone/ballstone_normal.jpg')
const ballstoneroughness = textureLoader.load('/textures/ballstone/ballstone_roughness.jpg')


//Watermelon

const watermeloncolor = textureLoader.load('/textures/watermelon/watermelon_basecolor.jpg')
const watermelonambientOcclusion = textureLoader.load('/textures/watermelon/watermelon_ambientOcclusion.jpg')
const watermelonheight = textureLoader.load('/textures/watermelon/watermelon_height.png')
const watermelonnormal = textureLoader.load('/textures/watermelon/watermelon_normal.jpg')
const watermelonroughness = textureLoader.load('/textures/watermelon/watermelon_roughness.jpg')

//candyball

const candyballcolor = textureLoader.load('/textures/candyball/candyball_basecolor.jpg')
const candyballambientOcclusion = textureLoader.load('/textures/candyball/candyball_ambientOcclusion.jpg')
const candyballheight = textureLoader.load('/textures/candyball/candyball_height.png')
const candyballnormal = textureLoader.load('/textures/candyball/candyball_normal.jpg')
const candyballroughness = textureLoader.load('/textures/candyball/candyball_roughness.jpg')


//Grass

const Grasscolor = textureLoader.load('/textures/Grass/Grass_basecolor.jpg')
const GrassambientOcclusion = textureLoader.load('/textures/Grass/Grass_ambientOcclusion.jpg')
const Grassheight = textureLoader.load('/textures/Grass/Grass_height.png')
const Grassnormal = textureLoader.load('/textures/Grass/Grass_normal.jpg')
const Grassroughness = textureLoader.load('/textures/Grass/Grass_roughness.jpg')

//rock

const rockcolor = textureLoader.load('/textures/rock/rock_basecolor.jpg')
const rockambientOcclusion = textureLoader.load('/textures/rock/rock_ambientOcclusion.jpg')
const rockheight = textureLoader.load('/textures/rock/rock_height.png')
const rocknormal = textureLoader.load('/textures/rock/rock_normal.jpg')
const rockroughness = textureLoader.load('/textures/rock/rock_roughness.jpg')

// Snow Particle

const particlesnow = textureLoader.load('/textures/particles/3.png')


Grasscolor.repeat.set(50,50)
GrassambientOcclusion.repeat.set(50,50)
Grassheight.repeat.set(50,50)
Grassnormal.repeat.set(50,50)
Grassroughness.repeat.set(50,50)

Grasscolor.wrapS = THREE.RepeatWrapping
GrassambientOcclusion.wrapS = THREE.RepeatWrapping
Grassheight.wrapS = THREE.RepeatWrapping
Grassnormal.wrapS = THREE.RepeatWrapping
Grassroughness.wrapS = THREE.RepeatWrapping

Grasscolor.wrapT = THREE.RepeatWrapping
GrassambientOcclusion.wrapT = THREE.RepeatWrapping
Grassheight.wrapT = THREE.RepeatWrapping
Grassnormal.wrapT = THREE.RepeatWrapping
Grassroughness.wrapT = THREE.RepeatWrapping

//Tiles

const Tilescolor = textureLoader.load('/textures/Tiles/Tiles_basecolor.jpg')
const TilesambientOcclusion = textureLoader.load('/textures/Tiles/Tiles_ambientOcclusion.jpg')
const Tilesheight = textureLoader.load('/textures/Tiles/Tiles_height.png')
const Tilesnormal = textureLoader.load('/textures/Tiles/Tiles_normal.jpg')
const Tilesroughness = textureLoader.load('/textures/Tiles/Tiles_roughness.jpg')

Tilescolor.repeat.set(5,5)
TilesambientOcclusion.repeat.set(5,5)
Tilesheight.repeat.set(5,5)
Tilesnormal.repeat.set(5,5)
Tilesroughness.repeat.set(5,5)

Tilescolor.wrapS = THREE.RepeatWrapping
TilesambientOcclusion.wrapS = THREE.RepeatWrapping
Tilesheight.wrapS = THREE.RepeatWrapping
Tilesnormal.wrapS = THREE.RepeatWrapping
Tilesroughness.wrapS = THREE.RepeatWrapping

Tilescolor.wrapT = THREE.RepeatWrapping
TilesambientOcclusion.wrapT = THREE.RepeatWrapping
Tilesheight.wrapT = THREE.RepeatWrapping
Tilesnormal.wrapT = THREE.RepeatWrapping
Tilesroughness.wrapT = THREE.RepeatWrapping



const cubetextureloader = new THREE.CubeTextureLoader()

// Environment map

// LDR cube texture
const environmentmap = cubetextureloader.load([
  'textures/skyMap/px.png',
  'textures/skyMap/nx.png',
  'textures/skyMap/py.png',
  'textures/skyMap/ny.png',
  'textures/skyMap/pz.png',
  'textures/skyMap/nz.png'
])

// scene.environment = environmentmap
scene.background = environmentmap

//CANNON WORLD

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// CANNON Materials

const simamaterial = new CANNON.Material('sima')
const plasticmaterial = new CANNON.Material('plastic')
// const defaultMaterial = new CANNON.Material('defaultMaterial')

const defaultcontactmaterial = new CANNON.ContactMaterial(
  simamaterial,
  plasticmaterial,
  {
    friction: 0, 
    restitution: 1,
  }
)
world.addContactMaterial(defaultcontactmaterial)

//ball physics

const ballradius = 0.35
const ballshape = new CANNON.Sphere(ballradius)
const ballBody = new CANNON.Body({
  mass: 0.001,
  position: new CANNON.Vec3(0, 0.4, 0),
  shape: ballshape,
  material: plasticmaterial
})
world.addBody(ballBody)
ballBody.linearDamping = 0;

function applyInitialVelocity(ballBody, initialVelocity, angularVelocity) {
  ballBody.velocity.copy(initialVelocity)
  ballBody.angularVelocity.copy(angularVelocity)
}

// const startPosition2 = new CANNON.Vec3(0, 0, 0);
const initialVelocity = new CANNON.Vec3(-8, 0, -8); 
const angularVelocity = new CANNON.Vec3(0, 5, 0);

let serve = 0
const servePower = 9
window.addEventListener('keydown', (event) => {
  let servedirection = Math.random() < 0.5 ? -50 : 50
  if (event.key === ' ' ) 
  {
    if(serve == 0)
    {
      // const bounceForce = new CANNON.Vec3(servedirection, 0,-servePower);
      // ballBody.applyImpulse(bounceForce, ballBody.position);
      applyInitialVelocity(ballBody, initialVelocity, angularVelocity)
      serve = 1
    }
  }
});
ballBody.angularDamping = 0

ballBody.addEventListener('collide', playHitSound)

// floor physics
const floorshape = new CANNON.Plane()
const floorbody = new CANNON.Body()
floorbody.mass = 0
floorbody.addShape(floorshape)
floorbody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorbody)

// paddles physics
const paddlewidth = 4
const paddleheight = 1
const paddledepth = 0.3

const paddle1x = 0
const paddle1y = 0.5
const paddle1z = 9

const paddleshape = new CANNON.Box(new CANNON.Vec3(paddlewidth/2, paddleheight/2, paddledepth/2))
const paddle1body = new CANNON.Body({
  mass: 0,
  shape: paddleshape,
  position: new CANNON.Vec3(paddle1x, paddle1y, paddle1z),
  material: simamaterial
})
const paddle2body = new CANNON.Body({
  mass: 0,
  shape: paddleshape,
  position: new CANNON.Vec3(paddle1x, paddle1y, -paddle1z),
  material: simamaterial
})
world.addBody(paddle1body) 
world.addBody(paddle2body) 

// WALLS physics
const wallwidth = 7
const wallheight = 2
const walldepth = 20

const wallx = 10
const wally = 1
const wallz = 0

const wallshape = new CANNON.Box(new CANNON.Vec3(wallwidth/2, wallheight/2, walldepth/2))
const wall1body = new CANNON.Body({
  mass: 0,
  shape: wallshape,
  position: new CANNON.Vec3(wallx, wally, wallz),
  material: simamaterial
})
const wall2body = new CANNON.Body({
  mass: 0,
  shape: wallshape,
  position: new CANNON.Vec3(-wallx, wally, wallz),
  material: simamaterial
  
})

world.addBody(wall1body)
world.addBody(wall2body)



// WALLS
const wallG = new THREE.BoxGeometry(wallwidth, wallheight, walldepth)
const wallM = new THREE.MeshStandardMaterial({ color: '#3a3a34'})


// wallM.map = rockcolor
wallM.aoMap = rockambientOcclusion
wallM.aoMapIntensity = 0.2
wallM.displacementMap = rockheight
wallM.displacementScale = 0
wallM.roughnessMap = rockroughness
wallM.normalMap = rocknormal

rockcolor.repeat.set(5,5)
rockambientOcclusion.repeat.set(5,5)
rockheight.repeat.set(5,5)
rocknormal.repeat.set(5,5)
rockroughness.repeat.set(5,5)

rockcolor.wrapS = THREE.RepeatWrapping
rockambientOcclusion.wrapS = THREE.RepeatWrapping
rockheight.wrapS = THREE.RepeatWrapping
rocknormal.wrapS = THREE.RepeatWrapping
rockroughness.wrapS = THREE.RepeatWrapping

rockcolor.wrapT = THREE.RepeatWrapping
rockambientOcclusion.wrapT = THREE.RepeatWrapping
rockheight.wrapT = THREE.RepeatWrapping
rocknormal.wrapT = THREE.RepeatWrapping
rockroughness.wrapT = THREE.RepeatWrapping

const wall1 = new THREE.Mesh(wallG, wallM)
wall1.position.set(wallx, wally, wallz)
// scene.add(wall1)
wall1.castShadow = true

const wall2 = new THREE.Mesh(wallG, wallM)
wall2.position.set(-wallx, wally, wallz)
// scene.add(wall2)
wall2.castShadow = true
// console.log(wall2.position)
// console.log(wall2body.position)

// BOX
const boxG =  new THREE.BoxGeometry(paddlewidth, paddleheight, paddledepth)
// const boxM = new THREE.MeshStandardMaterial({ color: '#FF0000' })
const boxM = new THREE.MeshStandardMaterial({ color: '#5BAEB7' })

const box = new THREE.Mesh(boxG, boxM)
box.position.set(paddle1x, paddle1y, paddle1z)
box.castShadow = true
scene.add(box)

const box2 = new THREE.Mesh(boxG, boxM)
box2.position.set(paddle1x, paddle1y, -paddle1z)
box2.castShadow = true
scene.add(box2)

const boxSpeed = 0.3; 


// Define the key states
const keys = {
  left: false,
  right: false,
};

const keys2 = {
  left2: false,
  right2: false,
};

document.addEventListener('keydown', (event) => {
  handleKeyDown(event.key);
});

document.addEventListener('keyup', (event) => {
  handleKeyUp(event.key);
});

// box 2
document.addEventListener('keydown', (event) => {
  handleKeyDown2(event.key);
});

document.addEventListener('keyup', (event) => {
  handleKeyUp2(event.key);
});


// Function to handle keydown events
function handleKeyDown(key) {
  if (key === 'a') keys.left = true;
  if (key === 'd') keys.right = true;
}

function handleKeyDown2(key) {
  if (key === 'ArrowLeft') keys2.left2 = true;
  if (key === 'ArrowRight') keys2.right2 = true;
}

// Function to handle keyup events
function handleKeyUp(key) {
  if (key === 'a') keys.left = false;
  if (key === 'd') keys.right = false;
}

function handleKeyUp2(key) {
  if (key === 'ArrowLeft') keys2.left2 = false;
  if (key === 'ArrowRight') keys2.right2 = false;
}

const leftLimit = -4.5;
const rightLimit = 4.5;


function updatebox() {
  if (keys.left) {
    if (box.position.x > leftLimit) {
      box.translateX(-boxSpeed);
      paddle1body.position.copy(box.position)
    }
  }
  if (keys.right) {
    if (box.position.x < rightLimit) {
      box.translateX(boxSpeed);
      paddle1body.position.copy(box.position)
    }
  }
}

function updatebox2() {
  if (keys2.left2) {
    if (box2.position.x > leftLimit) {
      box2.translateX(-boxSpeed);
      paddle2body.position.copy(box2.position)
    }
  }
  if (keys2.right2) {
    if (box2.position.x < rightLimit) {
      box2.translateX(boxSpeed);
      paddle2body.position.copy(box2.position)
    }
  }
}

// AI PLAYER

const ballPosition = ballBody.position;
const ballVelocity = ballBody.velocity;
const aipaddlespeed = 1
const AIreactiontime = 2
const AIreactionvariability = 100

function AImoveRight() {
  ballBody.position.x += aipaddlespeed
}
function AImoveLeft() {
  ballBody.position.x -= aipaddlespeed
}

function updateAIPaddle(aiPaddle, ballPosition) {
  if (ballPosition.x > aiPaddle.position.x) {
      aiPaddle.AImoveRight();
  } else if (ballPosition.x < aiPaddle.position.x) {
      aiPaddle.AImoveLeft();
  }
}

// function delayedAIUpdate() {
//   // setTimeout(() => {
//       updateAIPaddle(paddle2body, ballPosition);
//       delayedAIUpdate();
//   // }, AIreactiontime + Math.random() * AIreactionvariability);
// }

// delayedAIUpdate();




// // render loop
// function animate() {
//   requestAnimationFrame(animate);
  
//   // Update box based on key states
//   updatebox2();
//   updatebox();
  
//   //   renderer.render(scene, box);
// }

// animate();

// Floor

const floor1material = new THREE.MeshStandardMaterial({ color: '#147114' })


// Floor color picker
// const materialConfig = {
//   color: floor1material.color.getHex(),
// };

// const materialFolder = gui.addFolder("Material Configuration");
// const colorController = materialFolder.addColor(materialConfig, "color");

// colorController.onChange(function (newColor) {
//   floor1material.color.set(newColor);
// });


const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  floor1material
)
// gui.add(floor1material, 'roughness').min(0).max(5).step(0.001)
// gui.add(floor1material, 'metalness').min(0).max(5).step(0.001)

// floor1material.map = Grasscolor
// floor1material.aoMap = GrassambientOcclusion
// floor1material.aoMapIntensity = 10
// floor1material.displacementMap = Grassheight
// floor1material.displacementScale = 0.01
// floor1material.roughnessMap = Grassroughness
// floor1material.normalMap = Grassnormal

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.scale.set(10, 10, 10)
scene.add(floor)
floor.receiveShadow = true
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

const floor2material = new THREE.MeshStandardMaterial({ color: '#003c71' })
const floor2 = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    floor2material
)
floor2.rotation.x = - Math.PI * 0.5
floor2.position.y = 0.01
scene.add(floor2)
floor2.receiveShadow = true

// floor2material.map = Tilescolor
// floor2material.aoMap = TilesambientOcclusion
// floor2material.aoMapIntensity = 10
// floor2material.displacementMap = Tilesheight
// floor2material.displacementScale = 0.01
// floor2material.roughnessMap = Tilesroughness
// floor2material.normalMap = Tilesnormal
// floor2.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor2.geometry.attributes.uv.array, 2))

// Stripe 2

const stripematerial = new THREE.MeshStandardMaterial({ color: '#FFFFFF'})

const stripe = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 0.2),
  stripematerial
)
stripe.receiveShadow = true
stripe.rotation.x = - Math.PI * 0.5
stripe.position.y = 0.02
scene.add(stripe)

const stripe2 = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 0.03),
  stripematerial
)
stripe2.receiveShadow = true
stripe2.rotation.z = - Math.PI * 0.5
stripe2.rotation.x = - Math.PI * 0.5
stripe2.position.y = 0.02
scene.add(stripe2)


const stripe3 = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 0.1),
  stripematerial
)
stripe3.receiveShadow = true
stripe3.rotation.x = - Math.PI * 0.5
stripe3.position.y = 0.02
stripe3.position.z = 9.95
scene.add(stripe3)

const stripe4 = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 0.1),
  stripematerial
)
stripe4.receiveShadow = true
stripe4.rotation.x = - Math.PI * 0.5
stripe4.position.y = 0.02
stripe4.position.z = -9.95
scene.add(stripe4)

const stripe5 = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 0.5),
  stripematerial
)
stripe5.receiveShadow = true
stripe5.rotation.x = - Math.PI * 0.5
stripe5.rotation.y = Math.PI
stripe5.position.y = 0.02
// stripe5.position.z = -9.95
scene.add(stripe5)


//BALL

const ballMaterial = new THREE.MeshStandardMaterial()

// const ballMaterial = new THREE.MeshMatcapMaterial({ color: '#F0FFFF' })
// ballMaterial.matcap = matcaptexture
// ballMaterial.color = 0x000000
// ballMaterial.envMap = environmentmap


// ballMaterial.map = ballstonecolor
// ballMaterial.aoMap = ballstoneambientOcclusion
// ballMaterial.aoMapIntensity = 10
// ballMaterial.displacementMap = ballstoneheight
// ballMaterial.displacementScale = 0.01
// ballMaterial.roughnessMap = ballstoneroughness
// ballMaterial.normalMap = ballstonenormal

// ballMaterial.map = watermeloncolor
// ballMaterial.aoMap = watermelonambientOcclusion
// ballMaterial.aoMapIntensity = 10
// ballMaterial.displacementMap = watermelonheight
// ballMaterial.displacementScale = 0.01
// ballMaterial.roughnessMap = watermelonroughness
// ballMaterial.normalMap = watermelonnormal

ballMaterial.map = candyballcolor
ballMaterial.aoMap = candyballambientOcclusion
ballMaterial.aoMapIntensity = 0.1
ballMaterial.displacementMap = candyballheight
ballMaterial.displacementScale = 0.01
ballMaterial.roughnessMap = candyballroughness
ballMaterial.normalMap = candyballnormal

ballMaterial.transparent = true

ballMaterial.roughness = 0.3
ballMaterial.metalness = 0.08
// gui.add(ballMaterial, 'roughness').min(0).max(5).step(0.001)
// gui.add(ballMaterial, 'metalness').min(0).max(5).step(0.001)
const ball = new THREE.Mesh(
    new THREE.SphereGeometry( ballradius, 32, 16 ),
    // new THREE.BoxGeometry( 1, 1, 1 ),
    ballMaterial
)
ball.position.set(0, 0.4, 0)
// gui.add(ball.position, 'z').min(0).max(5).step(0.001)
// gui.add(ballBody.position, 'z').min(-20).max(20).step(0.001)

ballBody.position.copy(ball.position)
scene.add(ball)
ball.castShadow = true

// PRTICLES

const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)

const particlecount = 22000
// const particlespeed = 1
const snowfallArea = 200;
const snowflakeFallSpeed = 3;
const positions = new Float32Array(particlecount * 3)

for (let i = 0; i < particlecount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * snowfallArea;
    positions[i + 1] = Math.random() * snowfallArea;
    positions[i + 2] = (Math.random() - 0.5) * snowfallArea;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.3,
  sizeAttenuation: true,
  map: particlesnow,
  transparent: true,
  alphaMap: particlesnow,
  // alphaTest: 0.001,
  depthWrite: false,
  blending: THREE.AdditiveBlending
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// BALL SPEED SYSTEM

const speedtreshold = 0
const speedmultiplier = 1.7

ballBody.addEventListener('collide', (e) => {
  const relativeSpeed = e.contact.getImpactVelocityAlongNormal();
  if (relativeSpeed > speedtreshold) {
    console.log("HEUYYY ", relativeSpeed)
    const currentVelocity = ballBody.velocity;
    const newVelocity = currentVelocity.scale(speedmultiplier);
    ballBody.velocity.copy(newVelocity);
  }
});





/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 1) 
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const Mylight = new THREE.DirectionalLight('#ffffff', 0.6)
Mylight.position.set(-0.04, 4.5, - 4)
// gui.add(Mylight, 'intensity').min(0).max(1).step(0.001)
// gui.add(Mylight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(Mylight.position, 'y').min(- 5).max(10).step(0.001)
// gui.add(Mylight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(Mylight)
Mylight.castShadow = true

Mylight.shadow.mapSize.width = 1024 * 10;
Mylight.shadow.mapSize.height = 1024 * 10;
Mylight.shadow.camera.left = -120;
Mylight.shadow.camera.right = 120;
Mylight.shadow.camera.top = 120;
Mylight.shadow.camera.bottom = -120;
Mylight.shadow.camera.near = -50;
Mylight.shadow.camera.far = 60;

// const Directionallightcamerahelper = new THREE.CameraHelper(Mylight.shadow.camera)
// scene.add(Directionallightcamerahelper)

// const shadowCameraHelper = new THREE.CameraHelper(Mylight.shadow.camera);
// scene.add(shadowCameraHelper);

// Fog

const fog = new THREE.Fog('#a0978d', 1, 170)
scene.fog = fog


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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 20
// gui.add(camera.position, 'x')
scene.add(camera)
camera.lookAt(0, 0, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// CANNON debug renderer

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
// renderer.setClearColor('#a0978d')


const initialRotation = new THREE.Quaternion();
/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltatime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    //update physics world
    world.step(1/60, deltatime,3)
    ballBody.collisionResponse = true;

    stats.update();

    if(ballBody.position.z > 10 || ballBody.position.z < -10)
    {
      serve = 0
      ballBody.position.set(0, 0.4, 0)
      ballBody.velocity.set(0, 0, 0);
      ballBody.quaternion.copy(initialRotation)
      ballBody.angularVelocity.set(0, 0, 0);
      // histsound.play()
    }
    ball.quaternion.copy(ballBody.quaternion)
    ball.position.copy(ballBody.position)

    // PLAYER PADDLE CONTROL
    updatebox2();
    updatebox();


    // AI PADDLE CONTROL
    // delayedAIUpdate();

    // if(ball.position.x > leftLimit && ball.position.x < rightLimit)
    // {
    //   box2.position.x = ball.position.x
    //   paddle2body.position.copy(box2.position)
    // }
    
    // Animate snow particles
    const snowflakePositions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlecount * 3; i += 3) {
        // Update the y-coordinate to simulate falling.
        snowflakePositions[i + 1] -= snowflakeFallSpeed * deltatime;

        // Reset the snowflake's position if it falls below the scene.
        if (snowflakePositions[i + 1] < -snowfallArea / 2) {
            snowflakePositions[i] = (Math.random() - 0.5) * snowfallArea;
            snowflakePositions[i + 1] = (Math.random() - 0.5) * 100 // Reset to above the scene.
            snowflakePositions[i + 2] = (Math.random() - 0.5) * snowfallArea;
        }
    }


    const rollingThreshold = 0.01;


      const isRolling = ballBody.angularVelocity.lengthSquared() > rollingThreshold * rollingThreshold;

      if (isRolling) {
        rollsound.play()
      } else {
        rollsound.pause()
      }

    // function monitorBallVelocity() {
    //   const ballVelocity = ballBody.velocity;
    //   console.log(`Ball Velocity: x=${ballVelocity.x}, y=${ballVelocity.y}, z=${ballVelocity.z}`);
    // }
    
    // setInterval(monitorBallVelocity, 10000); 
    

    // Ensure the geometry knows it has been updated.
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update Particles

    // particles.rotation.x = elapsedTime * 0.05
    // particles.rotation.z = elapsedTime * 0.02
    // console.log("velocity", ballBody.velocity)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()