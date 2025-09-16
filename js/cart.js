// Shopping cart functionality for TECHTRAIN

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

// Function to load cart items
function loadCartItems() {
    // Get cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
    
    if (!cartItemsContainer) return;
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                <p class="text-gray-500 mb-6">Add courses to your cart to get started</p>
                <a href="courses.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300">
                    Browse Courses
                </a>
            </div>
        `;
        updateCartTotals(0);
        
        // Disable checkout button if it exists
        if (checkoutBtn) {
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            checkoutBtn.href = '#';
        }
        return;
    }
    
    // Enable checkout button if it exists
    if (checkoutBtn) {
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        checkoutBtn.href = 'checkout.html';
    }
    
    let subtotal = 0;
    
    // Add each item to the cart
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center justify-between py-4 border-b border-gray-200 cart-item';
        
        itemElement.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg mr-4">
                <div>
                    <h3 class="font-medium text-gray-800">${item.title}</h3>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center">
                <button class="text-red-500 hover:text-red-700 remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
        subtotal += item.price;
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            removeItemFromCart(courseId);
        });
    });
    
    updateCartTotals(subtotal);
    
    // Update cart count
    updateCartCount();
}

// Function to update cart totals
function updateCartTotals(subtotal) {
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    if (cartSubtotal) {
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (cartTotal) {
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Function to remove item from cart
function removeItemFromCart(courseId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
    
    // Find the item to remove
    const itemIndex = cart.findIndex(item => item.id == courseId);
    const removedItem = cart[itemIndex];
    
    // Filter out the item to remove
    cart = cart.filter(item => item.id != courseId);
    
    // Save updated cart to localStorage
    localStorage.setItem('techtrain_cart', JSON.stringify(cart));
    
    // Reload cart items
    loadCartItems();
    
    // Show notification
    if (removedItem) {
        showNotification(`"${removedItem.title}" removed from cart`, 'info');
    } else {
        showNotification('Item removed from cart', 'info');
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
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}