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

// Function to animate a letter
const animateLetter = (letter, initialPosition, pathPoints, delay) => {
  const loader = new FontLoader();
  loader.load("src/assets/Futura_Bold Italic.json", function (font) {
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
  });
};

// Letters with their initial positions, paths and delays
const letters = [
  { letter: "S", initialPosition: new THREE.Vector3(-1.9, -2, 10), pathPoints: [new THREE.Vector3(-1.9, -2, 10), new THREE.Vector3(-1.8, 0.3, 8), new THREE.Vector3(-2.15, 0.75, 7), new THREE.Vector3(-3.1, 0.3, 6), new THREE.Vector3(-3.8, 0.3, 6)], delay: 0 },
  { letter: "i", initialPosition: new THREE.Vector3(-1, -2, 10), pathPoints: [new THREE.Vector3(-1.2, -2, 10), new THREE.Vector3(-1.5, 0.3, 8), new THREE.Vector3(-1.75, 0.75, 7), new THREE.Vector3(-2.3, 0.3, 6), new THREE.Vector3(-3, 0.3, 6)], delay: 200 },
  { letter: "L", initialPosition: new THREE.Vector3(-1, -2, 10), pathPoints: [new THREE.Vector3(-1, -2, 10), new THREE.Vector3(-1.3, 0.3, 8), new THREE.Vector3(-1.5, 0.75, 7), new THREE.Vector3(-1.95, 0.3, 6), new THREE.Vector3(-2.65, 0.3, 6)], delay: 250 },
  { letter: "L", initialPosition: new THREE.Vector3(-0.8, -2, 10), pathPoints: [new THREE.Vector3(-0.8, -2, 10), new THREE.Vector3(-1, 0.3, 8), new THREE.Vector3(-1.3, 0.75, 7), new THREE.Vector3(-1.75, 0.3, 6), new THREE.Vector3(-1.95, 0.3, 6)], delay: 300 },
  { letter: "Y", initialPosition: new THREE.Vector3(-0.6, -2, 10), pathPoints: [new THREE.Vector3(-0.6, -2, 10), new THREE.Vector3(-0.7, 0.3, 8), new THREE.Vector3(-0.8, 0.75, 7), new THREE.Vector3(-1.1, 0.3, 6), new THREE.Vector3(-1.4, 0.3, 6)], delay: 350 },
  { letter: "D", initialPosition: new THREE.Vector3(-0.4, -2, 10), pathPoints: [new THREE.Vector3(-0.4, -2, 10), new THREE.Vector3(-0.5, 0.3, 8), new THREE.Vector3(-0.6, 0.75, 7), new THREE.Vector3(-0.8, 0.3, 6), new THREE.Vector3(-0.4, 0.3, 6)], delay: 400 },
  { letter: "O", initialPosition: new THREE.Vector3(0.95, -2, 10), pathPoints: [new THREE.Vector3(-0.25, -2, 10), new THREE.Vector3(-0.15, 0.3, 8), new THREE.Vector3(-0.05, 0.75, 7), new THREE.Vector3(0.15, 0.3, 6), new THREE.Vector3(0.55, 0.3, 6)], delay: 450 },
  { letter: "G", initialPosition: new THREE.Vector3(0, -2, 10), pathPoints: [new THREE.Vector3(0.25, -2, 10), new THREE.Vector3(0.45, 0.3, 8), new THREE.Vector3(0.65, 0.75, 7), new THREE.Vector3(1.25, 0.3, 6), new THREE.Vector3(1.65, 0.3, 6)], delay: 500 },
  { letter: "S", initialPosition: new THREE.Vector3(3.1, -2, 10), pathPoints: [new THREE.Vector3(1, -2, 10), new THREE.Vector3(0.8, 0.3, 8), new THREE.Vector3(1.3, 0.75, 7), new THREE.Vector3(2.1, 0.3, 6), new THREE.Vector3(2.7, 0.3, 6)], delay: 550 },
];

// Animate all letters
letters.forEach(({ letter, initialPosition, pathPoints, delay }) => {
  animateLetter(letter, initialPosition, pathPoints, delay);
});

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

// Start the animation loop
const animate = function () {
  requestAnimationFrame(animate);
  TWEEN.update();
  composer.render();
};

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
