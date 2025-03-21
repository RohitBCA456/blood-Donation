document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-data");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(form);
    console.log(formData);
    console.log("Form Data Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/v2/users/change-password",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        alert(errorData.message || "Failed to change password");
        return;
      }

      const data = await response.json();
      console.log("Password changed successfully:", data);
      alert("Password changed successfully!");
      window.location.href = "http://127.0.0.1:5500/Frotend/home/home.html";
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  });
});
