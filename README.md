# Fruit Ninja

A modern, web-based adaptation of the classic Fruit Ninja game. Built with HTML5 Canvas, Vanilla JavaScript, and Firebase Authentication, this project demonstrates real-time rendering, interactive gameplay mechanics, and secure user login capabilities.

## Features
- **Google Authentication:** Secure login using Firebase Authentication, allowing users to track their progress.
- **Classic Gameplay:** Slice falling fruits by clicking and dragging (or swiping) across the screen.
- **Score Tracking:** Real-time tracking of fruits cut and fruits missed during the gameplay session.
- **Game Over Mechanics:** Interactive game over screen with options to retry or return to the home screen.
- **Dynamic Rendering:** Smooth graphics and animations powered by the HTML5 Canvas API.

## Technologies Used
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), Canvas API
- **Backend/Auth:** Firebase Authentication (Google Sign-In)

## Setup and Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd fruitninja
   ```

2. **Configure Firebase:**
   - Sign up for a free account at [Firebase Console](https://console.firebase.google.com/).
   - Create a new project and add a Web App.
   - Enable Google Sign-In under the Authentication providers.
   - Open `script.js` in your preferred text editor.
   - Replace the Firebase configuration object with the credentials provided by your Firebase dashboard.

3. **Run the Application:**
   Since the app uses Firebase Auth and ES6 modules, it must be served over a local HTTP server (it will not work using the `file://` protocol). 
   - You can use tools like VS Code Live Server, or run a simple local server using Python (`python -m http.server`) or Node.js (`npx serve`).
   - Navigate to the local server address (e.g., `http://localhost:5500`) in your browser.

## Usage
- Upon loading the application, click "Login with Google" to authenticate.
- Once authenticated, the game will begin.
- Use your mouse or touch screen to slice the fruits that appear on the canvas.
- Avoid missing fruits. If you miss too many, the game is over.
- Use the "Logout" button to sign out of your session.