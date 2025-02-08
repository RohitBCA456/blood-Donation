const form = document.getElementById("form-data");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(
      "http://localhost:8000/api/v2/users/register",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    if(response.ok){
          alert("Registered successfully.");
          window.location.href = "http://127.0.0.1:5500/Frotend/login/loginPage.html"
}
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});
