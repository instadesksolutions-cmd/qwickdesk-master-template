/* ==========================================================================
   QwickDesk Solutions - Firebase Master Configuration
   Yeh file pure project ko tere Firebase Database se connect karegi.
   ========================================================================== */

// 1. Firebase Core, Auth aur Firestore modules ko direct CDN se import kar rahe hain (Jamstack approach)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tera Personal QwickDesk Firebase Project Credentials
const firebaseConfig = {
    apiKey: "AIzaSyAyPoWNt1eFw_Xb9lhgyX7ROkU2xb1misY",
    authDomain: "qwickdesk-demos.firebaseapp.com",
    projectId: "qwickdesk-demos",
    storageBucket: "qwickdesk-demos.firebasestorage.app",
    messagingSenderId: "407013520312",
    appId: "1:407013520312:web:497b8f3434eb148af3954d"
};

// 3. Firebase ko initialize karna
const app = initializeApp(firebaseConfig);

// 4. Auth aur Database ko export kar rahe hain taaki dusri files (jaise auth.js) inka use kar sakein
export const auth = getAuth(app);
export const db = getFirestore(app);

// Developer Console mein check karne ke liye success message
console.log("🔥 QwickDesk Firebase System Initialized Successfully!");
