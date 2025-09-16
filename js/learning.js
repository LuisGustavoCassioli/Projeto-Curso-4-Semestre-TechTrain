// Learning page JavaScript for TECHTRAIN

// DOM Elements
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');
const courseTitle = document.getElementById('course-title');
const courseProgress = document.getElementById('course-progress');
const progressText = document.getElementById('progress-text');
const courseVideos = document.getElementById('course-videos');
const prevVideoBtn = document.getElementById('prev-video-btn');
const nextVideoBtn = document.getElementById('next-video-btn');
const takeTestBtn = document.getElementById('take-test-btn');
const certificateBtn = document.getElementById('certificate-btn');
const testModal = document.getElementById('test-modal');
const testTitle = document.getElementById('test-title');
const testForm = document.getElementById('test-form');
const testQuestions = document.getElementById('test-questions');
const closeTestBtn = document.getElementById('close-test-btn');
const certificateModal = document.getElementById('certificate-modal');
const studentNameCert = document.getElementById('student-name-cert');
const courseNameCert = document.getElementById('course-name-cert');
const testScoreCert = document.getElementById('test-score-cert');
const completionDate = document.getElementById('completion-date');
const closeCertificateBtn = document.getElementById('close-certificate-btn');
const downloadCertificateBtn = document.getElementById('download-certificate-btn');
const logoutBtn = document.getElementById('logout-btn');

// Global variables
let currentCourse = null;
let currentVideoIndex = 0;
let courseProgressData = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Load course data
    loadCourseData();
    
    // Set up event listeners
    if (prevVideoBtn) prevVideoBtn.addEventListener('click', playPreviousVideo);
    if (nextVideoBtn) nextVideoBtn.addEventListener('click', playNextVideo);
    if (takeTestBtn) takeTestBtn.addEventListener('click', openTestModal);
    if (certificateBtn) certificateBtn.addEventListener('click', openCertificateModal);
    if (closeTestBtn) closeTestBtn.addEventListener('click', closeTestModal);
    if (closeCertificateBtn) closeCertificateBtn.addEventListener('click', closeCertificateModal);
    if (downloadCertificateBtn) downloadCertificateBtn.addEventListener('click', downloadCertificate);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (testForm) testForm.addEventListener('submit', submitTest);
    
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

// Function to load course data
function loadCourseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const videoId = urlParams.get('videoId');
    
    if (!courseId) {
        // Redirect to courses page if no course ID
        window.location.href = 'courses.html';
        return;
    }
    
    // Load course data from JSON file
    fetch('data/cursos.json')
        .then(response => response.json())
        .then(courses => {
            currentCourse = courses.find(course => course.id == courseId);
            
            if (!currentCourse) {
                // Redirect to courses page if invalid course ID
                window.location.href = 'courses.html';
                return;
            }
            
            // Load course progress data
            loadCourseProgressData();
            
            // Set course title
            if (courseTitle) courseTitle.textContent = currentCourse.title;
            
            // Load course videos
            loadCourseVideos();
            
            // Play initial video
            if (videoId) {
                const videoIndex = currentCourse.videos.findIndex(video => video.id == videoId);
                if (videoIndex !== -1) {
                    currentVideoIndex = videoIndex;
                }
            }
            
            playVideo(currentVideoIndex);
            
            // Update progress
            updateProgress();
        })
        .catch(error => {
            console.error('Error loading course data:', error);
        });
}

// Function to load course progress data
function loadCourseProgressData() {
    const progressData = localStorage.getItem('techtrain_course_progress');
    courseProgressData = progressData ? JSON.parse(progressData) : {};
}

// Function to save course progress data
function saveCourseProgressData() {
    localStorage.setItem('techtrain_course_progress', JSON.stringify(courseProgressData));
}

// Function to load course videos
function loadCourseVideos() {
    if (!courseVideos || !currentCourse) return;
    
    courseVideos.innerHTML = '';
    
    currentCourse.videos.forEach((video, index) => {
        const videoElement = document.createElement('div');
        videoElement.className = `p-3 rounded-lg cursor-pointer transition duration-300 ${
            index === currentVideoIndex ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
        }`;
        
        // Check if video is completed
        const isCompleted = courseProgressData[currentCourse.id] && 
                           courseProgressData[currentCourse.id].completedVideos && 
                           courseProgressData[currentCourse.id].completedVideos.includes(video.id);
        
        videoElement.innerHTML = `
            <div class="flex items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }">
                    ${isCompleted ? '<i class="fas fa-check"></i>' : (index + 1)}
                </div>
                <div class="flex-1">
                    <h4 class="font-medium">${video.title}</h4>
                    <p class="text-sm text-gray-600">${video.duration}</p>
                </div>
                ${isCompleted ? '<i class="fas fa-check-circle text-green-500"></i>' : ''}
            </div>
        `;
        
        videoElement.addEventListener('click', () => {
            playVideo(index);
        });
        
        courseVideos.appendChild(videoElement);
    });
}

// Function to play a video
function playVideo(index) {
    if (!currentCourse || !currentCourse.videos[index]) return;
    
    currentVideoIndex = index;
    const video = currentCourse.videos[index];
    
    // Update video player
    if (videoPlayer) {
        videoPlayer.src = video.url;
    }
    
    // Update video title and description
    if (videoTitle) videoTitle.textContent = video.title;
    if (videoDescription) videoDescription.textContent = `Video ${index + 1} of ${currentCourse.videos.length}`;
    
    // Update active video in sidebar
    loadCourseVideos();
    
    // Mark video as completed
    markVideoAsCompleted(video.id);
    
    // Update progress
    updateProgress();
    
    // Update URL without reloading the page
    const url = new URL(window.location);
    url.searchParams.set('videoId', video.id);
    window.history.replaceState({}, '', url);
}

// Function to mark video as completed
function markVideoAsCompleted(videoId) {
    if (!currentCourse) return;
    
    // Initialize course progress data if not exists
    if (!courseProgressData[currentCourse.id]) {
        courseProgressData[currentCourse.id] = {
            completedVideos: [],
            testScore: null,
            completedDate: null
        };
    }
    
    // Add video to completed videos if not already there
    if (!courseProgressData[currentCourse.id].completedVideos.includes(videoId)) {
        courseProgressData[currentCourse.id].completedVideos.push(videoId);
        saveCourseProgressData();
    }
}

// Function to update progress
function updateProgress() {
    if (!currentCourse) return;
    
    const totalVideos = currentCourse.videos.length;
    const completedVideos = courseProgressData[currentCourse.id] ? 
                           courseProgressData[currentCourse.id].completedVideos.length : 0;
    
    const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    
    if (courseProgress) courseProgress.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `${progressPercent}%`;
}

// Function to play previous video
function playPreviousVideo() {
    if (currentVideoIndex > 0) {
        playVideo(currentVideoIndex - 1);
    }
}

// Function to play next video
function playNextVideo() {
    if (currentVideoIndex < currentCourse.videos.length - 1) {
        playVideo(currentVideoIndex + 1);
    }
}

// Function to open test modal
function openTestModal() {
    if (!currentCourse || !testModal || !testTitle || !testQuestions) return;
    
    // Set test title
    if (testTitle) testTitle.textContent = currentCourse.test.title;
    
    // Generate test questions
    testQuestions.innerHTML = '';
    
    currentCourse.test.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'mb-6';
        
        let optionsHtml = '';
        question.options.forEach((option, optionIndex) => {
            optionsHtml += `
                <div class="flex items-center mb-2">
                    <input type="radio" id="q${question.id}-o${optionIndex}" name="q${question.id}" value="${optionIndex}" class="mr-2">
                    <label for="q${question.id}-o${optionIndex}" class="text-gray-700">${option}</label>
                </div>
            `;
        });
        
        questionElement.innerHTML = `
            <h3 class="font-semibold text-lg mb-3">${index + 1}. ${question.question}</h3>
            ${optionsHtml}
        `;
        
        testQuestions.appendChild(questionElement);
    });
    
    // Show modal
    if (testModal) testModal.classList.remove('hidden');
}

// Function to close test modal
function closeTestModal() {
    if (testModal) testModal.classList.add('hidden');
}

// Function to submit test
function submitTest(e) {
    e.preventDefault();
    
    if (!currentCourse || !testForm) return;
    
    let score = 0;
    const totalQuestions = currentCourse.test.questions.length;
    
    // Check answers
    currentCourse.test.questions.forEach(question => {
        const selectedOption = testForm.querySelector(`input[name="q${question.id}"]:checked`);
        
        if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
            score++;
        }
    });
    
    // Calculate percentage
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Save test score
    if (!courseProgressData[currentCourse.id]) {
        courseProgressData[currentCourse.id] = {
            completedVideos: [],
            testScore: null,
            completedDate: null
        };
    }
    
    courseProgressData[currentCourse.id].testScore = percentage;
    
    // If score is 70% or higher, mark course as completed
    if (percentage >= 70) {
        courseProgressData[currentCourse.id].completedDate = new Date().toISOString();
    }
    
    saveCourseProgressData();
    
    // Show result
    alert(`You scored ${percentage}% on the test! ${percentage >= 70 ? 'Congratulations, you passed!' : 'You need to score at least 70% to pass.'}`);
    
    // Close modal
    closeTestModal();
    
    // Update UI
    updateProgress();
}

// Function to open certificate modal
function openCertificateModal() {
    if (!currentCourse || !certificateModal || !studentNameCert || !courseNameCert || !testScoreCert || !completionDate) return;
    
    // Check if course is completed
    const courseProgress = courseProgressData[currentCourse.id];
    if (!courseProgress || !courseProgress.completedDate) {
        alert('You need to complete all videos and pass the test to receive a certificate.');
        return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    
    // Set certificate data
    if (studentNameCert) studentNameCert.textContent = currentUser.name;
    if (courseNameCert) courseNameCert.textContent = currentCourse.title;
    if (testScoreCert) testScoreCert.textContent = `${courseProgress.testScore}%`;
    if (completionDate) completionDate.textContent = new Date(courseProgress.completedDate).toLocaleDateString();
    
    // Show modal
    if (certificateModal) certificateModal.classList.remove('hidden');
}

// Function to close certificate modal
function closeCertificateModal() {
    if (certificateModal) certificateModal.classList.add('hidden');
}

// Function to download certificate
function downloadCertificate() {
    alert('In a real application, this would download a PDF certificate. For this demo, we\'ll just show an alert.');
}

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
        cartCountElement.textContent = cart.length;
    }
}