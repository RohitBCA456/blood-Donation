const form = document.getElementById("form-data");

form.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const formData = new FormData(form);
    const response = await fetch("http://localhost:8000/api/v2/users/login", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      alert("Login successfully.");
      window.location.href = "http://127.0.0.1:5500/Frotend/home/home.html";
    } else {
      alert("Invalid Credentials!, please try again.");
    }
  } catch (error) {
    console.log(error);
  }
});
