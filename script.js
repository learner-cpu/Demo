// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const orderForm = document.getElementById('orderForm');
const currentYearElement = document.getElementById('currentYear');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.querySelector('i').classList.toggle('fa-bars');
    navToggle.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').classList.remove('fa-times');
        navToggle.querySelector('i').classList.add('fa-bars');
    });
});

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Form Validation and WhatsApp Redirection
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const order = document.getElementById('order').value.trim();
    
    // Validation flags
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('nameError', 'Please enter your name');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    
    if (!phone) {
        showError('phoneError', 'Please enter your phone number');
        isValid = false;
    } else if (!phoneRegex.test(cleanPhone)) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate order details
    if (!order) {
        showError('orderError', 'Please enter your order details');
        isValid = false;
    } else if (order.length < 10) {
        showError('orderError', 'Please provide more details about your order');
        isValid = false;
    }
    
    // If form is valid, redirect to WhatsApp
    if (isValid) {
        redirectToWhatsApp(name, cleanPhone, order);
    }
});

// Helper function to show error messages
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Highlight the input field with error
    const inputId = elementId.replace('Error', '');
    const inputElement = document.getElementById(inputId);
    inputElement.style.borderColor = '#ff4757';
    inputElement.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.2)';
}

// Helper function to clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    // Reset input styles
    const inputElements = document.querySelectorAll('#orderForm input, #orderForm textarea');
    inputElements.forEach(element => {
        element.style.borderColor = '#ddd';
        element.style.boxShadow = 'none';
    });
}

// Function to redirect to WhatsApp with pre-filled message
function redirectToWhatsApp(name, phone, order) {
    // The phone number for WhatsApp (without country code if included)
    // The provided number is: 8169085572
    const whatsappNumber = '8169085572';
    
    // Construct the message with proper formatting
    const message = `Hello Foodie Restaurant!%0A%0A*Order Details*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Order Details:* ${encodeURIComponent(order)}%0A%0APlease confirm my order.`;
    
    // Create the WhatsApp URL with the wa.me link
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Show a confirmation message to the user
    showSubmissionMessage();
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset the form after successful submission
        orderForm.reset();
    }, 1500);
}

// Function to show a submission confirmation message
function showSubmissionMessage() {
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #25D366;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            animation: slideIn 0.5s ease;
        ">
            <i class="fab fa-whatsapp" style="font-size: 1.5rem; margin-right: 10px;"></i>
            <div>
                <strong>Redirecting to WhatsApp...</strong>
                <p style="margin: 5px 0 0; font-size: 0.9rem;">You'll be able to review before sending</p>
            </div>
        </div>
    `;
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Append message to body
    document.body.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.remove();
        style.remove();
    }, 3000);
}

// Add input event listeners to clear errors when user starts typing
document.querySelectorAll('#orderForm input, #orderForm textarea').forEach(input => {
    input.addEventListener('input', function() {
        const errorId = this.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement.textContent) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        }
    });
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});