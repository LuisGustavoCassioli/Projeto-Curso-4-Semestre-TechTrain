// Statistics page JavaScript for TECHTRAIN
// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const totalCoursesElement = document.getElementById('total-courses');
const completedCoursesElement = document.getElementById('completed-courses');
const totalTimeElement = document.getElementById('total-time');
const certificatesElement = document.getElementById('certificates');
const weeklyActivityElement = document.getElementById('weekly-activity');
const topCoursesElement = document.getElementById('top-courses');

// Chart instances
let progressChart = null;
let categoryChart = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Set up event listeners
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Load statistics data
    loadStatistics();
    
    // Update cart count
    updateCartCount();
    
    // Initialize dark mode
    initDarkMode();
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

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
        cartCountElement.textContent = cart.length;
    }
}

// Function to load statistics data
function loadStatistics() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const userId = currentUser.id;
    
    // Load course data
    fetch('data/cursos.json')
        .then(response => response.json())
        .then(courses => {
            // Get user's enrolled courses
            const enrolledCourses = getUserEnrolledCourses(userId);
            
            // Get course progress data
            const progressData = JSON.parse(localStorage.getItem('techtrain_course_progress')) || {};
            
            // Calculate statistics
            calculateStatistics(courses, enrolledCourses, progressData, userId);
        })
        .catch(error => {
            console.error('Error loading course data:', error);
        });
}

// Function to get user's enrolled courses
function getUserEnrolledCourses(userId) {
    const userCourses = JSON.parse(localStorage.getItem('techtrain_user_courses')) || {};
    return userCourses[userId] || [];
}

// Function to calculate statistics
function calculateStatistics(courses, enrolledCourses, progressData, userId) {
    // Total courses
    const totalCourses = enrolledCourses.length;
    if (totalCoursesElement) totalCoursesElement.textContent = totalCourses;
    
    // Completed courses
    let completedCourses = 0;
    let totalCertificates = 0;
    
    enrolledCourses.forEach(courseId => {
        const courseProgress = progressData[courseId];
        if (courseProgress && courseProgress.completedDate) {
            completedCourses++;
            totalCertificates++; // Each completed course gives a certificate
        }
    });
    
    if (completedCoursesElement) completedCoursesElement.textContent = completedCourses;
    if (certificatesElement) certificatesElement.textContent = totalCertificates;
    
    // Total learning time (estimated based on course durations)
    let totalMinutes = 0;
    enrolledCourses.forEach(courseId => {
        const course = courses.find(c => c.id == courseId);
        if (course) {
            // Convert duration like "25 hours" to minutes
            const durationMatch = course.duration.match(/(\d+) hours?/);
            if (durationMatch) {
                const hours = parseInt(durationMatch[1]);
                totalMinutes += hours * 60;
            }
        }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (totalTimeElement) totalTimeElement.textContent = `${hours}h ${minutes}m`;
    
    // Render charts
    renderProgressChart(enrolledCourses, progressData);
    renderCategoryChart(courses, enrolledCourses);
    
    // Render weekly activity
    renderWeeklyActivity(userId);
    
    // Render top courses
    renderTopCourses(courses, enrolledCourses, progressData);
}

// Function to render progress chart
function renderProgressChart(enrolledCourses, progressData) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Prepare data for the chart
    const labels = [];
    const data = [];
    
    enrolledCourses.forEach((courseId, index) => {
        const courseProgress = progressData[courseId];
        if (courseProgress) {
            labels.push(`Course ${index + 1}`);
            const totalVideos = courseProgress.completedVideos ? courseProgress.completedVideos.length : 0;
            data.push(totalVideos);
        }
    });
    
    // Destroy existing chart if it exists
    if (progressChart) {
        progressChart.destroy();
    }
    
    // Create new chart
    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Videos Completed',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to render category chart
function renderCategoryChart(courses, enrolledCourses) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Count courses by category
    const categoryCount = {};
    
    enrolledCourses.forEach(courseId => {
        const course = courses.find(c => c.id == courseId);
        if (course) {
            if (!categoryCount[course.category]) {
                categoryCount[course.category] = 0;
            }
            categoryCount[course.category]++;
        }
    });
    
    // Prepare data for the chart
    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);
    
    // Destroy existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    // Create new chart
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(234, 88, 12, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(251, 146, 60, 1)',
                    'rgba(234, 88, 12, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Function to render weekly activity
function renderWeeklyActivity(userId) {
    if (!weeklyActivityElement) return;
    
    // Get learning history
    const learningHistory = JSON.parse(localStorage.getItem('techtrain_learning_history')) || {};
    const userHistory = learningHistory[userId] || [];
    
    // Get last 7 days
    const days = [];
    const activityCount = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        days.push(dateString.substring(0, 3)); // Get day abbreviation
        
        // Count activities for this day
        const count = userHistory.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate.toDateString() === dateString;
        }).length;
        
        activityCount.push(count);
    }
    
    // Clear existing content
    weeklyActivityElement.innerHTML = '';
    
    // Create activity bars
    days.forEach((day, index) => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-center justify-between py-2 border-b border-gray-100';
        
        activityElement.innerHTML = `
            <span class="font-medium">${day}</span>
            <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${activityCount[index] > 0 ? Math.min(activityCount[index] * 20, 100) : 0}%"></div>
                </div>
                <span class="text-gray-600">${activityCount[index]} activities</span>
            </div>
        `;
        
        weeklyActivityElement.appendChild(activityElement);
    });
}

// Function to render top courses
function renderTopCourses(courses, enrolledCourses, progressData) {
    if (!topCoursesElement) return;
    
    // Calculate progress percentage for each course
    const courseProgress = enrolledCourses.map(courseId => {
        const course = courses.find(c => c.id == courseId);
        const progress = progressData[courseId] || {};
        
        if (!course) return null;
        
        const totalVideos = course.videos ? course.videos.length : 0;
        const completedVideos = progress.completedVideos ? progress.completedVideos.length : 0;
        const percentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        
        return {
            id: courseId,
            title: course.title,
            percentage: percentage,
            image: course.image
        };
    }).filter(course => course !== null);
    
    // Sort by progress percentage
    courseProgress.sort((a, b) => b.percentage - a.percentage);
    
    // Take top 5 courses
    const topCourses = courseProgress.slice(0, 5);
    
    // Clear existing content
    topCoursesElement.innerHTML = '';
    
    // Render top courses
    topCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-300';
        
        courseElement.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="w-12 h-12 rounded-lg object-cover mr-4">
            <div class="flex-1">
                <h3 class="font-medium text-gray-800">${course.title}</h3>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${course.percentage}%"></div>
                </div>
            </div>
            <span class="text-gray-600 font-medium">${course.percentage}%</span>
        `;
        
        topCoursesElement.appendChild(courseElement);
    });
}