// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const orderForm = document.getElementById('orderForm');
const currentYearElement = document.getElementById('currentYear');
const isReservationCheckbox = document.getElementById('isReservation');

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Set default time to next hour
const timeInput = document.getElementById('time');
const nextHour = new Date();
nextHour.setHours(nextHour.getHours() + 1);
const hours = nextHour.getHours().toString().padStart(2, '0');
const minutes = nextHour.getMinutes().toString().padStart(2, '0');
timeInput.value = `${hours}:${minutes}`;

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

// Form Validation and SMS Redirection
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    const order = document.getElementById('order').value.trim();
    const isReservation = document.getElementById('isReservation').checked;
    
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
    
    // Validate date
    if (!date) {
        showError('dateError', 'Please select a date');
        isValid = false;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('dateError', 'Date cannot be in the past');
            isValid = false;
        }
    }
    
    // Validate time
    if (!time) {
        showError('timeError', 'Please select a time');
        isValid = false;
    }
    
    // Validate guests
    if (!guests) {
        showError('guestsError', 'Please select number of guests');
        isValid = false;
    } else if (parseInt(guests) < 1) {
        showError('guestsError', 'Number of guests must be at least 1');
        isValid = false;
    }
    
    // Validate order details
    if (!order) {
        showError('orderError', 'Please enter your order details or reservation notes');
        isValid = false;
    } else if (order.length < 10) {
        showError('orderError', 'Please provide more details');
        isValid = false;
    }
    
    // If form is valid, redirect to SMS
    if (isValid) {
        redirectToSMS(name, cleanPhone, date, time, guests, order, isReservation);
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
    if (inputElement) {
        inputElement.style.borderColor = '#ff4757';
        inputElement.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.2)';
    }
}

// Helper function to clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    // Reset input styles
    const inputElements = document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select');
    inputElements.forEach(element => {
        element.style.borderColor = '#ddd';
        element.style.boxShadow = 'none';
    });
}

// Function to format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to format time to readable format
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

// Function to redirect to SMS with pre-filled message
function redirectToSMS(name, phone, date, time, guests, order, isReservation) {
    // The phone number for SMS
    const smsNumber = '8169085572';
    
    // Format date and time
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);
    
    // Construct the message based on whether it's a reservation or order
    let messageType = isReservation ? 'Table Reservation' : 'Food Order';
    
    const message = `Hello Foodie Restaurant!%0A%0A*${messageType} Request*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Date:* ${encodeURIComponent(formattedDate)}%0A*Time:* ${encodeURIComponent(formattedTime)}%0A*Guests:* ${encodeURIComponent(guests)} ${guests === '1' ? 'person' : 'people'}%0A*Details:* ${encodeURIComponent(order)}%0A%0APlease confirm my ${isReservation ? 'reservation' : 'order'}.`;
    
    // Create the SMS URL
    // Using sms: protocol which works on most mobile devices
    const smsURL = `sms:${smsNumber}?body=${message}`;
    
    // Show a confirmation message to the user
    showSubmissionMessage(isReservation);
    
    // Redirect to SMS app after a short delay
    setTimeout(() => {
        // For iOS devices, we need a different approach
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            // iOS requires a slightly different approach
            window.location.href = smsURL;
        } else {
            // For Android and other devices
            window.open(smsURL, '_blank');
        }
        
        // Reset the form after successful submission
        orderForm.reset();
        
        // Reset date to today and time to next hour
        dateInput.value = today;
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1);
        const hours = nextHour.getHours().toString().padStart(2, '0');
        const minutes = nextHour.getMinutes().toString().padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
        
        // Uncheck the reservation checkbox
        isReservationCheckbox.checked = false;
        
        // Reset the textarea placeholder
        const orderTextarea = document.getElementById('order');
        orderTextarea.placeholder = 'Please describe your order in detail, including items, quantities, and any special requests or dietary restrictions';
    }, 1500);
}

// Function to show a submission confirmation message
function showSubmissionMessage(isReservation) {
    const messageType = isReservation ? 'reservation' : 'order';
    
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #34a853;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            animation: slideIn 0.5s ease;
        ">
            <i class="fas fa-sms" style="font-size: 1.5rem; margin-right: 10px;"></i>
            <div>
                <strong>Redirecting to SMS...</strong>
                <p style="margin: 5px 0 0; font-size: 0.9rem;">Your ${messageType} details are pre-filled. Review before sending.</p>
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
document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select').forEach(input => {
    input.addEventListener('input', function() {
        const errorId = this.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement && errorElement.textContent) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        }
    });
});

// Add change event listener for the reservation checkbox
isReservationCheckbox.addEventListener('change', function() {
    const orderTextarea = document.getElementById('order');
    const orderLabel = document.querySelector('label[for="order"]');
    
    if (this.checked) {
        orderLabel.textContent = 'Reservation Notes / Special Requests *';
        orderTextarea.placeholder = 'Please provide any special requests, occasion details, or notes for your reservation';
    } else {
        orderLabel.textContent = 'Order Details / Message *';
        orderTextarea.placeholder = 'Please describe your order in detail, including items, quantities, and any special requests or dietary restrictions';
    }
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

// Update the footer text to reflect SMS instead of WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const portfolioNotice = document.querySelector('.portfolio-notice');
    if (portfolioNotice) {
        portfolioNotice.textContent = "Project created for portfolio demonstration purposes. Orders/reservations are redirected to SMS for manual confirmation.";
    }
});
