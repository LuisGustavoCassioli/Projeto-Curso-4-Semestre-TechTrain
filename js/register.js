// Registration page JavaScript for TECHTRAIN

// DOM Elements
const registerForm = document.getElementById('register-form');

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
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
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

// Handle registration
function handleRegistration() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Check if email is already registered
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        alert('An account with this email already exists. Please use a different email.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(), // Simple ID generation
        name: fullName,
        email: email,
        password: password
    };
    
    // Add new user to users array
    users.push(newUser);
    
    // Save updated users array to localStorage
    localStorage.setItem('techtrain_users', JSON.stringify(users));
    
    // Automatically log in the new user
    localStorage.setItem('techtrain_user', JSON.stringify(newUser));
    
    // Show success message
    alert('Registration successful! Welcome to TECHTRAIN, ' + newUser.name);
    
    // Redirect to student dashboard
    window.location.href = 'student.html';
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