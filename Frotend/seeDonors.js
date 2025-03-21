async function fetchDonors() {
          try {
              const response = await fetch("http://localhost:8000/api/v2/users/donors",
                    {
                              method: 'GET',
                          credentials: 'include',
                    }
              );
              const data = await response.json();
              const donors = data.donors;
      
              if (!Array.isArray(donors)) {
                  throw new Error("API response is not an array");
              }
      
              const container = document.getElementById('donor-container');
              container.innerHTML = '';
      
              donors.forEach(donor => {
                  const card = document.createElement('div');
                  card.classList.add('card');
                  card.innerHTML = `
                      <h3>${donor.name}</h3>
                      <p><strong>Blood Group:</strong> ${donor.blood_group}</p>
                      <p><strong>Contact:</strong> ${donor.contact}</p>
                      <p><strong>Location:</strong> ${donor.location}</p>
                  `;
                  container.appendChild(card);
              });
          } catch (error) {
              console.error('Error fetching donors:', error);
          }
      }
      
      fetchDonors();
      