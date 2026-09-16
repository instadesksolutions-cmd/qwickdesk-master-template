/* ==========================================================================
   QwickDesk Solutions - Universal Database Logic (Firestore CRUD)
   ========================================================================== */

import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

/**
 * Get collection name based on selected industry
 * @param {string} industry 
 * @returns {string} collection name in Firestore
 */
export function getCollectionName(industry) {
    const mapping = {
        'clinic': 'clinic_records',
        'restaurant': 'restaurant_orders',
        'grocery': 'grocery_inventory',
        'manufacturer': 'manufacturer_leads',
        'salon': 'salon_appointments',
        'gym': 'gym_members',
        'construction': 'construction_projects'
    };
    return mapping[industry] || 'universal_records';
}

/**
 * Fetch records for the selected industry from Firestore
 * @param {string} industry 
 */
export async function fetchIndustryData(industry) {
    const colName = getCollectionName(industry);
    const tableBody = document.getElementById('table-body');
    const statTotal = document.getElementById('stat-total');
    const statRevenue = document.getElementById('stat-revenue');
    const statPending = document.getElementById('stat-pending');

    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">Loading data for ${industry}...</td></tr>`;

    try {
        const q = query(collection(db, colName), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        let records = [];
        querySnapshot.forEach((docSnap) => {
            records.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Update Stats Counters
        if (statTotal) statTotal.textContent = records.length;
        
        let totalRev = records.reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.price) || 0), 0);
        if (statRevenue) statRevenue.textContent = `₹${totalRev.toLocaleString('en-IN')}`;

        let pendingCount = records.filter(r => r.status === 'Pending' || r.status === 'Scheduled').length;
        if (statPending) statPending.textContent = pendingCount;

        // Render Table Rows
        if (records.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No records found. Click 'Add New Record' to create one!</td></tr>`;
            return;
        }

        tableBody.innerHTML = '';
        records.forEach((record, index) => {
            const tr = document.createElement('tr');
            
            // Format date safely
            const dateStr = record.createdAt?.toDate ? record.createdAt.toDate().toLocaleDateString('en-IN') : 'Recent';
            const statusClass = (record.status === 'Completed' || record.status === 'Active' || record.status === 'Paid') ? 'status-success' : 'status-pending';

            tr.innerHTML = `
                <td><strong>#${index + 1}</strong> - ${record.name || record.title || 'Untitled'}</td>
                <td>${record.details || record.category || record.phone || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${record.status || 'Active'}</span></td>
                <td>${dateStr}</td>
                <td>
                    <button class="action-btn delete-btn" data-id="${record.id}" data-col="${colName}" title="Delete Record">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach Delete Event Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const docId = btn.getAttribute('data-id');
                const targetCol = btn.getAttribute('data-col');
                if (confirm("Are you sure you want to delete this record?")) {
                    await deleteRecord(docId, targetCol, industry);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        tableBody.innerHTML = `<tr><td colspan="5" class="empty-state" style="color: #ef4444 !important;">Error loading database records. Please check connection.</td></tr>`;
    }
}

/**
 * Add a new record to Firestore
 * @param {string} industry 
 * @param {Object} data 
 */
export async function addNewRecord(industry, data) {
    const colName = getCollectionName(industry);
    try {
        await addDoc(collection(db, colName), {
            ...data,
            createdAt: serverTimestamp()
        });
        fetchIndustryData(industry);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to add record. Check console.");
        return false;
    }
}

/**
 * Delete a record from Firestore
 * @param {string} docId 
 * @param {string} colName 
 * @param {string} industry 
 */
async function deleteRecord(docId, colName, industry) {
    try {
        await deleteDoc(doc(db, colName, docId));
        fetchIndustryData(industry);
    } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete record.");
    }
}
