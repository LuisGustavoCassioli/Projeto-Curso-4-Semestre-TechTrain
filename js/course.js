// Course detail page JavaScript for TECHTRAIN

// Sample course data (in a real app, this would come from an API)
const courseData = {
    1: {
        id: 1,
        title: "Complete JavaScript Course",
        description: "Master JavaScript from basics to advanced concepts including ES6, async programming, and more. This comprehensive course takes you from a complete beginner to an advanced JavaScript developer. You'll learn modern JavaScript features, DOM manipulation, asynchronous programming, and much more.",
        duration: "25 hours",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.8,
        reviews: 1240,
        category: "programming",
        level: "Beginner",
        learningPoints: [
            "Master JavaScript fundamentals and advanced concepts",
            "Build real-world projects with modern JavaScript",
            "Understand asynchronous programming with Promises and async/await",
            "Work with APIs and AJAX to create dynamic web applications",
            "Learn ES6+ features like arrow functions, destructuring, and modules"
        ]
    },
    2: {
        id: 2,
        title: "Python for Data Science",
        description: "Learn Python programming for data analysis, visualization, and machine learning. This course covers NumPy, Pandas, Matplotlib, and Scikit-learn libraries. You'll work with real datasets and build predictive models.",
        duration: "30 hours",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        reviews: 980,
        category: "data-science",
        level: "Intermediate",
        learningPoints: [
            "Master Python programming for data science",
            "Manipulate and analyze data with Pandas",
            "Create stunning visualizations with Matplotlib and Seaborn",
            "Build machine learning models with Scikit-learn",
            "Work with real-world datasets and solve business problems"
        ]
    },
    3: {
        id: 3,
        title: "Cybersecurity Fundamentals",
        description: "Protect networks and systems from cyber threats with this comprehensive course. Learn about network security, encryption, firewalls, and intrusion detection systems. Gain hands-on experience with security tools and techniques.",
        duration: "20 hours",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1555066933-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.7,
        reviews: 760,
        category: "cybersecurity",
        level: "Beginner",
        learningPoints: [
            "Understand fundamental cybersecurity concepts and principles",
            "Identify and mitigate common security threats",
            "Implement network security measures and firewalls",
            "Use encryption techniques to protect sensitive data",
            "Conduct security assessments and vulnerability scanning"
        ]
    },
    4: {
        id: 4,
        title: "UI/UX Design Masterclass",
        description: "Learn design principles, user research, and prototyping to create beautiful interfaces. This course covers the entire design process from ideation to implementation. You'll master industry-standard tools like Figma and create a professional design portfolio.",
        duration: "22 hours",
        price: 84.99,
        image: "https://images.unsplash.com/photo-1555066934-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        reviews: 650,
        category: "design",
        level: "Intermediate",
        learningPoints: [
            "Master UI/UX design principles and best practices",
            "Conduct user research and create user personas",
            "Design wireframes and interactive prototypes",
            "Create visually appealing interfaces with Figma",
            "Build a professional design portfolio"
        ]
    },
    5: {
        id: 5,
        title: "React Frontend Development",
        description: "Build modern web applications with React, Redux, and related libraries. Learn component-based architecture, state management, and routing. Create responsive, performant applications with modern React features.",
        duration: "28 hours",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.8,
        reviews: 1120,
        category: "programming",
        level: "Intermediate",
        learningPoints: [
            "Build modern web applications with React",
            "Manage application state with Redux and Context API",
            "Implement routing with React Router",
            "Create reusable and scalable components",
            "Optimize performance and handle side effects"
        ]
    }
};

// DOM Elements
const courseImage = document.getElementById('course-image');
const courseTitle = document.getElementById('course-title');
const courseRating = document.getElementById('course-rating');
const courseReviews = document.getElementById('course-reviews');
const courseDuration = document.getElementById('course-duration');
const courseLevel = document.getElementById('course-level');
const courseDescription = document.getElementById('course-description');
const courseLearningPoints = document.getElementById('course-learning-points');
const coursePrice = document.getElementById('course-price');
const enrollBtn = document.getElementById('enroll-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (courseId && courseData[courseId]) {
        loadCourseDetails(courseData[courseId]);
    } else {
        // Redirect to courses page if invalid ID
        window.location.href = 'courses.html';
    }
    
    // Add to cart button event listener
    if (enrollBtn) {
        enrollBtn.addEventListener('click', function() {
            enrollInCourse(courseId);
        });
    }
});

// Function to load course details
function loadCourseDetails(course) {
    if (courseImage) courseImage.src = course.image;
    if (courseTitle) courseTitle.textContent = course.title;
    if (courseDuration) courseDuration.textContent = course.duration;
    if (courseLevel) courseLevel.textContent = course.level;
    if (courseDescription) courseDescription.textContent = course.description;
    if (coursePrice) coursePrice.textContent = `$${course.price}`;
    if (courseReviews) courseReviews.textContent = `${course.reviews} reviews`;
    
    // Generate star rating
    if (courseRating) {
        courseRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= Math.floor(course.rating)) {
                star.className = 'fas fa-star';
            } else if (i === Math.ceil(course.rating) && course.rating % 1 !== 0) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            courseRating.appendChild(star);
        }
    }
    
    // Generate learning points
    if (courseLearningPoints) {
        courseLearningPoints.innerHTML = '';
        course.learningPoints.forEach(point => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>${point}</span>
            `;
            courseLearningPoints.appendChild(li);
        });
    }
}

// Function to enroll in course
function enrollInCourse(courseId) {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('techtrain_user'));
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Redirect to learning page
    window.location.href = `learning.html?courseId=${courseId}`;
}

// Function to show notification
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-20 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'info' ? 'bg-blue-500 text-white' : 
        'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}