const form = document.getElementById("form-data");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(form);
    const response = await fetch("http://localhost:8000/api/v2/users/request", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    if(response.ok){
      alert("Request sent successfully.");
      window.location.href = "http://127.0.0.1:5500/Frotend/home/home.html";
    }
  } catch (error) {
    console.log("Error submitting form:", error);
  }
});
