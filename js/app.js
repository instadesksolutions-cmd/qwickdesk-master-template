/* ==========================================================================
   QwickDesk Solutions - Master App Logic
   Yeh file Dashboard ki security, UI switching aur database ko handle karegi.
   ========================================================================== */

// 1. Firebase Modules Import
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// --- SECURITY & SESSION CHECK ---
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No admin found! Redirecting to login...");
        window.location.href = 'index.html'; // Bina login ke bahar nikal do
    } else {
        console.log("Admin Verified: ", user.email);
        // Initial data load jab admin verify ho jaye
        updateDashboardUI('clinic'); 
    }
});

// --- LOGOUT LOGIC ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log("Logged out successfully");
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout Error: ", error);
        }
    });
}

// --- MASTER INDUSTRY CONFIGURATION (The Magic Data) ---
// Har category ka UI data yahan define kiya hai taaki HTML baar-baar na badalna pade
const industryConfig = {
    clinic: {
        pageTitle: "Clinic & Healthcare System",
        stat1Label: "Total Patients",
        stat2Label: "Daily Revenue",
        stat3Label: "Appointments",
        tableTitle: "Recent Appointments",
        tableHeaders: ["ID", "Patient Name", "Doctor/Service", "Date", "Action"],
        dummyData: [
            ["#CLN-001", "Rahul Sharma", "Dental Checkup", "16 Sep, 10:30 AM", `<span class="status-badge status-success">Completed</span>`],
            ["#CLN-002", "Priya Verma", "Physiotherapy", "16 Sep, 02:00 PM", `<span class="status-badge status-pending">Pending</span>`]
        ]
    },
    retail: {
        pageTitle: "Retail POS & Inventory System",
        stat1Label: "Total SKUs",
        stat2Label: "Today's Sales",
        stat3Label: "Low Stock Items",
        tableTitle: "Recent Billing Actions",
        tableHeaders: ["Bill No.", "Customer/Table", "Amount", "Time", "Action"],
        dummyData: [
            ["#BIL-992", "Walk-in Customer", "₹ 1,250", "16 Sep, 01:15 PM", `<span class="status-badge status-success">Paid</span>`],
            ["#BIL-993", "Table 4 (Dine-in)", "₹ 850", "16 Sep, 01:45 PM", `<span class="status-badge status-pending">KOT Active</span>`]
        ]
    },
    builder: {
        pageTitle: "Construction & Project Manager",
        stat1Label: "Active Projects",
        stat2Label: "Expenses",
        stat3Label: "Site Visits",
        tableTitle: "Project Status Updates",
        tableHeaders: ["Site ID", "Project Name", "Manager", "Update Date", "Status"],
        dummyData: [
            ["#PRJ-04", "Navi Mumbai Tower", "Suresh Patil", "15 Sep, 2026", `<span class="status-badge status-pending">In Progress</span>`],
            ["#PRJ-05", "Bandra Villa", "Ramesh K.", "16 Sep, 2026", `<span class="status-badge status-success">Completed Phase 1</span>`]
        ]
    },
    manufacturer: {
        pageTitle: "Manufacturer ERP System",
        stat1Label: "B2B Dealers",
        stat2Label: "Pending Orders",
        stat3Label: "Production Units",
        tableTitle: "Dealer Order Pipeline",
        tableHeaders: ["Order ID", "Dealer Name", "Quantity", "Expected Delivery", "Status"],
        dummyData: [
            ["#MFG-102", "Sharma Distributors", "500 Boxes", "20 Sep, 2026", `<span class="status-badge status-pending">Production</span>`],
            ["#MFG-103", "Apex Traders", "1200 Boxes", "18 Sep, 2026", `<span class="status-badge status-success">Dispatched</span>`]
        ]
    }
};

// --- DYNAMIC UI SWITCHER FUNCTION ---
const industrySwitcher = document.getElementById('demo-industry');
const pageTitle = document.getElementById('page-title');
const stat1 = document.querySelector('.stat-card:nth-child(1) h3');
const stat2 = document.querySelector('.stat-card:nth-child(2) h3');
const stat3 = document.querySelector('.stat-card:nth-child(3) h3');
const tableTitle = document.getElementById('table-title');
const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');

// Client Jab Naya Industry Select Karega
if (industrySwitcher) {
    industrySwitcher.addEventListener('change', (e) => {
        updateDashboardUI(e.target.value);
    });
}

function updateDashboardUI(industryKey) {
    const config = industryConfig[industryKey];
    if (!config) return;

    // 1. Text Update karna
    pageTitle.textContent = config.pageTitle;
    stat1.textContent = config.stat1Label;
    stat2.textContent = config.stat2Label;
    stat3.textContent = config.stat3Label;
    tableTitle.textContent = config.tableTitle;

    // 2. Table Headers Generate Karna
    tableHead.innerHTML = '';
    config.tableHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // 3. Table Rows (Dummy Data for Demo) Generate Karna
    tableBody.innerHTML = '';
    config.dummyData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row[0]}</strong></td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>
                ${row[4]}
                <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- QUICK ADD BUTTON ALERT ---
const quickAddBtn = document.getElementById('quick-add-btn');
if(quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
        alert("This is a live demo portal. Real-time Firebase entry module will open here!");
    });
}

// Mobile Sidebar Toggle
const toggleMenu = document.getElementById('toggle-menu');
const sidebar = document.getElementById('sidebar');
if(toggleMenu && sidebar) {
    toggleMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}
