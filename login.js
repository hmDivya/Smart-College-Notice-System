
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Show or hide password
togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "HIDE";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "SHOW";
    }

});

// Staff login
loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    message.textContent = "Signing in...";

    try {

        await signInWithEmailAndPassword(auth, email, password);

        message.textContent = "Login successful!";

        window.location.href = "./admin.html";

    } catch (error) {

        console.error("Login error:", error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
        ) {
            message.textContent = "Invalid email or password.";
        } else {
            message.textContent = "Unable to login. Please try again.";
        }

    }

});
