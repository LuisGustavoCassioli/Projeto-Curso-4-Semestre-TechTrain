// Bookmarks page JavaScript for TECHTRAIN

// DOM Elements
const bookmarksContainer = document.getElementById('bookmarks-container');
const emptyBookmarks = document.getElementById('empty-bookmarks');
const searchBookmarks = document.getElementById('search-bookmarks');
const logoutBtn = document.getElementById('logout-btn');

// Sample course data (in a real app, this would come from an API)
let coursesData = [];

// Fuse.js search instance
let fuse;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Add event listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (searchBookmarks) {
        searchBookmarks.addEventListener('input', filterBookmarks);
    }
    
    // Load course data
    loadCourseData();
    
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
    fetch('data/cursos.json')
        .then(response => response.json())
        .then(courses => {
            coursesData = courses;
            
            // Initialize Fuse.js search
            const options = {
                keys: ['title', 'description', 'category'],
                threshold: 0.3
            };
            fuse = new Fuse(coursesData, options);
            
            // Load bookmarks
            loadBookmarks();
        })
        .catch(error => {
            console.error('Error loading course data:', error);
        });
}

// Function to load bookmarks
function loadBookmarks() {
    if (!bookmarksContainer) return;
    
    // Get bookmarks from localStorage
    const bookmarkIds = JSON.parse(localStorage.getItem('techtrain_bookmarks')) || [];
    
    // Filter courses to only show bookmarked ones
    const bookmarkedCourses = coursesData.filter(course => bookmarkIds.includes(course.id));
    
    bookmarksContainer.innerHTML = '';
    
    if (bookmarkedCourses.length === 0) {
        // Show empty state
        if (emptyBookmarks) {
            emptyBookmarks.classList.remove('hidden');
        }
        return;
    } else {
        // Hide empty state
        if (emptyBookmarks) {
            emptyBookmarks.classList.add('hidden');
        }
    }
    
    bookmarkedCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'bg-white rounded-xl shadow-md overflow-hidden course-card';
        
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
                        data-course-id="${course.id}" data-bookmarked="true">
                    <i class="fas fa-bookmark text-blue-600"></i>
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
                        <a href="course.html?id=${course.id}" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300 mr-2">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        bookmarksContainer.appendChild(courseCard);
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
    
    // Get bookmarks from localStorage
    let bookmarks = JSON.parse(localStorage.getItem('techtrain_bookmarks')) || [];
    
    // Remove from bookmarks
    bookmarks = bookmarks.filter(id => id !== courseId);
    button.dataset.bookmarked = 'false';
    
    // Save bookmarks to localStorage
    localStorage.setItem('techtrain_bookmarks', JSON.stringify(bookmarks));
    
    // Reload bookmarks
    loadBookmarks();
}

// Function to filter bookmarks
function filterBookmarks() {
    const searchTerm = searchBookmarks ? searchBookmarks.value.toLowerCase() : '';
    
    // Get bookmarks from localStorage
    const bookmarkIds = JSON.parse(localStorage.getItem('techtrain_bookmarks')) || [];
    
    let filteredCourses = coursesData.filter(course => bookmarkIds.includes(course.id));
    
    // Apply search filter using Fuse.js if there's a search term
    if (searchTerm) {
        const fuseResults = fuse.search(searchTerm);
        filteredCourses = fuseResults.map(result => result.item).filter(course => bookmarkIds.includes(course.id));
    }
    
    // Update display
    updateBookmarksDisplay(filteredCourses);
}

// Function to update bookmarks display
function updateBookmarksDisplay(courses) {
    if (!bookmarksContainer) return;
    
    bookmarksContainer.innerHTML = '';
    
    if (courses.length === 0) {
        bookmarksContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No bookmarks found</h3>
                <p class="text-gray-500">Try adjusting your search</p>
            </div>
        `;
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'bg-white rounded-xl shadow-md overflow-hidden course-card';
        
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
                        data-course-id="${course.id}" data-bookmarked="true">
                    <i class="fas fa-bookmark text-blue-600"></i>
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
                        <a href="course.html?id=${course.id}" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300 mr-2">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        bookmarksContainer.appendChild(courseCard);
    });
    
    // Add event listeners to bookmark buttons
    document.querySelectorAll('.bookmark-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(this);
        });
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