import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import TWEEN from "@tweenjs/tween.js";

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
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd8dbd",
  "#bd5cbd",
  "#be2cbd",
  "#bd00be",
  "#bc008d",
  "#bd005c",
  "#bd002a",
  "#bc0001",
  "#bd2c00",
  "#bb5c00",
  "#bd8e00",
  "#bcbf00",
  "#8ebd00",
  "#59be00",
  "#2bbd00",
  "#00bd00",
  "#00be2a",
  "#01bd5f",
  "#00be8b",
  "#00bdbf",
  "#008ebc",
  "#005dbd",
  "#0029b9",
  "#0100be",
];

const interpolateColor = (color1, color2, factor) => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, factor);
};

// Load font and create text
const loader = new FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colors[0]),
    });

    // Create text geometry for the letter "S"
    const textGeometry = new TextGeometry("S", {
      font: font,
      size: 1,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    scene.add(textMesh);

    // Define points for the curve
    const points = [
      new THREE.Vector3(-1.9, -2, 10), // Starting point behind the camera
      new THREE.Vector3(-1.8, 0.3, 8),
      new THREE.Vector3(-2.15, 0.75, 7),
      new THREE.Vector3(-2.9, 0.3, 6),
      new THREE.Vector3(-3.8, 0.3, 6), // Ending point
    ];

    // Create the curve
    const curve = new THREE.CatmullRomCurve3(points);

    // Animate the "S" letter along the curve
    const animationDuration = 1200; // Duration of animation in milliseconds (23 frames at 60 fps)

    // Create Tween for the animation
    new TWEEN.Tween({ progress: 0 })
      .to({ progress: 1 }, animationDuration)
      .onUpdate((obj) => {
        const pointOnCurve = curve.getPointAt(obj.progress);
        textMesh.position.copy(pointOnCurve);

        // Update color based on progress
        const frameProgress = obj.progress * (colors.length - 1);
        const currentFrame = Math.floor(frameProgress);
        const nextFrame = Math.ceil(frameProgress);
        const frameFactor = frameProgress - currentFrame;
        const interpolatedColor = interpolateColor(
          colors[currentFrame],
          colors[nextFrame],
          frameFactor
        );
        textMaterial.color.set(interpolatedColor);
      })
      .onComplete(() => {
        textMaterial.color.set(colors[colors.length - 1]); // Set final color to dark blue
      })
      .start();

    // Start the animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      TWEEN.update();
      renderer.render(scene, camera);
    };

    animate();
  }
);

/*
// Define points for the curve
const points = [
  new THREE.Vector3(-1.9, -2, 10), // Starting point behind the camera
  new THREE.Vector3(-1.8, 0.3, 8),
  new THREE.Vector3(-2.15, 0.75, 7),
  new THREE.Vector3(-2.9, 0.3, 6),
  new THREE.Vector3(-3.8, 0.3, 6), // Ending point
];

// Create small spheres as indicators for each point on the curve
points.forEach((point) => {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(point);
  scene.add(sphere);
});

// Create the curve
const curve = new THREE.CatmullRomCurve3(points);

// Create the geometry for the curve
const curveGeometry = new THREE.BufferGeometry().setFromPoints(
  curve.getPoints(50)
);

// Create the material for the curve (optional)
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create the curve object
const curveObject = new THREE.Line(curveGeometry, curveMaterial);

// Add the curve object to the scene
scene.add(curveObject);
*/

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
