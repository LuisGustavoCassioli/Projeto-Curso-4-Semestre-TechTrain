// Checkout page JavaScript for TECHTRAIN

// DOM Elements
const paymentForm = document.getElementById('payment-form');
const orderItems = document.getElementById('order-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const paymentMessage = document.getElementById('payment-message');
const cardNumberInput = document.getElementById('card-number');
const expiryDateInput = document.getElementById('expiry-date');
const cvvInput = document.getElementById('cvv');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Add event listener for form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Add input formatting
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', formatCvv);
    }
    
    // Update cart count
    updateCartCount();
});

// Function to format card number input
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
}

// Function to format expiry date input
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
}

// Function to format CVV input
function formatCvv(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
}

// Function to load cart items
function loadCartItems() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('techtrain_cart')) || [];
    
    // Clear order items container
    if (orderItems) {
        orderItems.innerHTML = '';
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (orderItems) {
            orderItems.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p class="text-gray-500 mb-6">Add some courses to your cart to continue</p>
                    <a href="courses.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300">
                        Browse Courses
                    </a>
                </div>
            `;
        }
        
        // Update totals
        updateTotals(0, 0, 0, 0);
        return;
    }
    
    // Display cart items
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = parseFloat(item.price);
        subtotal += itemTotal;
        
        if (orderItems) {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center justify-between py-4 border-b border-gray-200';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg mr-4">
                    <div>
                        <h3 class="font-medium text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 text-sm">Course</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-medium">$${itemTotal.toFixed(2)}</p>
                </div>
            `;
            orderItems.appendChild(itemElement);
        }
    });
    
    // Calculate tax (10%)
    const tax = subtotal * 0.10;
    
    // Calculate discount (5% for demo)
    const discount = subtotal * 0.05;
    
    // Calculate total
    const total = subtotal + tax - discount;
    
    // Update totals
    updateTotals(subtotal, tax, discount, total);
}

// Function to update totals
function updateTotals(subtotal, tax, discount, total) {
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (discountElement) discountElement.textContent = `-$${discount.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to process payment
function processPayment() {
    // Get form values
    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const billingAddress = document.getElementById('billing-address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zip-code').value.trim();
    
    // Simple validation
    if (!cardName || !cardNumber || !expiryDate || !cvv || !billingAddress || !city || !zipCode) {
        showPaymentMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Card number validation (simple)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
        showPaymentMessage('Please enter a valid 16-digit card number.', 'error');
        return;
    }
    
    // Expiry date validation (simple)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showPaymentMessage('Please enter a valid expiry date (MM/YY).', 'error');
        return;
    }
    
    // CVV validation (simple)
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        showPaymentMessage('Please enter a valid 3-digit CVV.', 'error');
        return;
    }
    
    // Simulate payment processing
    showPaymentMessage('Processing payment...', 'info', true); // true for loading state
    
    // Disable form during processing
    if (paymentForm) {
        const submitButton = paymentForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        }
    }
    
    // Simulate API call delay
    setTimeout(() => {
        // Simulate successful payment (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
            // Payment successful
            showPaymentMessage('Payment successful! Your courses have been purchased.', 'success');
            
            // Clear cart
            localStorage.removeItem('techtrain_cart');
            
            // Update cart count
            updateCartCount();
            
            // Redirect to student area after 3 seconds
            setTimeout(() => {
                window.location.href = 'student.html';
            }, 3000);
        } else {
            // Payment failed
            showPaymentMessage('Payment failed. Please check your card details and try again.', 'error', false);
            
            // Re-enable form
            if (paymentForm) {
                const submitButton = paymentForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Complete Purchase';
                }
            }
        }
    }, 2000);
}

// Function to show payment message
function showPaymentMessage(text, type, isLoading = false) {
    if (!paymentMessage) return;
    
    // Set message content and style
    if (isLoading) {
        paymentMessage.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                <span>${text}</span>
            </div>
        `;
    } else {
        paymentMessage.innerHTML = text;
    }
    
    paymentMessage.className = 'p-4 rounded-lg ' + 
        (type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 
         type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
         'bg-blue-100 text-blue-700 border border-blue-200');
    
    // Show message
    paymentMessage.classList.remove('hidden');
    
    // Hide message after 5 seconds (unless it's a success message or loading state)
    if (type !== 'success' && !isLoading) {
        setTimeout(() => {
            paymentMessage.classList.add('hidden');
        }, 5000);
    }
}