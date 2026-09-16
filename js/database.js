/* ==========================================================================
   QwickDesk Solutions - Master Database Logic (Firestore)
   Yeh file database mein data Add, Read aur Delete karne ka kaam karegi.
   ========================================================================== */

import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc,
    doc,
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

/**
 * 1. ADD RECORD FUNCTION (Universal)
 * Yeh kisi bhi industry ke database collection mein naya record add karega.
 * @param {string} collectionName - Jaise 'clinic_patients' ya 'retail_bills'
 * @param {object} dataObject - Form ka actual data
 */
export async function addRecord(collectionName, dataObject) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...dataObject,
            createdAt: serverTimestamp() // Humesha record ka exact time save karega
        });
        console.log(`✅ Record successfully added in [${collectionName}] with ID: ${docRef.id}`);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error(`❌ Error adding record in [${collectionName}]: `, error);
        return { success: false, error: error.message };
    }
}

/**
 * 2. GET RECORDS FUNCTION (Universal)
 * Yeh database se data nikal kar dashboard ke table mein dikhane ke liye hai.
 * Data hamesha naye se purane (descending) order mein aayega.
 */
export async function getRecords(collectionName) {
    try {
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        let records = [];
        querySnapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📦 Fetched ${records.length} records from [${collectionName}]`);
        return records;
    } catch (error) {
        console.error(`❌ Error fetching records from [${collectionName}]: `, error);
        return [];
    }
}

/**
 * 3. DELETE RECORD FUNCTION (Universal)
 * Kisi bhi entry ko delete karne ke liye (Jaise koi appointment cancel ho gayi).
 */
export async function deleteRecord(collectionName, documentId) {
    try {
        await deleteDoc(doc(db, collectionName, documentId));
        console.log(`🗑️ Record [${documentId}] deleted from [${collectionName}]`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Error deleting record [${documentId}]: `, error);
        return { success: false, error: error.message };
    }
}
