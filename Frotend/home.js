async function logout() {
          try {
                    const response = await fetch('https://blood-donation-8nn5.vercel.app/api/v2/users/logout', {
                              method: 'POST',
                              credentials: 'include'
                    });

                    if (response.ok) {
                              console.log('Logout successful');
                              window.location.href = 'http://127.0.0.1:5500/Frotend/loginPage.html';
                    } else {
                              console.error('Logout failed');
                    }
          } catch (error) {
                    console.error('Error:', error);
          }
}