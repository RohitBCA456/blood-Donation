const form = document.getElementById("form-data");

form.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("http://localhost:8000/api/v2/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Login successfully.");
      window.location.href = "http://127.0.0.1:5500/Frotend/home.html";
    } else {
      alert("Invalid Credentials! Please try again.");
    }
  } catch (error) {
    console.log("Error during login:", error);
  }
});
