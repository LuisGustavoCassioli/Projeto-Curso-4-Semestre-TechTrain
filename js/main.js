// Main JavaScript file for TECHTRAIN website

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Set current year in copyright
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = `© ${currentYear} TECHTRAIN. All rights reserved.`;
    }
    
    // Load featured courses on homepage
    if (document.getElementById('featured-courses')) {
        loadFeaturedCourses();
    }
    
    // Update cart count
    updateCartCount();
});

// Function to load featured courses
function loadFeaturedCourses() {
    // In a real application, this would fetch from an API
    // For this demo, we'll use mock data
    const featuredCourses = [
        {
            id: 1,
            title: "Complete JavaScript Course",
            description: "Master JavaScript from basics to advanced concepts including ES6, async programming, and more.",
            duration: "25 hours",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            rating: 4.8,
            reviews: 1240
        },
        {
            id: 2,
            title: "Python for Data Science",
            description: "Learn Python programming for data analysis, visualization, and machine learning.",
            duration: "30 hours",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            rating: 4.9,
            reviews: 980
        },
        {
            id: 3,
            title: "Cybersecurity Fundamentals",
            description: "Protect networks and systems from cyber threats with this comprehensive course.",
            duration: "20 hours",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1555066933-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            rating: 4.7,
            reviews: 760
        }
    ];
    
    const coursesContainer = document.getElementById('featured-courses');
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        
        featuredCourses.forEach(course => {
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
                <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover course-image">
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
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300" onclick="addToCart(${course.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            coursesContainer.appendChild(courseCard);
        });
    }
}

// Function to generate star ratings
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        } else {
            stars += '<i class="far fa-star text-yellow-400"></i>';
        }
    }
    return stars;
}

// Function to add course to cart
function addToCart(courseId) {
    // Get existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
    
    // Sample course data (in a real app, this would come from an API)
    const courses = {
        1: {
            id: 1,
            title: "Complete JavaScript Course",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        2: {
            id: 2,
            title: "Python for Data Science",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        3: {
            id: 3,
            title: "Cybersecurity Fundamentals",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1555066933-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    };
    
    const course = courses[courseId];
    
    // Check if course is already in cart
    const existingItem = cart.find(item => item.id == courseId);
    
    if (!existingItem && course) {
        // Add course to cart
        cart.push({
            id: course.id,
            title: course.title,
            price: course.price,
            image: course.image
        });
        
        // Save updated cart to localStorage
        localStorage.setItem('techtrain_cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showNotification('Course added to cart successfully!', 'success');
    } else if (existingItem) {
        // Show info message
        showNotification('Course is already in your cart', 'info');
    }
}

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
        cartCountElement.textContent = cart.length;
    }
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