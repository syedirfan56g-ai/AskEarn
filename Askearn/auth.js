// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbwkpyzXzBEDZFmtx5t_NUEfQ60MMY1H4",
  authDomain: "askearn-1fdf5.firebaseapp.com",
  projectId: "askearn-1fdf5",
  storageBucket: "askearn-1fdf5.firebasestorage.app",
  messagingSenderId: "1061088918589",
  appId: "1:1061088918589:web:f689fb068c2d56baf6be54",
  measurementId: "G-14TH9JNLF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const googleSignupBtn = document.getElementById('google-signup');
const googleLoginBtn = document.getElementById('google-login');
const logoutBtn = document.getElementById('logout-btn');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const userEmailSpan = document.getElementById('user-email');
const dashboardMain = document.getElementById('dashboard-main');
const loadingElement = document.getElementById('loading');
const dashboardErrorMessage = document.getElementById('error-message');

// Show/hide forms
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupSection.style.display = 'none';
    loginSection.style.display = 'block';
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    signupSection.style.display = 'block';
});

// Show error message
function showError(message, element = errorMessage) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Save user data to Firestore
async function saveUserData(user, method) {
    try {
        // Check if user already exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        // Only create document if it doesn't exist
        if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                method: method,
                createdAt: new Date()
            });
            console.log("User data saved to Firestore");
        } else {
            console.log("User already exists in Firestore");
        }
    } catch (error) {
        console.error("Error saving user data:", error);
        showError("Error saving user data: " + error.message);
    }
}

// Handle signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Save user data to Firestore
            await saveUserData(user, "password");
            
            showSuccess("Account created successfully! Redirecting to dashboard...");
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if (errorCode === 'auth/email-already-in-use') {
                showError("Email already in use. Please try logging in instead.");
            } else if (errorCode === 'auth/invalid-email') {
                showError("Invalid email address.");
            } else if (errorCode === 'auth/weak-password') {
                showError("Password should be at least 6 characters.");
            } else {
                showError("Error: " + errorMessage);
            }
        }
    });
}

// Handle login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("User logged in:", user.email);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if (errorCode === 'auth/user-not-found') {
                showError("No user found with this email. Please sign up first.");
            } else if (errorCode === 'auth/wrong-password') {
                showError("Incorrect password. Please try again.");
            } else if (errorCode === 'auth/invalid-email') {
                showError("Invalid email address.");
            } else {
                showError("Error: " + errorMessage);
            }
        }
    });
}

// Handle Google signup
if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Save user data to Firestore
            await saveUserData(user, "google");
            
            showSuccess("Signed up with Google successfully! Redirecting to dashboard...");
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if (errorCode === 'auth/account-exists-with-different-credential') {
                showError("An account already exists with this email. Please sign in using your existing method.");
            } else {
                showError("Error: " + errorMessage);
            }
        }
    });
}

// Handle Google login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Save user data to Firestore (if not already saved)
            await saveUserData(user, "google");
            
            console.log("User logged in with Google:", user.email);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if (errorCode === 'auth/account-exists-with-different-credential') {
                showError("An account already exists with this email. Please sign in using your existing method.");
            } else {
                showError("Error: " + errorMessage);
            }
        }
    });
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
            window.location.href = 'index.html';
        } catch (error) {
            showError("Error logging out: " + error.message);
        }
    });
}

// Check auth state and handle redirects
onAuthStateChanged(auth, (user) => {
    // For dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        loadingElement.style.display = 'none';
        
        if (user) {
            // User is signed in
            userEmailSpan.textContent = user.email;
            dashboardMain.style.display = 'block';
        } else {
            // User is signed out
            window.location.href = 'index.html';
        }
    }
    
    // For index page (login/signup)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (user) {
            // If user is already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }
});

// Export functions for potential reuse
export { auth, db, saveUserData };