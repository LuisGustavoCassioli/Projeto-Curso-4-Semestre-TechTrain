// History page JavaScript for TECHTRAIN

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const studentName = document.getElementById('student-name');
const videosWatched = document.getElementById('videos-watched');
const coursesCompleted = document.getElementById('courses-completed');
const currentStreak = document.getElementById('current-streak');
const historyList = document.getElementById('history-list');
const filterHistory = document.getElementById('filter-history');

// Sample course data (in a real app, this would come from an API)
const courseData = {
    1: {
        id: 1,
        title: "Complete JavaScript Course",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    2: {
        id: 2,
        title: "Python for Data Science",
        image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    3: {
        id: 3,
        title: "Cybersecurity Fundamentals",
        image: "https://images.unsplash.com/photo-1555066933-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    4: {
        id: 4,
        title: "UI/UX Design Masterclass",
        image: "https://images.unsplash.com/photo-1555066934-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    5: {
        id: 5,
        title: "React Frontend Development",
        image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    6: {
        id: 6,
        title: "Machine Learning with Python",
        image: "https://images.unsplash.com/photo-1555066936-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
};

// Video data
const videoData = {
    101: { id: 101, title: "Introduction to JavaScript" },
    102: { id: 102, title: "Variables and Data Types" },
    103: { id: 103, title: "Functions and Scope" },
    104: { id: 104, title: "Objects and Arrays" },
    105: { id: 105, title: "DOM Manipulation" },
    201: { id: 201, title: "Python Basics for Data Science" },
    202: { id: 202, title: "NumPy Arrays and Operations" },
    203: { id: 203, title: "Pandas DataFrames" },
    204: { id: 204, title: "Data Visualization with Matplotlib" },
    205: { id: 205, title: "Introduction to Scikit-learn" },
    301: { id: 301, title: "Introduction to Cybersecurity" },
    302: { id: 302, title: "Common Cyber Threats" },
    303: { id: 303, title: "Network Security Basics" },
    304: { id: 304, title: "Encryption Fundamentals" },
    305: { id: 305, title: "Firewalls and Intrusion Detection" },
    401: { id: 401, title: "Introduction to UI/UX Design" },
    402: { id: 402, title: "User Research and Personas" },
    403: { id: 403, title: "Wireframing and Prototyping" },
    404: { id: 404, title: "Visual Design Principles" },
    405: { id: 405, title: "Design Systems and Figma" },
    501: { id: 501, title: "Introduction to React" },
    502: { id: 502, title: "Components and Props" },
    503: { id: 503, title: "State and Lifecycle" },
    504: { id: 504, title: "React Hooks" },
    505: { id: 505, title: "Routing with React Router" },
    601: { id: 601, title: "Introduction to Machine Learning" },
    602: { id: 602, title: "Supervised Learning Algorithms" },
    603: { id: 603, title: "Unsupervised Learning Techniques" },
    604: { id: 604, title: "Model Evaluation and Validation" },
    605: { id: 605, title: "Deploying ML Models" }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    loadUserData(currentUser);
    
    // Add event listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (filterHistory) {
        filterHistory.addEventListener('change', loadHistory);
    }
    
    // Load history
    loadHistory();
    
    // Update cart count
    updateCartCount();
});

// Function to get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('techtrain_user');
    return user ? JSON.parse(user) : null;
}

// Function to logout
function logout() {
    // Remove user from localStorage
    localStorage.removeItem('techtrain_user');
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Function to load user data
function loadUserData(user) {
    if (studentName) studentName.textContent = user.name;
    
    // Load stats
    loadStats();
}

// Function to load stats
function loadStats() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get learning history
    const learningHistory = JSON.parse(localStorage.getItem('techtrain_learning_history')) || {};
    const userHistory = learningHistory[currentUser.id] || [];
    
    // Get streak data
    const streakData = JSON.parse(localStorage.getItem('techtrain_streaks')) || {};
    const userStreak = streakData[currentUser.id] || { currentStreak: 0 };
    
    // Calculate stats
    const videoCount = userHistory.filter(item => item.type === 'video').length;
    const courseCount = userHistory.filter(item => item.type === 'course').length;
    
    // Update UI
    if (videosWatched) videosWatched.textContent = videoCount;
    if (coursesCompleted) coursesCompleted.textContent = courseCount;
    if (currentStreak) currentStreak.textContent = userStreak.currentStreak;
}

// Function to load history
function loadHistory() {
    const currentUser = getCurrentUser();
    if (!currentUser || !historyList) return;
    
    // Get learning history
    const learningHistory = JSON.parse(localStorage.getItem('techtrain_learning_history')) || {};
    const userHistory = learningHistory[currentUser.id] || [];
    
    // Get filter value
    const filter = filterHistory ? filterHistory.value : 'all';
    
    // Filter history
    let filteredHistory = userHistory;
    if (filter !== 'all') {
        filteredHistory = userHistory.filter(item => item.type === filter);
    }
    
    // Sort by timestamp (newest first)
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Clear history list
    historyList.innerHTML = '';
    
    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-history text-gray-300 text-4xl mb-3"></i>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No activity yet</h3>
                <p class="text-gray-500">Start learning to see your activity history</p>
            </div>
        `;
        return;
    }
    
    // Load course progress data
    const courseProgressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
    
    // Display history items
    filteredHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'border border-gray-200 rounded-lg p-4 flex items-center';
        
        const timestamp = new Date(item.timestamp);
        const formattedDate = timestamp.toLocaleDateString();
        const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (item.type === 'video') {
            const video = videoData[item.itemId];
            const course = courseData[item.courseId];
            
            historyItem.innerHTML = `
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-video text-blue-600"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold">Watched video: ${video ? video.title : 'Unknown Video'}</h3>
                    <p class="text-gray-600 text-sm">${course ? course.title : 'Unknown Course'} • ${formattedDate} at ${formattedTime}</p>
                </div>
            `;
        } else if (item.type === 'course') {
            const course = courseData[item.courseId];
            const progress = courseProgressData[item.courseId];
            const score = progress ? progress.testScore : null;
            
            historyItem.innerHTML = `
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-graduation-cap text-green-600"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold">Completed course: ${course ? course.title : 'Unknown Course'}</h3>
                    <p class="text-gray-600 text-sm">Score: ${score !== null ? score + '%' : 'N/A'} • ${formattedDate} at ${formattedTime}</p>
                </div>
                <div class="ml-4">
                    <i class="fas fa-certificate text-purple-600"></i>
                </div>
            `;
        }
        
        historyList.appendChild(historyItem);
    });
}

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
        cartCountElement.textContent = cart.length;
    }
}