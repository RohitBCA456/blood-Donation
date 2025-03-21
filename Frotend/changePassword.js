document.addEventListener("DOMContentLoaded", () => {
          const form = document.getElementById("form-data");
        
          form.addEventListener("submit", async function (event) {
            event.preventDefault();  // Prevent page reload
        
            const formData = new FormData(form);
        
            try {
              console.log("Sending request to backend...");
        
              const response = await fetch(
                "http://localhost:8000/api/v2/users/change-password",
                {
                  method: "POST",
                  body: formData,
                  credentials: "include",  // Important if you are using cookies
                  headers: {
                    "Accept": "application/json",
                  }
                }
              );
        
              console.log("Request sent. Waiting for response...");
        
              if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert(errorData.message || "Failed to change password");
                return;  // Stop execution if there's an error
              }
        
              const data = await response.json();
              console.log("Password changed successfully:", data);
              alert("Password changed successfully!");
              window.location.href = "http://127.0.0.1:5500/Frotend/home.html";
              
            } catch (error) {
              console.error("Error:", error);
            }
          });
        });
        