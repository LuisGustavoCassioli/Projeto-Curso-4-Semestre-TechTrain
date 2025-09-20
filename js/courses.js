// Courses page JavaScript for TECHTRAIN

// Sample course data (in a real app, this would come from an API)
let coursesData = [
    {
        id: 1,
        title: "Complete JavaScript Course",
        description: "Master JavaScript from basics to advanced concepts including ES6, async programming, and more.",
        duration: "25 hours",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.8,
        reviews: 1240,
        category: "programming",
        level: "Beginner"
    },
    {
        id: 2,
        title: "Python for Data Science",
        description: "Learn Python programming for data analysis, visualization, and machine learning.",
        duration: "30 hours",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        reviews: 980,
        category: "data-science",
        level: "Intermediate"
    },
    {
        id: 3,
        title: "Cybersecurity Fundamentals",
        description: "Protect networks and systems from cyber threats with this comprehensive course.",
        duration: "20 hours",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1555066933-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.7,
        reviews: 760,
        category: "cybersecurity",
        level: "Beginner"
    },
    {
        id: 4,
        title: "UI/UX Design Masterclass",
        description: "Learn design principles, user research, and prototyping to create beautiful interfaces.",
        duration: "22 hours",
        price: 84.99,
        image: "https://images.unsplash.com/photo-1555066934-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        reviews: 650,
        category: "design",
        level: "Intermediate"
    },
    {
        id: 5,
        title: "React Frontend Development",
        description: "Build modern web applications with React, Redux, and related libraries.",
        duration: "28 hours",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.8,
        reviews: 1120,
        category: "programming",
        level: "Intermediate"
    },
    {
        id: 6,
        title: "Machine Learning with Python",
        description: "Dive into machine learning algorithms and build predictive models with Python.",
        duration: "35 hours",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1555066936-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        reviews: 890,
        category: "data-science",
        level: "Advanced"
    }
];

// DOM Elements
const coursesContainer = document.getElementById('courses-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');

// Fuse.js search instance
let fuse;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Fuse.js search
    const options = {
        keys: ['title', 'description', 'category'],
        threshold: 0.3
    };
    fuse = new Fuse(coursesData, options);
    
    loadCourses(coursesData);
    
    // Add event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterCourses);
    }
});

// Function to load courses
function loadCourses(courses) {
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = '';
    
    if (courses.length === 0) {
        coursesContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
                <p class="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Get bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('techtrain_bookmarks')) || [];
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'bg-white rounded-xl shadow-md overflow-hidden course-card';
        
        // Check if course is bookmarked
        const isBookmarked = bookmarks.includes(course.id);
        
        // Generate star rating
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(course.rating)) {
                stars += '<i class="fas fa-star text-yellow-400"></i>';
            } else if (i === Math.ceil(course.rating) && course.rating % 1 !== 0) {
                stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
            } else {
                stars += '<i class="far fa-star text-yellow-400"></i>';
            }
        }
        
        courseCard.innerHTML = `
            <div class="relative">
                <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover course-image">
                <button class="bookmark-btn absolute top-2 right-2 w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center hover:bg-blue-100 transition-colors" 
                        data-course-id="${course.id}" data-bookmarked="${isBookmarked}">
                    <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark text-blue-600"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-800">${course.title}</h3>
                    <span class="text-lg font-bold text-blue-600">$${course.price}</span>
                </div>
                <div class="flex items-center mb-3">
                    <div class="flex text-yellow-400 mr-2">
                        ${stars}
                    </div>
                    <span class="text-gray-600 text-sm">(${course.reviews})</span>
                </div>
                <p class="text-gray-600 mb-4">${course.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500"><i class="far fa-clock mr-1"></i> ${course.duration}</span>
                    <div>
                        <a href="course.html?id=${course.id}" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300 mr-2" onclick="trackCategoryExploration('${course.category}')">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
    
    // Add event listeners to bookmark buttons
    document.querySelectorAll('.bookmark-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(this);
        });
    });
}

// Function to toggle bookmark
function toggleBookmark(button) {
    const courseId = parseInt(button.dataset.courseId);
    const isBookmarked = button.dataset.bookmarked === 'true';
    
    // Get bookmarks from localStorage
    let bookmarks = JSON.parse(localStorage.getItem('techtrain_bookmarks')) || [];
    
    if (isBookmarked) {
        // Remove from bookmarks
        bookmarks = bookmarks.filter(id => id !== courseId);
        button.dataset.bookmarked = 'false';
        button.innerHTML = '<i class="far fa-bookmark text-blue-600"></i>';
    } else {
        // Add to bookmarks
        bookmarks.push(courseId);
        button.dataset.bookmarked = 'true';
        button.innerHTML = '<i class="fas fa-bookmark text-blue-600"></i>';
    }
    
    // Save bookmarks to localStorage
    localStorage.setItem('techtrain_bookmarks', JSON.stringify(bookmarks));
}

// Function to filter courses
function filterCourses() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    const priceRange = priceFilter ? priceFilter.value : '';
    
    let filteredCourses = coursesData;
    
    // Apply search filter using Fuse.js if there's a search term
    if (searchTerm) {
        const fuseResults = fuse.search(searchTerm);
        filteredCourses = fuseResults.map(result => result.item);
    }
    
    // Apply category filter
    if (category) {
        filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    // Apply price filter
    if (priceRange) {
        filteredCourses = filteredCourses.filter(course => {
            switch (priceRange) {
                case '0-50':
                    return course.price <= 50;
                case '50-100':
                    return course.price > 50 && course.price <= 100;
                case '100+':
                    return course.price > 100;
                default:
                    return true;
            }
        });
    }
    
    loadCourses(filteredCourses);
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