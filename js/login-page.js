// Login page JavaScript for TECHTRAIN

// DOM Elements
const loginForm = document.getElementById('login-form');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Redirect to student dashboard if already logged in
        window.location.href = 'student.html';
        return;
    }
    
    // Add event listener for form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Update cart count
    updateCartCount();
});

// Function to get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('techtrain_user');
    return user ? JSON.parse(user) : null;
}

// Handle login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get all registered users
    const users = getAllUsers();
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user to localStorage
        localStorage.setItem('techtrain_user', JSON.stringify(user));
        
        // Show success message
        alert('Login successful! Welcome back, ' + user.name);
        
        // Redirect to student dashboard
        window.location.href = 'student.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Function to get all registered users from localStorage
function getAllUsers() {
    const users = localStorage.getItem('techtrain_users');
    return users ? JSON.parse(users) : [
        // Default user for demo purposes
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "password123"
        }
    ];
}