// Firebase Authentication or Google API setup
// Assuming Firebase Authentication is used for Google Login

// 1. Set up Firebase in your project (this is an example, you'll need to include Firebase SDK in your project)
firebase.initializeApp({
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
  });
  
  // Elements
  const loginBtn = document.getElementById('login-btn');
  const authContainer = document.getElementById('auth-container');
  const gameContainer = document.getElementById('game-container');
  const gameOverScreen = document.getElementById('game-over');
  const retryBtn = document.getElementById('retry-btn');
  const homeBtn = document.getElementById('home-btn');
  const scoreDisplay = document.getElementById('score');
  const missedDisplay = document.getElementById('missed');
  const cutDisplay = document.getElementById('cut');
  const gameCanvas = document.getElementById('gamecanvas');
  const ctx = gameCanvas.getContext('2d');
  const backgroundMusic = document.getElementById('background-music');
  const sliceSound = new Audio('assets/sounds/slice.mp3');
  const blastSound = new Audio('assets/sounds/blast.mp3');
  const specialFruitSound = new Audio('assets/sounds/specialfruit.mp3');
  
  // Global Variables
  let score = 0;
  let missed = 0;
  let cut = 0;
  let specialFruitActive = false;
  let bonusMultiplier = 1;
  let gameInterval;
  let fruitInterval;
  let currentFruit;
  
  // Login Process
  loginBtn.addEventListener('click', () => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then((userCredential) => {
              authContainer.style.display = 'none';
              gameContainer.style.display = 'block';
              startGame();
          })
          .catch((error) => {
              console.error('Login Failed:', error);
          });
  });
  
  // Start Game
  function startGame() {
      score = 0;
      missed = 0;
      cut = 0;
      updateScore();
  
      // Start fruit spawn and game loop
      fruitInterval = setInterval(generateFruit, 1500); // Spawn fruits every 1.5s
      gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
  }
  
  // Update Scoreboard
  function updateScore() {
      scoreDisplay.textContent = score;
      missedDisplay.textContent = missed;
      cutDisplay.textContent = cut;
  }
  
  // Generate Random Fruits
  function generateFruit() {
      const fruits = ['apple', 'banana', 'pineapple', 'watermelon', 'bomb', 'specialfruit'];
      const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
      const x = Math.random() * gameCanvas.width;
      const y = gameCanvas.height + 50; // Start just below the canvas
  
      const fruit = {
          type: randomFruit,
          x: x,
          y: y,
          speed: Math.random() * 3 + 2, // Random speed between 2 and 5
          radius: 30,
          img: new Image()
      };
  
      fruit.img.src = `assets/fruits/${randomFruit}.png`;
  
      fruit.img.onload = () => {
          gameCanvas.getContext('2d').drawImage(fruit.img, fruit.x, fruit.y, fruit.radius * 2, fruit.radius * 2);
      };
  
      setInterval(() => {
          fruit.y -= fruit.speed; // Move the fruit up
          if (fruit.y < 0) {
              missed++;
              if (missed >= 3) {
                  gameOver();
              }
          }
      }, 1000 / 60);
  }
  
  // Game Loop
  function gameLoop() {
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  
      // Drawing game objects and logic
      // Handle fruit slicing
  }
  
  // Fruit Slice Detection
  gameCanvas.addEventListener('mousemove', (e) => {
      // Detect if the player is slicing any fruit with the cursor
      // Play slice sound and update score based on fruit type
  });
  
  // Game Over
  function gameOver() {
      clearInterval(fruitInterval);
      clearInterval(gameInterval);
      gameContainer.style.display = 'none';
      gameOverScreen.style.display = 'block';
  }
  
  // Retry or Home Buttons
  retryBtn.addEventListener('click', () => {
      gameOverScreen.style.display = 'none';
      startGame();
  });
  
  homeBtn.addEventListener('click', () => {
      // Go to homepage or reset the game state
      gameOverScreen.style.display = 'none';
      authContainer.style.display = 'block';
      firebase.auth().signOut();
  });
  