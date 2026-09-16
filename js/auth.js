import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Page fully load hone ka wait karte hain
window.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const togglePasswordBtn = document.getElementById('toggle-password');

    // 1. Password Show / Hide Toggle Fix
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
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

    // 2. Auto-redirect agar pehle se login hai
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = 'dashboard.html';
        }
    });

    // 3. Login Submit Fix (Reload rokne ke liye)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Yeh sabse zaroori hai taaki page reload na ho!
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            if (errorBox) errorBox.classList.add('hidden');

            try {
                console.log("Attempting login for:", email);
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Login success! Redirecting...");
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Login failed:", error.code);
                if (errorText) {
                    errorText.textContent = "Invalid Email or Password! (" + error.code + ")";
                }
                if (errorBox) {
                    errorBox.classList.remove('hidden');
                }
            }
        });
    }
});
