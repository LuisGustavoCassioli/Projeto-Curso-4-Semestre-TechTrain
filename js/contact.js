// Contact page JavaScript for TECHTRAIN

// DOM Elements
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
});

// Function to handle form submission
function submitContactForm() {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Create message object
    const contactMessage = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Get existing messages from localStorage or initialize empty array
    let messages = JSON.parse(localStorage.getItem('techtrain_messages')) || [];
    
    // Add new message
    messages.push(contactMessage);
    
    // Save to localStorage
    localStorage.setItem('techtrain_messages', JSON.stringify(messages));
    
    // Show success message
    showMessage('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Function to show message
function showMessage(text, type) {
    if (!formMessage) return;
    
    // Set message content and style
    formMessage.textContent = text;
    formMessage.className = 'p-4 rounded-lg ' + 
        (type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200');
    
    // Show message
    formMessage.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}