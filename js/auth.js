/* ==========================================================================
   QwickDesk Solutions - Authentication & Security Logic
   Yeh file login form ko handle karegi aur Firebase se verify karegi.
   ========================================================================== */

// 1. Firebase Config file se 'auth' ko import kar rahe hain
import { auth } from './firebase-config.js';
// 2. Firebase ke ready-made Authentication functions import kar rahe hain
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// DOM Elements ko select kar rahe hain (index.html se)
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const btnText = loginBtn ? loginBtn.querySelector('.btn-text') : null;
const btnIcon = loginBtn ? loginBtn.querySelector('.btn-icon') : null;
const loader = loginBtn ? loginBtn.querySelector('.loader') : null;
const errorBox = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const togglePasswordBtn = document.getElementById('toggle-password');

// --- Feature 1: Password Hide/Show Logic ---
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Icon change karna (Eye open / Eye close)
        togglePasswordBtn.classList.toggle('fa-eye');
        togglePasswordBtn.classList.toggle('fa-eye-slash');
    });
}

// --- Feature 2: Session Check (Auto-Redirect) ---
// Agar admin pehle se logged in hai, toh wapas login page mat dikhao, sidha Dashboard le jao
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Admin is already logged in! Redirecting to Dashboard...");
        // Abhi dashboard.html banaya nahi hai, par redirect ka path set kar diya hai
        window.location.href = 'dashboard.html';
    }
});

// --- Feature 3: Login Form Submit Logic ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Page reload hone se rokna

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // UI Update: Button ko loader mein badalna
        btnText.classList.add('hidden');
        btnIcon.classList.add('hidden');
        loader.classList.remove('hidden');
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.7';
        errorBox.classList.add('hidden'); // Purane errors hide karna

        try {
            // Firebase Authentication Call
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("Login Successful! Welcome: ", user.email);
            
            // Login success hone par Dashboard par bhej dena
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error("Login Error: ", error.code, error.message);
            
            // Error Handling: Client ko clean error message dikhana
            let customMessage = "An error occurred during login.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                customMessage = "Invalid Admin Email or Password. Try again.";
            } else if (error.code === 'auth/too-many-requests') {
                customMessage = "Too many failed attempts. Please wait a while.";
            }

            // Error UI Show karna
            errorText.textContent = customMessage;
            errorBox.classList.remove('hidden');

            // Button ko wapas normal state mein lana
            btnText.classList.remove('hidden');
            btnIcon.classList.remove('hidden');
            loader.classList.add('hidden');
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        }
    });
}
