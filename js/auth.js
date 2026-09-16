/* ==========================================================================
   QwickDesk Solutions - Authentication & Security Logic (Fixed & Updated)
   ========================================================================== */

import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// DOM pura load hone ke baad hi saare elements aur events bind honge
document.addEventListener("DOMContentLoaded", () => {

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

    // --- Feature 1: Password Hide/Show Logic (FIXED) ---
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Default behavior rokne ke liye
            
            const currentType = passwordInput.getAttribute('type');
            if (currentType === 'password') {
                passwordInput.setAttribute('type', 'text');
                togglePasswordBtn.classList.remove('fa-eye-slash');
                togglePasswordBtn.classList.add('fa-eye');
            } else {
                passwordInput.setAttribute('type', 'password');
                togglePasswordBtn.classList.remove('fa-eye');
                togglePasswordBtn.classList.add('fa-eye-slash');
            }
        });
    }

    // --- Feature 2: Session Check (Auto-Redirect) ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Admin is already logged in! Redirecting to Dashboard...");
            window.location.href = 'dashboard.html';
        }
    });

    // --- Feature 3: Login Form Submit Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Page refresh hone se rokna (Zaroori)

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // UI Update: Button ko loader mein badalna
            if(btnText) btnText.classList.add('hidden');
            if(btnIcon) btnIcon.classList.add('hidden');
            if(loader) loader.classList.remove('hidden');
            if(loginBtn) {
                loginBtn.disabled = true;
                loginBtn.style.opacity = '0.7';
            }
            if(errorBox) errorBox.classList.add('hidden');

            try {
                // Firebase Authentication Call
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Login Successful! Welcome: ", userCredential.user.email);
                
                // Dashboard par redirect
                window.location.href = 'dashboard.html';

            } catch (error) {
                console.error("Login Error: ", error.code, error.message);
                
                let customMessage = "An error occurred during login.";
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    customMessage = "Invalid Admin Email or Password. Try again.";
                } else if (error.code === 'auth/too-many-requests') {
                    customMessage = "Too many failed attempts. Please wait a while.";
                }

                // Error UI Show karna
                if(errorText) errorText.textContent = customMessage;
                if(errorBox) errorBox.classList.remove('hidden');

                // Button ko wapas normal state mein lana
                if(btnText) btnText.classList.remove('hidden');
                if(btnIcon) btnIcon.classList.remove('hidden');
                if(loader) loader.classList.add('hidden');
                if(loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                }
            }
        });
    }
});
