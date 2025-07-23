document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // This is a dummy login validation. 
            // In a real application, you would make an API call to authenticate the user.
            const username = event.target.username.value;
            const password = event.target.password.value;

            if (username && password) {
                if (window.location.pathname.includes('/admin/')) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert('Please enter username and password.');
            }
        });
    }
}); 