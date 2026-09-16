/* ==========================================================================
   QwickDesk Solutions - Master Dashboard Application Controller
   ========================================================================== */

import { auth } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { fetchIndustryData, addNewRecord } from './database.js';

// Industry Meta Configurations (Titles & Subtitles)
const industryMeta = {
    'clinic': {
        title: 'Clinic Management System',
        subtitle: 'Manage appointments, patient records, follow-ups, and billing.',
        headers: '<th>Patient Name</th><th>Details / Phone</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'restaurant': {
        title: 'Restaurant & Café POS System',
        subtitle: 'Manage digital orders, KOT tables, inventory, and sales reports.',
        headers: '<th>Order Item</th><th>Table / Details</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'grocery': {
        title: 'Grocery & Supermarket POS',
        subtitle: 'Manage SKU barcodes, stock levels, billing, and supplier records.',
        headers: '<th>Product Name</th><th>SKU / Qty</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'manufacturer': {
        title: 'Manufacturer & B2B Portal',
        subtitle: 'Manage RFQ leads, dealer networks, orders, and warehouse inventory.',
        headers: '<th>Client / Company</th><th>Requirement</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'salon': {
        title: 'Salon & Spa Management',
        subtitle: 'Manage client appointments, staff schedules, and memberships.',
        headers: '<th>Client Name</th><th>Service / Time</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'gym': {
        title: 'Gym & Fitness Center CRM',
        subtitle: 'Track active memberships, trainer schedules, and attendance fees.',
        headers: '<th>Member Name</th><th>Plan / Phone</th><th>Status</th><th>Date</th><th>Actions</th>'
    },
    'construction': {
        title: 'Construction & Contractor Hub',
        subtitle: 'Manage project milestones, labor expenses, and client quotations.',
        headers: '<th>Project / Client</th><th>Location / Details</th><th>Status</th><th>Date</th><th>Actions</th>'
    }
};

window.addEventListener('DOMContentLoaded', () => {

    // 1. Auth State & User Display
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Agar logged in nahi hai, toh login page par wapas bhej do
            window.location.href = 'index.html';
        } else {
            const emailDisplay = document.getElementById('admin-email-display');
            if (emailDisplay) {
                emailDisplay.textContent = user.email;
            }
        }
    });

    // 2. Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to log out of QwickDesk Portal?")) {
                try {
                    await signOut(auth);
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Logout error:", error);
                }
            }
        });
    }

    // 3. Industry Switcher Dropdown Handler
    const industrySelect = document.getElementById('industry-mode');
    const dynamicTitle = document.getElementById('dynamic-title');
    const dynamicSubtitle = document.getElementById('dynamic-subtitle');
    const tableHeaders = document.getElementById('table-headers');

    function updateDashboardView(industry) {
        const meta = industryMeta[industry] || industryMeta['clinic'];
        if (dynamicTitle) dynamicTitle.textContent = meta.title;
        if (dynamicSubtitle) dynamicSubtitle.textContent = meta.subtitle;
        if (tableHeaders) tableHeaders.innerHTML = meta.headers;

        // Fetch data for selected industry from Firestore
        fetchIndustryData(industry);
    }

    if (industrySelect) {
        // Default load on startup
        updateDashboardView(industrySelect.value);

        // When user switches industry from dropdown
        industrySelect.addEventListener('change', (e) => {
            updateDashboardView(e.target.value);
        });
    }

    // 4. Add New Record Button Logic (Interactive Prompt)
    const addNewBtn = document.getElementById('add-new-btn');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', async () => {
            const currentIndustry = industrySelect ? industrySelect.value : 'clinic';
            
            // Quick interactive prompt to gather data for demo
            const name = prompt("Enter Name / Item Title:");
            if (!name) return;
            
            const details = prompt("Enter Details (Phone, Category, or SKU):") || "General Entry";
            const amountStr = prompt("Enter Amount / Price (₹):") || "500";
            const status = prompt("Enter Status (Completed / Pending / Active):") || "Active";

            const data = {
                name: name,
                details: details,
                amount: Number(amountStr),
                status: status
            };

            addNewBtn.textContent = "Saving...";
            addNewBtn.disabled = true;

            await addNewRecord(currentIndustry, data);

            addNewBtn.innerHTML = '<i class="fa-solid fa-plus"></i> <span id="add-btn-text">Add New Record</span>';
            addNewBtn.disabled = false;
        });
    }

    // 5. Sidebar Menu Tab Switching (UI effect)
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.getAttribute('data-section');
            if (section === 'marketing') {
                alert("Digital Marketing & SEO management module is synced with your QwickDesk system campaigns!");
            } else if (section === 'settings') {
                alert("System configuration is currently running on Firebase & Cloudflare R2 cloud storage.");
            }
        });
    });

    // 6. Table Live Search Filtering
    const tableSearch = document.getElementById('table-search');
    if (tableSearch) {
        tableSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#table-body tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
});
