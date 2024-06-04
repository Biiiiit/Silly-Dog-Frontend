import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Function to create text and add to scene
function createText() {
  const fontLoader = new FontLoader();
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const text = "Silly Dogs";
      const letters = [];

      // Create individual letter meshes
      for (let i = 0; i < text.length; i++) {
        const letterGeometry = new TextGeometry(text[i], {
          font: font,
          size: 1,
          depth: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const letterMesh = new THREE.Mesh(letterGeometry, material);

        const offsetX = (i - (text.length - 1) / 2) * 0.5; // Spread letters evenly
        const offsetY = -25; // Start from center vertically
        const offsetZ = 10; // Start behind the camera

        letterMesh.position.set(offsetX, offsetY, offsetZ);
        scene.add(letterMesh);
        letters.push(letterMesh);
      }

      // Function to animate a single letter
      function animateLetter(letter, targetX, targetY, targetZ, delay) {
        const startTime = performance.now() + delay;

        function animate() {
          const elapsedTime = performance.now() - startTime;

          if (elapsedTime < 0) {
            requestAnimationFrame(animate);
            return;
          }

          const t = Math.min(elapsedTime / 2000, 1); // Animation duration 2 seconds
          const bounce = Math.abs(Math.sin(t * Math.PI * 2.5) * (1 - t)); // Bounce effect

          const currentX = letter.position.x;
          const currentY = letter.position.y;
          const currentZ = letter.position.z;

          // Calculate curved path towards target position
          const newX = THREE.MathUtils.lerp(
            currentX,
            targetX,
            t * (1 - bounce)
          );
          const newY = THREE.MathUtils.lerp(
            currentY,
            targetY,
            t * (1 - bounce)
          );
          const newZ = THREE.MathUtils.lerp(
            currentZ,
            targetZ,
            t * (1 - bounce)
          ); // Move letter further away

          letter.position.set(newX, newY, newZ);

          if (t < 1) {
            requestAnimationFrame(animate);
          }
        }

        animate();
      }

      // Animate each letter with a delay
      const delay = 200; // Delay between letters
      const targetZ = -1; // Move letters further away

      for (let i = 0; i < letters.length; i++) {
        const offsetX = (i - (text.length - 1) / 2) * 1.2; // Reduce spacing
        const offsetY = 0; // Move to the center vertically
        const targetX = offsetX;
        const targetY = offsetY;
        animateLetter(letters[i], targetX, targetY, targetZ, delay * i);
      }
    }
  );
}

// Initialize camera position
camera.position.z = 5;

// Call function to create text and trigger animation
createText();

// Add basic lighting
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

// Render loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
