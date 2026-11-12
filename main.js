import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "firebase/firestore";


const noticeList = document.getElementById("noticeList");

const searchInput = document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


let allNotices = [];


// =====================================
// Real-Time Firestore Updates
// =====================================

const noticesRef = collection(db, "notices");

onSnapshot(noticesRef, (querySnapshot) => {

    allNotices = [];

    querySnapshot.forEach((doc) => {

        allNotices.push({
            id: doc.id,
            ...doc.data()
        });

    });

    displayNotices();

}, (error) => {

    console.error("Error getting notices:", error);

    noticeList.innerHTML =
        "<p>Unable to load notices.</p>";

});


// =====================================
// Display Notices
// =====================================

function displayNotices() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredNotices = allNotices.filter((notice) => {

        const title =
            (notice.title || "").toLowerCase();

        const description =
            (notice.description || "").toLowerCase();

        const category =
            (notice.category || "").toLowerCase();


        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            category.includes(searchText);


        const matchesCategory =
            selectedCategory === "All" ||
            notice.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    noticeList.innerHTML = "";


    // No matching notices

    if (filteredNotices.length === 0) {

        noticeList.innerHTML =
            "<p>No matching notices found.</p>";

        return;

    }


    // Display notices

    filteredNotices.forEach((notice) => {

        const noticeCard =
            document.createElement("div");

        noticeCard.className = "notice-card";


        noticeCard.innerHTML = `

            <h3>
                📢 ${notice.title || "College Notice"}
            </h3>

            <p class="notice-category">
                📂 <strong>Category:</strong>
                ${notice.category || "General"}
            </p>

            <p class="notice-date">
                📅 <strong>Date:</strong>
                ${notice.date || "Not specified"}
            </p>

            <p class="notice-description">
                ${notice.description || ""}
            </p>

        `;


        noticeList.appendChild(noticeCard);

    });

}


// =====================================
// Search Notices
// =====================================

searchInput.addEventListener("input", () => {

    displayNotices();

});


// =====================================
// Filter by Category
// =====================================

categoryFilter.addEventListener("change", () => {

    displayNotices();

});