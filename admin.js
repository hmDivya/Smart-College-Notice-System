
import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    getDoc
} from "firebase/firestore";

import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

// ======================================
// HTML ELEMENTS
// ======================================

const noticeForm = document.getElementById("noticeForm");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");
const adminNoticeList = document.getElementById("adminNoticeList");

const staffEmail = document.getElementById("staffEmail");
const staffRole = document.getElementById("staffRole");
const dashboardTitle = document.getElementById("dashboardTitle");
const accountRole = document.getElementById("accountRole");

const totalNotices = document.getElementById("totalNotices");
const monthlyNotices = document.getElementById("monthlyNotices");

const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");

let currentRole = null;
let editingNoticeId = null;

let categoryChartInstance = null;
let monthlyChartInstance = null;


// ======================================
// CHECK LOGIN AND USER ROLE
// ======================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "./login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            alert("You are not authorized to access this dashboard.");

            await signOut(auth);
            window.location.href = "./login.html";
            return;
        }

        currentRole = userSnapshot.data().role;

        if (!["admin", "lecturer"].includes(currentRole)) {

            alert("Access denied.");

            await signOut(auth);
            window.location.href = "./login.html";
            return;
        }

        // Display staff details

        staffEmail.textContent = user.email;

        staffRole.textContent =
            currentRole === "admin"
                ? "Main Administrator"
                : "HOD / Lecturer";

        accountRole.textContent =
            currentRole === "admin" ? "Admin" : "HOD";

        dashboardTitle.textContent =
            currentRole === "admin"
                ? "Administrator Dashboard"
                : "HOD Notice Dashboard";

        await loadAdminNotices();

    } catch (error) {

        console.error("Permission check error:", error);

        message.textContent = "Unable to verify your account.";

    }

});


// ======================================
// LOGOUT
// ======================================

logoutButton.addEventListener("click", async () => {

    try {

        await signOut(auth);
        window.location.href = "./login.html";

    } catch (error) {

        console.error("Logout error:", error);

    }

});


// ======================================
// ADD NEW NOTICE
// ======================================

noticeForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!currentRole || !auth.currentUser) return;

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    try {

        await addDoc(collection(db, "notices"), {

            title,
            description,
            category,
            date,

            postedBy: auth.currentUser.email,
            createdAt: new Date().toISOString()

        });

        message.textContent = "Notice published successfully!";

        noticeForm.reset();

        await loadAdminNotices();

    } catch (error) {

        console.error("Error publishing notice:", error);

        message.textContent = "Failed to publish notice.";

    }

});


// ======================================
// LOAD AND DISPLAY NOTICES
// ======================================

async function loadAdminNotices() {

    try {

        const querySnapshot = await getDocs(
            collection(db, "notices")
        );

        adminNoticeList.innerHTML = "";

        const notices = [];

        querySnapshot.forEach((noticeDoc) => {

            notices.push({
                id: noticeDoc.id,
                ...noticeDoc.data()
            });

        });

        // Update total notices
        totalNotices.textContent = notices.length;

        // Update analytics graphs
        updateAnalytics(notices);

        if (notices.length === 0) {

            adminNoticeList.textContent = "No notices available.";

            return;
        }

        notices.forEach((notice) => {

            const card = document.createElement("div");
            card.className = "notice-card";

            const heading = document.createElement("h3");
            heading.textContent = notice.title || "College Notice";

            const category = document.createElement("p");
            category.textContent =
                "Category: " + (notice.category || "General");

            const date = document.createElement("p");
            date.textContent =
                "Date: " + (notice.date || "Not specified");

            const description = document.createElement("p");
            description.textContent = notice.description || "";

            const postedBy = document.createElement("p");
            postedBy.textContent =
                "Posted by: " + (notice.postedBy || "Staff");

            const actions = document.createElement("div");
            actions.className = "notice-actions";

            const editButton = document.createElement("button");
            editButton.textContent = "Edit Notice";
            editButton.className = "edit-button";

            editButton.addEventListener("click", () => {
                editNotice(notice.id, notice);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Notice";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", () => {
                deleteNotice(notice.id);
            });

            actions.append(editButton, deleteButton);

            card.append(
                heading,
                category,
                date,
                description,
                postedBy,
                actions
            );

            adminNoticeList.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading notices:", error);

        adminNoticeList.textContent = "Unable to load notices.";

    }

}


// ======================================
// NOTICE ANALYTICS
// ======================================

function updateAnalytics(notices) {

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // ----------------------------------
    // CATEGORY-WISE NOTICE COUNTS
    // ----------------------------------

    const categoryCounts = {
        Examination: 0,
        Event: 0,
        Circular: 0,
        Placement: 0,
        General: 0
    };

    notices.forEach((notice) => {

        const category = notice.category || "General";

        if (categoryCounts[category] !== undefined) {
            categoryCounts[category]++;
        } else {
            categoryCounts.General++;
        }

    });

    // ----------------------------------
    // MONTHLY NOTICE COUNTS
    // ----------------------------------

    const monthLabels = [];
    const monthCounts = [];
    let currentMonthCount = 0;

    // Build the last six months
    for (let i = 5; i >= 0; i--) {

        const monthDate = new Date(
            currentYear,
            currentMonth - i,
            1
        );

        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const monthKey =
            year + "-" + String(month + 1).padStart(2, "0");

        monthLabels.push(
            monthDate.toLocaleString("en-IN", {
                month: "short",
                year: "numeric"
            })
        );

        const count = notices.filter((notice) => {

            // Prefer actual publication timestamp.
            // For older notices without createdAt, use notice date.
            const rawDate = notice.createdAt || notice.date;

            if (!rawDate) return false;

            const publishedDate = new Date(
                notice.createdAt
                    ? rawDate
                    : rawDate + "T12:00:00"
            );

            if (isNaN(publishedDate.getTime())) return false;

            const publishedMonthKey =
                publishedDate.getFullYear() +
                "-" +
                String(publishedDate.getMonth() + 1).padStart(2, "0");

            return publishedMonthKey === monthKey;

        }).length;

        monthCounts.push(count);

        if (year === currentYear && month === currentMonth) {
            currentMonthCount = count;
        }

    }

    // Update current month statistic
    monthlyNotices.textContent = currentMonthCount;

    // ----------------------------------
    // CATEGORY BAR CHART
    // ----------------------------------

    const categoryCanvas =
        document.getElementById("categoryChart");

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(categoryCanvas, {

        type: "bar",

        data: {
            labels: Object.keys(categoryCounts),

            datasets: [{
                label: "Number of Notices",

                data: Object.values(categoryCounts),

                backgroundColor: [
                    "#243b64",
                    "#c5a15a",
                    "#58759b",
                    "#9b845c",
                    "#8292a8"
                ],

                borderRadius: 7,

                borderSkipped: false
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return "Notices: " + context.raw;
                        }
                    }
                }
            },

            scales: {

                y: {
                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    },

                    grid: {
                        color: "#e9edf3"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });


    // ----------------------------------
    // MONTHLY LINE CHART
    // ----------------------------------

    const monthlyCanvas =
        document.getElementById("monthlyChart");

    if (monthlyChartInstance) {
        monthlyChartInstance.destroy();
    }

    monthlyChartInstance = new Chart(monthlyCanvas, {

        type: "line",

        data: {

            labels: monthLabels,

            datasets: [{

                label: "Published Notices",

                data: monthCounts,

                borderColor: "#243b64",

                backgroundColor: "rgba(197, 161, 90, 0.18)",

                pointBackgroundColor: "#c5a15a",

                pointBorderColor: "#243b64",

                pointRadius: 5,

                pointHoverRadius: 7,

                borderWidth: 3,

                tension: 0.35,

                fill: true

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true,
                    position: "top"
                }

            },

            scales: {

                y: {
                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    },

                    grid: {
                        color: "#e9edf3"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });

}


// ======================================
// OPEN EDIT DIALOG
// ======================================

function editNotice(id, notice) {

    editingNoticeId = id;

    document.getElementById("editTitle").value =
        notice.title || "";

    document.getElementById("editDescription").value =
        notice.description || "";

    document.getElementById("editCategory").value =
        notice.category || "General";

    document.getElementById("editDate").value =
        notice.date || "";

    editDialog.showModal();

}


// ======================================
// SAVE EDITED NOTICE
// ======================================

editForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!editingNoticeId) return;

    const title = document.getElementById("editTitle").value.trim();

    const description =
        document.getElementById("editDescription").value.trim();

    const category = document.getElementById("editCategory").value;

    const date = document.getElementById("editDate").value;

    try {

        await updateDoc(
            doc(db, "notices", editingNoticeId),
            {
                title,
                description,
                category,
                date
            }
        );

        editDialog.close();
        editingNoticeId = null;

        message.textContent = "Notice updated successfully!";

        await loadAdminNotices();

    } catch (error) {

        console.error("Error updating notice:", error);

        message.textContent = "Failed to update notice.";

    }

});


// ======================================
// CANCEL EDIT
// ======================================

document.getElementById("cancelEdit").addEventListener("click", () => {

    editDialog.close();
    editingNoticeId = null;

});


// ======================================
// DELETE NOTICE
// ======================================

async function deleteNotice(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this notice?"
    );

    if (!confirmation) return;

    try {

        await deleteDoc(doc(db, "notices", id));

        message.textContent = "Notice deleted successfully!";

        await loadAdminNotices();

    } catch (error) {

        console.error("Error deleting notice:", error);

        message.textContent = "Failed to delete notice.";

    }

}
