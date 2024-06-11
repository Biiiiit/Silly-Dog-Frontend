import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import TWEEN from "@tweenjs/tween.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white
THREE.ColorManagement.enabled = true;

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Set up ambient light with a slightly darker color and higher intensity
const ambientLight = new THREE.AmbientLight(0xf2f2f2, 5); // Use a slightly darker color
scene.add(ambientLight);

// Add a directional light representing the camera light
const cameraLight = new THREE.DirectionalLight(0xffffff, 5);
cameraLight.position.copy(camera.position); // Position the light at the same position as the camera
scene.add(cameraLight);

// Enable shadow casting for the light
cameraLight.castShadow = true;

// Set up shadow properties
cameraLight.shadow.mapSize.width = 1024; // Optional: Increase map size for smoother shadows
cameraLight.shadow.mapSize.height = 1024; // Optional: Increase map size for smoother shadows
cameraLight.shadow.camera.near = 0.5; // Optional: Adjust near and far values for shadow camera
cameraLight.shadow.camera.far = 500; // Optional: Adjust near and far values for shadow camera

let textMesh;
let pivot;
let scaleValue = 1;
const scaleSpeed = 0.055;
const rotationSpeed = 0.5;

// Load the font and create the text geometry
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Press any button to continue...', {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Center the geometry
    textGeometry.computeBoundingBox();
    const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(centerOffset, 0, 0); // Adjust position as needed

    // Create a pivot point
    pivot = new THREE.Object3D();
    pivot.add(textMesh);
    scene.add(pivot);
    pivot.position.set(0, 1, -10); // Adjust pivot position as needed

    // Start the scaling and rotation animation
    scaleAndRotateAnimation();
});

// Function to remove the text geometry
const removeTextGeometry = () => {
    if (pivot) {
        scene.remove(pivot);
    }
    // Initialize the letters and start the animation loop after the text geometry is removed
    initLetters().then(() => {
        animate();
    });
};

// Listen for keydown and mousedown events
window.addEventListener('keydown', removeTextGeometry);
window.addEventListener('mousedown', removeTextGeometry);

// Scaling and rotation animation loop with easing
function scaleAndRotateAnimation() {
  requestAnimationFrame(scaleAndRotateAnimation);
  if (pivot) {
      // Update the scale using a sinusoidal function
      scaleValue += scaleSpeed;
      const scale = 1 + 0.1 * Math.sin(scaleValue);
      pivot.scale.set(scale, scale, scale);

      // Apply twisting rotation effect
      const rotationAngleY = 0.1 * Math.sin(scaleValue * rotationSpeed);
      const rotationAngleZ = 0.1 * Math.sin(scaleValue * rotationSpeed);
      const rotationAngleX = 0.1 * Math.sin(scaleValue * rotationSpeed);
      pivot.rotation.y = rotationAngleY;
      pivot.rotation.z = rotationAngleZ;
      pivot.rotation.x = rotationAngleX;

      // Adjust position to keep the text centered
      const textLength = textMesh.geometry.boundingBox.max.x - textMesh.geometry.boundingBox.min.x;
      const offsetY = (textMesh.geometry.boundingBox.max.y - textMesh.geometry.boundingBox.min.y) / 2;
      textMesh.position.x = -textLength / 2;
      textMesh.position.y = -offsetY;
  }
  renderer.render(scene, camera);
}

// Define colors for each of the 23 frames
const colors = [
  "#bd8dbd", "#bd8dbd", "#bd8dbd", "#bd8dbd", "#bd8dbd", "#bd8dbd",
  "#bd8dbd", "#bd8dbd", "#bd8dbd", "#bd5cbd", "#be2cbd", "#bd00be",
  "#bc008d", "#bd005c", "#bd002a", "#bc0001", "#bd2c00", "#bb5c00",
  "#bd8e00", "#bcbf00", "#8ebd00", "#59be00", "#2bbd00", "#00bd00",
  "#00be2a", "#01bd5f", "#00be8b", "#00bdbf", "#008ebc", "#005dbd",
  "#0029b9", "#0100be",
];

const interpolateColor = (color1, color2, factor) => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, factor);
};

const animatedLetters = [];

// Initialize letters
async function initLetters() {
  const loader = new FontLoader();
  try {
    const font = await new Promise((resolve, reject) => {
      loader.load(
        "src/assets/Futura_Bold Italic.json", // Update this path to your actual font path
        resolve,
        undefined,
        reject
      );
    });

    letters.forEach(({ letter, initialPosition, pathPoints, delay }) => {
      animateLetter(font, letter, initialPosition, pathPoints, delay);
    });
  } catch (error) {
    console.error("Error loading font:", error);
  }
}

// Create the AudioContext 
const audioContext = new (window.AudioContext || window.AudioContext)();

// Boolean variable to track if the sound has been played
let soundPlayed = false;

// Function to animate a letter
const animateLetter = async (font, letter, initialPosition, pathPoints, delay) => {
  // Load the sound file asynchronously
  const response = await fetch('src/assets/Intro Sound.mp3');
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Check if the sound has been played already
  if (!soundPlayed) {
    // Create an audio buffer source node
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create a gain node to adjust the volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Adjust the volume here (0.5 is half volume)

    // Connect the source node to the gain node and the gain node to the destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the sound once
    source.start();

    // Set the boolean variable to true to indicate that the sound has been played
    soundPlayed = true;
  }

  const textMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(colors[0]) });
  const textGeometry = new TextGeometry(letter, {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 4,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.castShadow = true;
  textMesh.receiveShadow = true;
  textMesh.position.copy(initialPosition);
  scene.add(textMesh);

  const curve = new THREE.CatmullRomCurve3(pathPoints);
  const animationDuration = 783;
  const animationTween = new TWEEN.Tween({ progress: 0 })
    .to({ progress: 1 }, animationDuration)
    .onUpdate((obj) => {
      const pointOnCurve = curve.getPointAt(obj.progress);
      textMesh.position.copy(pointOnCurve);

      const frameProgress = obj.progress * (colors.length - 1);
      const currentFrame = Math.floor(frameProgress);
      const nextFrame = Math.ceil(frameProgress);
      const frameFactor = frameProgress - currentFrame;
      const interpolatedColor = interpolateColor(colors[currentFrame], colors[nextFrame], frameFactor);
      textMaterial.color.set(interpolatedColor);
    })
    .onComplete(() => {
      textMaterial.color.set(colors[colors.length - 1]);

      const bounceDuration = 350;
      const bounceHeight = 0.4;

      const bounceTween1 = new TWEEN.Tween({ y: textMesh.position.y })
        .to({ y: textMesh.position.y + bounceHeight }, bounceDuration / 2)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => { textMesh.position.y = obj.y; })
        .yoyo(true)
        .repeat(1);

      const bounceTween2 = new TWEEN.Tween({ y: textMesh.position.y })
        .to({ y: textMesh.position.y + bounceHeight * 0.25 }, bounceDuration / 4)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => { textMesh.position.y = obj.y; })
        .yoyo(true)
        .repeat(1);

      const bounceTween3 = new TWEEN.Tween({ y: textMesh.position.y })
        .to({ y: textMesh.position.y + bounceHeight * 0.0625 }, bounceDuration / 8)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => { textMesh.position.y = obj.y; })
        .yoyo(true)
        .repeat(1);

      const bounceTween4 = new TWEEN.Tween({ y: textMesh.position.y })
        .to({ y: textMesh.position.y + bounceHeight * 0.015625 }, bounceDuration / 16)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => { textMesh.position.y = obj.y; })
        .yoyo(true)
        .repeat(1);

      bounceTween1.chain(bounceTween2);
      bounceTween2.chain(bounceTween3);
      bounceTween3.chain(bounceTween4);
      bounceTween1.start();
    });

  setTimeout(() => {
    animationTween.start();
  }, delay);
  // Store the modified letter object in the new array
  animatedLetters.push({ letter, initialPosition, pathPoints, delay, mesh: textMesh });
};

// Letters with their initial positions, paths and delays
const letters = [
  { letter: "S", initialPosition: new THREE.Vector3(-1.9, -2, 10), pathPoints: [new THREE.Vector3(-1.9, -2, 10), new THREE.Vector3(-1.8, 0.3, 8), new THREE.Vector3(-2.15, 0.75, 7), new THREE.Vector3(-3.1, 0.3, 6), new THREE.Vector3(-3.8, 0.3, 6)], delay: 0 },
  { letter: "i", initialPosition: new THREE.Vector3(-1, -2, 10), pathPoints: [new THREE.Vector3(-1.2, -2, 10), new THREE.Vector3(-1.5, 0.3, 8), new THREE.Vector3(-1.75, 0.75, 7), new THREE.Vector3(-2.3, 0.3, 6), new THREE.Vector3(-3, 0.3, 6)], delay: 50 },
  { letter: "L", initialPosition: new THREE.Vector3(-1, -2, 10), pathPoints: [new THREE.Vector3(-1, -2, 10), new THREE.Vector3(-1.3, 0.3, 8), new THREE.Vector3(-1.5, 0.75, 7), new THREE.Vector3(-1.95, 0.3, 6), new THREE.Vector3(-2.65, 0.3, 6)], delay: 100 },
  { letter: "L", initialPosition: new THREE.Vector3(-0.8, -2, 10), pathPoints: [new THREE.Vector3(-0.8, -2, 10), new THREE.Vector3(-1, 0.3, 8), new THREE.Vector3(-1.3, 0.75, 7), new THREE.Vector3(-1.75, 0.3, 6), new THREE.Vector3(-1.95, 0.3, 6)], delay: 150 },
  { letter: "Y", initialPosition: new THREE.Vector3(-0.6, -2, 10), pathPoints: [new THREE.Vector3(-0.6, -2, 10), new THREE.Vector3(-0.7, 0.3, 8), new THREE.Vector3(-0.8, 0.75, 7), new THREE.Vector3(-1.1, 0.3, 6), new THREE.Vector3(-1.4, 0.3, 6)], delay: 200 },
  { letter: "D", initialPosition: new THREE.Vector3(-0.4, -2, 10), pathPoints: [new THREE.Vector3(-0.4, -2, 10), new THREE.Vector3(-0.5, 0.3, 8), new THREE.Vector3(-0.6, 0.75, 7), new THREE.Vector3(-0.8, 0.3, 6), new THREE.Vector3(-0.4, 0.3, 6)], delay: 250 },
  { letter: "O", initialPosition: new THREE.Vector3(0.95, -2, 10), pathPoints: [new THREE.Vector3(-0.25, -2, 10), new THREE.Vector3(-0.15, 0.3, 8), new THREE.Vector3(-0.05, 0.75, 7), new THREE.Vector3(0.15, 0.3, 6), new THREE.Vector3(0.55, 0.3, 6)], delay: 300 },
  { letter: "G", initialPosition: new THREE.Vector3(0.96, -2, 10), pathPoints: [new THREE.Vector3(0.25, -2, 10), new THREE.Vector3(0.45, 0.3, 8), new THREE.Vector3(0.65, 0.75, 7), new THREE.Vector3(1.25, 0.3, 6), new THREE.Vector3(1.65, 0.3, 6)], delay: 350 },
  { letter: "S", initialPosition: new THREE.Vector3(3.1, -2, 10), pathPoints: [new THREE.Vector3(1, -2, 10), new THREE.Vector3(0.8, 0.3, 8), new THREE.Vector3(1.3, 0.75, 7), new THREE.Vector3(2.1, 0.3, 6), new THREE.Vector3(2.7, 0.3, 6)], delay: 400 },
];

// Create a shader for pixelation effect
const pixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 8.0 }, // Adjust pixel size as needed
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float pixelSize;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv * pixelSize;
      uv = floor(uv) / pixelSize;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `,
};

// Create a shader pass for pixelation effect
const pixelationPass = new ShaderPass(pixelationShader);
pixelationPass.uniforms.pixelSize.value = 500.0; // Adjust pixel size as needed

// Create an effect composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
composer.addPass(pixelationPass);

// Arrays for custom parameters (radius, color, opacity)
const radii = [0.45, 0.65, 1, 1.5, 2.5, 3];
const circleColors = ['#ffffff', '#aa33b3', '#a602b9', '#8f00be', "#7400b9", '#5d00c0'];
const opacities = [0.5, 1, 0.5, 0.9, 0.9, 0.9];

// Create an array to store the fakelight meshes
const fakelights = [];

// Define the target position for the fakelights
const endPosition = new THREE.Vector3(8, 1.1, 6.21);

// Create a single delay for the entire animation
const totalDelay = 1900; // 2000 milliseconds = 2 seconds

// Start the animation loop
const animate = function () {
  requestAnimationFrame(animate);
  TWEEN.update();
  composer.render();

  // Check if the fakelights have been created
  if (fakelights.length === 0) {
    // Create fakelights with individual parameters
    for (let i = 0; i < radii.length; i++) {
      const geometry = new THREE.CircleGeometry(radii[i]);
      const material = new THREE.MeshBasicMaterial({
        color: circleColors[i],
        transparent: true,
        opacity: opacities[i],
        blending: THREE.AdditiveBlending // Use additive blending
      });

      const fakelight = new THREE.Mesh(geometry, material);
      fakelight.position.set(-7, 1.1, 6.21);

      scene.add(fakelight);
      fakelights.push(fakelight);

      // Create tweens to animate the position of fakelights with a single delay
      for (let i = 0; i < fakelights.length; i++) {
        let delay = totalDelay;
        if (i > 1) {
          // Apply custom delays for each fakelight after the first two circles
          switch (i) {
            case 2:
              delay += 40; // Add a 200ms delay for the third circle
              break;
            case 3:
              delay += 104; // Add a 400ms delay for the fourth circle
              break;
            case 4:
              delay += 220; // Add a default delay of 1000ms for circles after the fourth one
              break;
            case 5:
              delay += 300;
              break;
          }
        }
        new TWEEN.Tween(fakelights[i].position)
          .to({ x: endPosition.x }, 2000) // Move along the x-axis over 5000 ms
          .delay(delay) // Apply the calculated delay
          .start(); // Start the tween
      }
    }
  }
};

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});