# AI Image Generator

This project is an AI-powered web application that transforms text prompts into visually stunning images. Built with React, Firebase, and the Hugging Face Inference API, it offers a user-friendly interface for generating unique and creative visuals.

## Features

*   **Text-to-Image Generation:** Leverage the power of the Hugging Face Inference API (specifically the `black-forest-labs/FLUX.1-dev` model) to convert your text descriptions into images.
*   **User Authentication:** Secure user accounts with email/password login, Google Sign-In, and email verification.
*   **Profile Management:** Allows users to set and update their profile names.
*   **Interactive Background:** Features a dynamic starfield background rendered using Three.js for an immersive user experience.
*   **Responsive Design:**  Adapts seamlessly to different screen sizes for optimal viewing on various devices.

## Getting Started

These instructions will guide you through setting up and running the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:**  (LTS version recommended) Download and install from [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Usually comes bundled with Node.js)
*   **Git:** Download and install from [https://git-scm.com/](https://git-scm.com/)
*   **Firebase Account:** Create an account at [https://firebase.google.com/](https://firebase.google.com/)
*   **Hugging Face Account:** Create an account and obtain an API token from [https://huggingface.co/](https://huggingface.co/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

    Replace `<repository-url>` with the URL of your GitHub repository and `<repository-name>` with the name of the folder where you want to store the project.

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Firebase Setup:**
    *   Create a new Firebase project in the Firebase console.
    *   Enable **Authentication** in your Firebase project:
        *   Go to **Authentication** -> **Sign-in method**.
        *   Enable **Email/Password** and **Google** sign-in providers.
    *   **Optional:** If you intend to use Firestore to save user profile names, enable **Cloud Firestore** in your project.
    *   Create a web app in your Firebase project and copy the configuration object (apiKey, authDomain, etc.).

4.  **Environment Variables:**
    *   Create a file named `.env` in the root directory of your project.
    *   Add the following environment variables, replacing the placeholder values with your actual configuration:

    ```
    REACT_APP_HUGGINGFACE_TOKEN=your_huggingface_api_token
    REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
    ```

### Running the Application

1.  **Start the development server:**

    ```bash
    npm start
    ```

2.  This will open the application in your default web browser (usually at `http://localhost:3000`).

## Deployment

To deploy this application to a live environment, you can use Firebase Hosting or other hosting providers like Netlify, Vercel, or AWS Amplify. Here are the general steps for Firebase Hosting:

1.  **Install Firebase CLI:**

    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase:**

    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**

    ```bash
    firebase init hosting
    ```

    *   Select your Firebase project.
    *   Choose `build` as your public directory.
    *   Configure as a single-page app (rewrite all URLs to `/index.html`).

4.  **Build the application:**

    ```bash
    npm run build
    ```

5.  **Deploy to Firebase Hosting:**

    ```bash
    firebase deploy --only hosting
    ```

## Built With

*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [Firebase](https://firebase.google.com/) - A comprehensive app development platform.
*   [Hugging Face Inference API](https://huggingface.co/inference-api) - API for accessing powerful AI models.
*   [Three.js](https://threejs.org/) - A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. (You'll need to create a LICENSE file and choose a license, MIT is a common choice).

## Acknowledgments

*   Inspired by the growing field of AI-generated art.
*   Thanks to the developers of the libraries and tools used in this project.
