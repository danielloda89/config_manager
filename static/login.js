// static/login.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorDiv = document.getElementById("error");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent default form submission
        errorDiv.textContent = ""; // clear previous errors

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            // Send JSON payload to FastAPI
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uname: username,
                    upass: password
                }),
                redirect: "manual",
                credentials: "include" // handle redirects manually
            });

            const data = await response.json();
            if (data.success){
                window.location.href = data.redirect;
            } else{
                errorDiv.textContent = data.error;
            }



        } catch (err) {
            console.error("Login request failed:", err);
            errorDiv.textContent = "An error occurred during login.";
        }
    });
});
