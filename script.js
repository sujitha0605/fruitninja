// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Replace the following with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBM0ksyC2gHaMt-i3iNtHFgz7n4qnapIEU",
  authDomain: "fruitninja-e4fdf.firebaseapp.com",
  projectId: "fruitninja-e4fdf",
  storageBucket: "fruitninja-e4fdf.firebasestorage.app",
  messagingSenderId: "934978908836",
  appId: "1:934978908836:web:879c7b802e190c962cec31",
  measurementId: "G-04JKQYPCSS"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('game-container');
const gameCanvas = document.getElementById('game-canvas');
const gameOverScreen = document.getElementById('game-over');
const fruitsCutDisplay = document.getElementById('fruits-cut');
const fruitsMissedDisplay = document.getElementById('fruits-missed');
const retryButton = document.getElementById('retry');
const homeButton = document.getElementById('home');

let fruitsCut = 0;
let fruitsMissed = 0;
let gameRunning = false;
let specialMode = false;
let fruitObjects = [];
let mouseX = 0;
let mouseY = 0;

// Resize canvas to fit screen dynamically
function resizeCanvas() {
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const canvas = gameCanvas.getContext('2d');
const fruits = ["apple", "mango", "orange", "pear", "bomb", "specialfruit"];
const sounds = {
  slice: new Audio('assets/sounds/slice.mp3'),
  blast: new Audio('assets/sounds/blast.mp3'),
  specialfruit: new Audio('assets/sounds/specialfruit.mp3'),
  background: new Audio('assets/sounds/background.mp3'),
};
sounds.background.loop = true;

gameCanvas.addEventListener('mousemove', (event) => {
  const rect = gameCanvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

// Start game after Google login
function startGame() {
  fruitsCut = 0;
  fruitsMissed = 0;
  specialMode = false;
  gameRunning = true;
  fruitObjects = [];
  fruitsCutDisplay.textContent = fruitsCut;
  fruitsMissedDisplay.textContent = fruitsMissed;
  gameOverScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  authContainer.classList.add('hidden');
  sounds.background.play();
  spawnFruit();
  requestAnimationFrame(gameLoop);
}

// End the game
function endGame() {
  gameRunning = false;
  sounds.background.pause();
  gameOverScreen.classList.remove('hidden');
}

retryButton.addEventListener('click', startGame);
homeButton.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  authContainer.classList.remove('hidden');
});

// Google Authentication
document.getElementById('google-login').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User signed in:', user.displayName);
      authContainer.classList.add('hidden');
      gameContainer.classList.remove('hidden');
      startGame();
    })
    .catch((error) => {
      console.error('Authentication error:', error);
      alert('Login failed. Please try again.');
    });
});

// Sign out
document.getElementById('sign-out').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out');
      authContainer.classList.remove('hidden');
      gameContainer.classList.add('hidden');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
      alert('Logout failed. Please try again.');
    });
});

// Fruit class
class Fruit {
  constructor(type, x, y, speed) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = new Image();
    this.image.src = `assets/fruits/${type}.png`;
    const sizeFactor = Math.min(gameCanvas.width, gameCanvas.height) / 20;
    this.width = sizeFactor;
    this.height = sizeFactor;
    this.isCut = false;

    // Assign points based on fruit type
    const fruitPoints = { apple: 10, mango: 20, orange: 30, pear: 50, bomb: 0, specialfruit: 0 };
    this.points = fruitPoints[type] || 0;
  }

  draw() {
    if (!this.isCut) {
      canvas.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  update() {
    this.y += this.speed;
  }

  checkCut() {
    if (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    ) {
      this.isCut = true;
      if (this.type === 'bomb') {
        sounds.blast.play();
        endGame();
      } else {
        let scoreToAdd = this.points;
        if (specialMode && this.type !== 'specialfruit') scoreToAdd *= 5;
        fruitsCut += scoreToAdd;
        fruitsCutDisplay.textContent = fruitsCut;

        if (this.type === 'specialfruit') {
          sounds.specialfruit.play();
          specialMode = true;

          // Activate bonus mode for 10 seconds
          setTimeout(() => (specialMode = false), 10000);
        } else {
          sounds.slice.play();
        }
      }
    }
  }
}

// Spawn fruits at intervals
function spawnFruit() {
  if (!gameRunning) return;
  const type = fruits[Math.floor(Math.random() * fruits.length)];
  const x = Math.random() * (gameCanvas.width - 50);
  const y = -50;
  const speed = 2 + Math.random() * 3 + fruitsCut / 20; // Speed scales with fruitsCut
  fruitObjects.push(new Fruit(type, x, y, speed));

  setTimeout(spawnFruit, 1000 - Math.min(fruitsCut * 10, 500)); // Decrease spawn interval with score
}

// Game Loop and Logic
function gameLoop() {
  if (!gameRunning) return;
  canvas.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Bonus mode background visual cue
  if (specialMode) {
    canvas.fillStyle = 'rgba(255, 255, 0, 0.2)';
    canvas.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  }

  fruitObjects.forEach((fruit, index) => {
    fruit.update();
    fruit.draw();
    fruit.checkCut();

    // Remove fruits that go off-screen or are cut
    if (fruit.y > gameCanvas.height || fruit.isCut) {
      if (!fruit.isCut && fruit.type !== 'bomb') {
        fruitsMissed++;
        fruitsMissedDisplay.textContent = fruitsMissed;
        if (fruitsMissed >= 3) endGame();
      }
      fruitObjects.splice(index, 1);
    }
  });

  canvas.beginPath();
  canvas.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
  canvas.fillStyle = 'red';
  canvas.fill();

  requestAnimationFrame(gameLoop);
}