// Login and student area JavaScript for TECHTRAIN

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const profileForm = document.getElementById('profile-form');
const studentName = document.getElementById('student-name');
const sidebarName = document.getElementById('sidebar-name');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the student page
    const isStudentPage = window.location.pathname.includes('student.html');
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (isStudentPage && !currentUser) {
        // Redirect to login page if not logged in and on student page
        window.location.href = 'login.html';
        return;
    } else if (!isStudentPage && !currentUser) {
        // For other pages, redirect to index.html if not logged in
        // (This maintains existing behavior for other pages)
        // window.location.href = 'index.html';
        // return;
    }
    
    // Only load user data and set up event listeners if we're on the student page
    if (isStudentPage) {
        // Load user data
        loadUserData(currentUser);
        
        // Add event listeners
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updateProfile();
            });
        }
        
        // Load enrolled courses
        loadEnrolledCourses();
    }
});

// Function to get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('techtrain_user');
    return user ? JSON.parse(user) : null;
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

// Function to load user data
function loadUserData(user) {
    if (studentName) studentName.textContent = user.name;
    if (sidebarName) sidebarName.textContent = user.name;
    if (fullNameInput) fullNameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
}

// Function to logout
function logout() {
    // Remove user from localStorage
    localStorage.removeItem('techtrain_user');
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Function to update profile
function updateProfile() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!fullName || !email) {
        showProfileMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showProfileMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Password validation
    if (password && password !== confirmPassword) {
        showProfileMessage('Passwords do not match.', 'error');
        return;
    }
    
    // Get current user
    let currentUser = getCurrentUser();
    
    // Get all users
    let users = getAllUsers();
    
    // Check if email is already used by another user
    if (email !== currentUser.email) {
        const existingUser = users.find(u => u.email === email && u.id !== currentUser.id);
        if (existingUser) {
            showProfileMessage('This email is already registered to another account.', 'error');
            return;
        }
    }
    
    // Update user data
    currentUser.name = fullName;
    currentUser.email = email;
    
    // Update password if provided
    if (password) {
        currentUser.password = password;
    }
    
    // Update user in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        // Save updated users array to localStorage
        localStorage.setItem('techtrain_users', JSON.stringify(users));
    }
    
    // Save current user to localStorage
    localStorage.setItem('techtrain_user', JSON.stringify(currentUser));
    
    // Update UI
    loadUserData(currentUser);
    
    // Show success message
    showProfileMessage('Profile updated successfully!', 'success');
}

// Function to show profile message
function showProfileMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `mt-4 p-4 rounded-lg ${
        type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
    }`;
    messageElement.textContent = text;
    
    // Insert after the form
    profileForm.parentNode.insertBefore(messageElement, profileForm.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Function to load enrolled courses
function loadEnrolledCourses() {
    // Sample enrolled courses data
    const enrolledCourses = [
        {
            id: 1,
            title: "Complete JavaScript Course",
            progress: 75,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 2,
            title: "Python for Data Science",
            progress: 40,
            image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 5,
            title: "React Frontend Development",
            progress: 20,
            image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ];
    
    const coursesContainer = document.getElementById('enrolled-courses');
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = '';
    
    enrolledCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm';
        
        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="w-full h-32 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${course.title}</h3>
                <div class="mb-2">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${course.progress}%"></div>
                    </div>
                </div>
                <a href="course.html?id=${course.id}" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Continue Learning <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
}

// Function to simulate login (for demo purposes)
function simulateLogin() {
    // Sample user data
    const user = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
    };
    
    // Save to localStorage
    localStorage.setItem('techtrain_user', JSON.stringify(user));
}