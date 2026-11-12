# Smart College Notice and Alert System

A cloud-based web application designed to simplify the publishing, management, and viewing of college announcements using Firebase.

## 📌 Project Overview

The **Smart College Notice and Alert System** is developed to provide a centralized digital platform for sharing important college announcements with students.

Traditional notice boards require students to visit physical locations to check updates. This system makes announcements accessible through a web-based notice board, helping improve communication between college staff and students.

The application provides a student-facing notice board and a staff management dashboard. Staff members can publish, update, and manage notices, while students can view announcements and search or filter them by category.

## 🎯 Objectives

- To develop a centralized online platform for college announcements.
- To simplify the process of publishing and managing notices.
- To provide students with easy access to important college updates.
- To organize announcements using different categories.
- To use Firebase for cloud-based data storage and application services.
- To provide a simple and user-friendly interface for students and staff.

## ✨ Features

### Student Module
- View published college announcements.
- Search notices using keywords.
- Filter notices by category.
- Access the notice board through a web browser.
- View notices related to examinations, events, circulars, placements, and general information.

### Staff / Admin Module
- Staff login and access verification.
- Staff management dashboard.
- Publish new college notices.
- Edit existing announcements.
- Manage or remove published notices.
- View total published notices.
- View monthly notice statistics.
- View category-wise notice analytics.
- View monthly publication activity through charts.
- Logout functionality.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive user interface |
| JavaScript | Application functionality |
| Firebase | Cloud backend services |
| Firebase Authentication | User authentication |
| Cloud Firestore | Cloud database for notices |
| Vite | Development server and build tool |
| Chart.js | Dashboard analytics and charts |
| Git and GitHub | Version control and source code hosting |

## 🏗️ Project Structure

```text
Smart-College-Notice-System/
│
├── images/
│   └── college.jpg
│
├── admin.html
├── admin.js
├── index.html
├── login.html
├── login.js
├── main.js
├── style.css
│
├── firebase.js
├── firebase.json
├── .firebaserc
├── .gitignore
│
├── package.json
├── package-lock.json
├── vite.config.js
│
├── README.md
└── LICENSE
```

## ⚙️ Installation and Setup

Follow these steps to run the project on your local system.

### 1. Clone the Repository

```bash
git clone https://github.com/hmDivya/Smart-College-Notice-System.git
```

### 2. Open the Project Folder

```bash
cd Smart-College-Notice-System
```

### 3. Install Dependencies

Make sure Node.js and npm are installed on your system.

```bash
npm install
```

### 4. Configure Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Register a web application in your Firebase project.
3. Enable the Firebase services required by the application, including Authentication and Cloud Firestore.
4. Configure your Firebase web application settings in `firebase.js`.
5. Configure the required Firestore security rules and user access permissions before using the application.

**Security Note:** Never upload Firebase service-account private keys, passwords, or other sensitive credentials to GitHub. Configure appropriate Firebase security rules to protect application data.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Open the Application

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

The student notice board will be displayed.

## 📊 Dashboard and Notice Categories

The application supports the following notice categories:

- Examination
- Event
- Circular
- Placement
- General

The staff dashboard also provides visual analytics for category-wise notices and monthly notice publication activity.

## ☁️ Cloud Integration

Firebase is used as the cloud backend for the application.

The integration supports:
- Authentication of staff users.
- Cloud-based storage and retrieval of notice information through Firestore.
- Access to application data from the web interface.

## 🚀 Future Enhancements

- Push notifications for newly published notices.
- Email alerts for important announcements.
- Student-specific notice subscriptions.
- Improved role-based access management.
- Mobile-friendly enhancements.
- Additional dashboard reports and analytics.

## 👩‍💻 Developer

**Divya Nayana H M**

GitHub: [hmDivya](https://github.com/hmDivya)

## 📂 GitHub Repository

[Smart College Notice and Alert System](https://github.com/hmDivya/Smart-College-Notice-System)

## 📄 License

This project is available under the MIT License. See the `LICENSE` file for details.
