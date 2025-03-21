const form = document.getElementById("form-data");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Create an object from form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://localhost:8000/api/v2/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    if(response.ok){
      alert("Registered successfully.");
      window.location.href = "http://127.0.0.1:5500/Frotend/loginPage.html";
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});
