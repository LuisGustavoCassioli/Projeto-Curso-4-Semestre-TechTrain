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
        
        // Load certificates
        loadCertificates();
        
        // Load achievements
        loadAchievements();
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
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 2,
            title: "Python for Data Science",
            image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 5,
            title: "React Frontend Development",
            image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ];
    
    const coursesContainer = document.getElementById('enrolled-courses');
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = '';
    
    // Load course progress data
    const courseProgressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
    
    enrolledCourses.forEach(course => {
        // Get progress data for this course
        const progressData = courseProgressData[course.id];
        let progress = 0;
        let isCompleted = false;
        
        if (progressData) {
            // Calculate video progress
            const totalVideos = 5; // We know each course has 5 videos
            const completedVideos = progressData.completedVideos ? progressData.completedVideos.length : 0;
            const videoProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
            
            // If test is taken, use test score, otherwise use video progress
            progress = progressData.testScore !== null ? progressData.testScore : videoProgress;
            isCompleted = progressData.completedDate !== null;
        }
        
        const courseCard = document.createElement('div');
        courseCard.className = 'bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm';
        
        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="w-full h-32 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${course.title}</h3>
                <div class="mb-2">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
                ${isCompleted ? 
                    '<div class="flex items-center text-green-600 text-sm mb-2"><i class="fas fa-certificate mr-1"></i> Completed</div>' : 
                    ''
                }
                <a href="learning.html?courseId=${course.id}" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    ${isCompleted ? 'Review Course' : 'Continue Learning'} <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
    
    // Load progress chart
    loadProgressChart(enrolledCourses);
}

// Function to load progress chart
function loadProgressChart(enrolledCourses) {
    const progressChart = document.getElementById('progress-chart');
    if (!progressChart) return;
    
    // Load course progress data
    const courseProgressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
    
    progressChart.innerHTML = '';
    
    enrolledCourses.forEach(course => {
        // Get progress data for this course
        const progressData = courseProgressData[course.id];
        let progress = 0;
        let isCompleted = false;
        
        if (progressData) {
            // Calculate video progress
            const totalVideos = 5; // We know each course has 5 videos
            const completedVideos = progressData.completedVideos ? progressData.completedVideos.length : 0;
            const videoProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
            
            // If test is taken, use test score, otherwise use video progress
            progress = progressData.testScore !== null ? progressData.testScore : videoProgress;
            isCompleted = progressData.completedDate !== null;
        }
        
        const progressItem = document.createElement('div');
        progressItem.className = 'mb-3';
        progressItem.innerHTML = `
            <div class="flex justify-between text-sm mb-1">
                <span>${course.title}</span>
                <span>${progress}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: ${progress}%">
                    ${isCompleted ? '<div class="h-2 bg-green-500 rounded-full"></div>' : ''}
                </div>
            </div>
        `;
        
        progressChart.appendChild(progressItem);
    });
}

// Function to load certificates
function loadCertificates() {
    // Sample enrolled courses data
    const enrolledCourses = [
        {
            id: 1,
            title: "Complete JavaScript Course",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 2,
            title: "Python for Data Science",
            image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 5,
            title: "React Frontend Development",
            image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ];
    
    const certificatesContainer = document.getElementById('certificates-container');
    if (!certificatesContainer) return;
    
    certificatesContainer.innerHTML = '';
    
    // Load course progress data
    const courseProgressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
    
    let hasCertificates = false;
    
    enrolledCourses.forEach(course => {
        // Get progress data for this course
        const progressData = courseProgressData[course.id];
        
        // Check if course is completed
        if (progressData && progressData.completedDate) {
            hasCertificates = true;
            
            const certificateCard = document.createElement('div');
            certificateCard.className = 'bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm';
            
            certificateCard.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-certificate text-purple-600 text-2xl mr-3"></i>
                        <h3 class="font-bold text-lg">${course.title}</h3>
                    </div>
                    <p class="text-gray-600 text-sm mb-2">Score: ${progressData.testScore}%</p>
                    <p class="text-gray-600 text-sm mb-3">Completed: ${new Date(progressData.completedDate).toLocaleDateString()}</p>
                    <a href="learning.html?courseId=${course.id}" class="text-purple-600 hover:text-purple-800 font-medium text-sm">
                        View Certificate <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `;
            
            certificatesContainer.appendChild(certificateCard);
        }
    });
    
    // If no certificates, show a message
    if (!hasCertificates) {
        certificatesContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-certificate text-gray-300 text-4xl mb-3"></i>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No certificates yet</h3>
                <p class="text-gray-500">Complete courses and pass tests to earn certificates</p>
            </div>
        `;
    }
}

// Function to load achievements
function loadAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    // Get current user
    const currentUser = getCurrentUser();
    
    // Get course progress data
    const courseProgressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
    
    // Get streak data
    const streakData = JSON.parse(localStorage.getItem('techtrain_streaks')) || {};
    const userStreak = streakData[currentUser.id] || { currentStreak: 0, longestStreak: 0 };
    
    // Get category exploration data
    const categoryData = JSON.parse(localStorage.getItem('techtrain_category_exploration')) || {};
    const userCategories = categoryData[currentUser.id] || [];
    
    // Get quick completions data
    const quickCompletions = JSON.parse(localStorage.getItem('techtrain_quick_completions')) || {};
    const userQuickCompletions = quickCompletions[currentUser.id] || [];
    
    // Count completed courses by category
    const completedCategories = new Set();
    let completedCourses = 0;
    let totalScore = 0;
    let courseCount = 0;
    
    // Sample course data with categories (in a real app, this would come from an API)
    const courseCategories = {
        1: "programming",
        2: "data-science",
        3: "cybersecurity",
        4: "design",
        5: "programming",
        6: "data-science"
    };
    
    Object.entries(courseProgressData).forEach(([courseId, progress]) => {
        if (progress.completedDate) {
            completedCourses++;
            totalScore += progress.testScore || 0;
            courseCount++;
            
            // Add category to completed categories
            if (courseCategories[courseId]) {
                completedCategories.add(courseCategories[courseId]);
            }
        }
    });
    
    // Calculate average score
    const averageScore = courseCount > 0 ? Math.round(totalScore / courseCount) : 0;
    
    // Sample achievements data with more achievements based on user activity
    const achievements = [
        {
            id: 1,
            title: "First Course",
            description: "Complete your first course",
            icon: "fas fa-graduation-cap",
            earned: completedCourses >= 1
        },
        {
            id: 2,
            title: "Quick Learner",
            description: "Complete a course in less than a week",
            icon: "fas fa-bolt",
            earned: false // This would require tracking start dates
        },
        {
            id: 3,
            title: "Top Performer",
            description: "Score 90% or higher on a test",
            icon: "fas fa-medal",
            earned: averageScore >= 90
        },
        {
            id: 4,
            title: "Bookworm",
            description: "Complete 5 courses",
            icon: "fas fa-book",
            earned: completedCourses >= 5
        },
        {
            id: 5,
            title: "Streak Master",
            description: "Learn for 7 consecutive days",
            icon: "fas fa-fire",
            earned: userStreak.currentStreak >= 7
        },
        {
            id: 6,
            title: "Polyglot",
            description: "Complete courses in 3 different categories",
            icon: "fas fa-language",
            earned: completedCategories.size >= 3
        },
        {
            id: 7,
            title: "Perfectionist",
            description: "Complete all courses with 100% scores",
            icon: "fas fa-crown",
            earned: averageScore === 100 && completedCourses > 0
        },
        {
            id: 8,
            title: "Explorer",
            description: "Try courses from all categories",
            icon: "fas fa-compass",
            earned: userCategories.length >= 4 // Assuming 4 categories: programming, data-science, cybersecurity, design
        },
        {
            id: 9,
            title: "Early Bird",
            description: "Complete a course in under 24 hours",
            icon: "fas fa-sun",
            earned: userQuickCompletions.length > 0
        }
    ];
    
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = `border rounded-lg p-4 text-center ${
            achievement.earned ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`;
        
        achievementCard.innerHTML = `
            <div class="flex justify-center mb-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                }">
                    <i class="${achievement.icon}"></i>
                </div>
            </div>
            <h3 class="font-bold text-lg mb-1">${achievement.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${achievement.description}</p>
            <span class="inline-block px-2 py-1 text-xs rounded-full ${
                achievement.earned ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
            }">
                ${achievement.earned ? 'Earned' : 'Locked'}
            </span>
        `;
        
        achievementsContainer.appendChild(achievementCard);
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