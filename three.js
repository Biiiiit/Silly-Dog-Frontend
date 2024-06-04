import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Create a scene
const scene = new THREE.Scene();

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
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Load font and create text
const loader = new FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

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
    scene.add(textMesh);

    // Define points for the curve
    const points = [];
    points.push(new THREE.Vector3(-1.5, -2, 10)); // Starting point behind the camera
    points.push(new THREE.Vector3(-1.3, -0.1, 8));
    points.push(new THREE.Vector3(-1.25, 0.35, 7));
    points.push(new THREE.Vector3(-2, 0.2, 6));
    points.push(new THREE.Vector3(-2.5, 0.2, 6)); // Ending point

    // Create the curve
    const curve = new THREE.CatmullRomCurve3(points);

    // Animate the "S" letter along the curve
    const animationDuration = 10; // Duration of animation in seconds
    const numPoints = 100; // Number of points to interpolate along the curve
    let animationProgress = 0; // Start progress at 0
    let animationStarted = false; // Track if animation has started

    // Start the animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      TWEEN.update(); // Update the Tween.js animation

      // Only animate the letter if animation hasn't started yet
      if (!animationStarted) {
        // Calculate position along the curve
        const pointOnCurve = curve.getPointAt(animationProgress);
        // Update position of the "S" letter
        textMesh.position.copy(pointOnCurve);
        renderer.render(scene, camera);

        animationProgress += 0.001; // Increment animation progress
        if (animationProgress > 1) {
          animationStarted = true; // Set animation started to true when animation completes
        }
      }
    };

    animate();
  }
);

// Define points for the curve
const points = [];
points.push(new THREE.Vector3(-1.5, -2, 10)); // Starting point behind the camera
points.push(new THREE.Vector3(-1.3, -0.1, 8));
points.push(new THREE.Vector3(-1.25, 0.35, 7.5));
points.push(new THREE.Vector3(-2, 0.2, 6.5));
points.push(new THREE.Vector3(-2.5, 0.2, 6.5)); // Ending point

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

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
