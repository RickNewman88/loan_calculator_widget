// Loan Calculator - Widget JavaScript
// Author: Your Name
// Date: 2024

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM element references
    const loanForm = document.getElementById('loanForm');
    const loanAmount = document.getElementById('loanAmount');
    const subsidyPercent = document.getElementById('subsidyPercent');
    const downpayment = document.getElementById('downpayment');
    const downpaymentSlider = document.getElementById('downpaymentSlider');
    const loanDuration = document.getElementById('loanDuration');
    const loanDurationSlider = document.getElementById('loanDurationSlider');
    const contactBtn = document.getElementById('contactBtn');
    
    // Popup elements
    const contactPopup = document.getElementById('contactPopup');
    const popupEmail = document.getElementById('popupEmail');
    const popupPhone = document.getElementById('popupPhone');
    const closePopup = document.getElementById('closePopup');
    const sendBtn = document.getElementById('sendBtn');
    
    // Results elements
    const financedAmount = document.getElementById('financedAmount');
    const subsidyAmount = document.getElementById('subsidyAmount');
    const monthlyPayment = document.getElementById('monthlyPayment');
    
    // Error elements
    const popupEmailError = document.getElementById('popupEmailError');
    const popupPhoneError = document.getElementById('popupPhoneError');
    
    // Constants
    const ANNUAL_INTEREST_RATE = 5.5; // 5.5% annual interest rate
    
    // Function to format numbers as EUR currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to validate phone number (international format)
    function isValidPhone(phone) {
        // Remove all non-digit characters except leading +
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        
        // Check if it starts with + and has 10-15 digits total
        if (cleanPhone.startsWith('+')) {
            return cleanPhone.length >= 11 && cleanPhone.length <= 16;
        }
        
        // Check if it's just digits (10-15 digits)
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }
    
    // Function to calculate monthly payment using French amortization method
    function calculateMonthlyPayment(principal, annualRate, years) {
        if (principal <= 0 || years <= 0) return 0;
        
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        
        if (monthlyRate === 0) {
            return principal / numberOfPayments;
        }
        
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment;
    }
    
    // Function to calculate loan results
    function calculateLoanResults() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const subsidyPercent = parseFloat(document.getElementById('subsidyPercent').value) || 0;
        const downpayment = parseFloat(document.getElementById('downpayment').value) || 0;
        const loanDuration = parseFloat(document.getElementById('loanDuration').value) || 1;

        // Calculate subsidy amount
        const subsidyAmount = loanAmount * (subsidyPercent / 100);
        
        // Calculate principal financed (loan amount - subsidy - downpayment, minimum 0)
        const principalFinanced = Math.max(loanAmount - subsidyAmount - downpayment, 0);
        
        // Calculate monthly payment using French amortization method
        const monthlyPayment = calculateMonthlyPayment(principalFinanced, ANNUAL_INTEREST_RATE, loanDuration);

        // Update results display
        document.getElementById('financedAmount').textContent = formatCurrency(loanAmount);
        document.getElementById('subsidyAmount').textContent = formatCurrency(subsidyAmount);
        document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
        
        return {
            loanAmount,
            subsidyAmount,
            monthlyPayment
        };
    }
    
    // Function to validate the complete form
    function validateForm() {
        let isFormValid = true;
        
        // Clear all previous error messages
        popupEmailError.style.display = 'none';
        popupPhoneError.style.display = 'none';
        
        // Validate email
        if (!popupEmail.value.trim()) {
            popupEmailError.textContent = 'Email is required';
            popupEmailError.style.display = 'block';
            isFormValid = false;
        } else if (!isValidEmail(popupEmail.value)) {
            popupEmailError.textContent = 'Please enter a valid email address';
            popupEmailError.style.display = 'block';
            isFormValid = false;
        }
        
        // Validate phone
        if (!popupPhone.value.trim()) {
            popupPhoneError.textContent = 'Phone number is required';
            popupPhoneError.style.display = 'block';
            isFormValid = false;
        } else if (!isValidPhone(popupPhone.value)) {
            popupPhoneError.textContent = 'Please enter a valid phone number';
            popupPhoneError.style.display = 'block';
            isFormValid = false;
        }
        
        return isFormValid;
    }
    
    // Function to focus on first invalid field
    function focusFirstInvalidField() {
        if (!popupEmail.value.trim() || !isValidEmail(popupEmail.value)) {
            popupEmail.focus();
        } else if (!popupPhone.value.trim() || !isValidPhone(popupPhone.value)) {
            popupPhone.focus();
        }
    }
    
    // Function to show/hide email section
    function toggleEmailSection() {
        // This function is no longer needed as the contact form is always visible
    }

    // Function to show/hide contact popup
    function toggleContactPopup() {
        if (contactPopup.style.display === 'none') {
            contactPopup.style.display = 'block';
            // Focus on email field
            popupEmail.focus();
        } else {
            contactPopup.style.display = 'none';
        }
    }

    // Function to close popup
    function closeContactPopup() {
        contactPopup.style.display = 'none';
        // Reset form
        popupEmail.value = '';
        popupPhone.value = '';
        // Clear errors
        popupEmailError.style.display = 'none';
        popupPhoneError.style.display = 'none';
    }

    // Function to update button state based on form validation
    function updateButtonState() {
        if (contactPopup.style.display !== 'none') {
            const isEmailValid = popupEmail.value.trim() && isValidEmail(popupEmail.value);
            const isPhoneValid = popupPhone.value.trim() && isValidPhone(popupPhone.value);
            const isValid = isEmailValid && isPhoneValid;
            
            sendBtn.disabled = !isValid;
        }
    }
    
    // Event listeners for downpayment synchronization
    downpayment.addEventListener('input', function() {
        const value = parseFloat(this.value) || 0;
        const maxValue = parseFloat(loanAmount.value) || 0;
        
        // Validate range
        if (value > maxValue) {
            this.value = maxValue;
        } else if (value < 0) {
            this.value = 0;
        }
        
        // Sync with slider
        downpaymentSlider.value = this.value;
        
        // Recalculate results
        calculateLoanResults();
    });
    
    downpaymentSlider.addEventListener('input', function() {
        downpayment.value = this.value;
        calculateLoanResults();
    });
    
    // Event listeners for loan duration synchronization
    loanDuration.addEventListener('input', function() {
        const value = parseInt(this.value) || 1;
        
        // Validate range
        if (value > 20) {
            this.value = 20;
        } else if (value < 1) {
            this.value = 1;
        }
        
        // Sync with slider
        loanDurationSlider.value = this.value;
        
        // Recalculate results
        calculateLoanResults();
    });
    
    loanDurationSlider.addEventListener('input', function() {
        loanDuration.value = this.value;
        calculateLoanResults();
    });
    
    // Event listeners for other inputs
    loanAmount.addEventListener('input', function() {
        const value = parseFloat(this.value) || 0;
        
        // Validate maximum
        if (value > 60000) {
            this.value = 60000;
        }
        
        // Update downpayment slider max value
        downpaymentSlider.max = this.value;
        
        // Validate that downpayment doesn't exceed loan amount
        const currentDown = parseFloat(downpayment.value) || 0;
        if (currentDown > value) {
            downpayment.value = value;
            downpaymentSlider.value = value;
        }
        
        calculateLoanResults();
    });
    
    subsidyPercent.addEventListener('input', function() {
        const value = parseFloat(this.value) || 0;
        
        // Validate range
        if (value > 100) {
            this.value = 100;
        } else if (value < 0) {
            this.value = 0;
        }
        
        calculateLoanResults();
    });

    // Event listeners for form validation
    popupEmail.addEventListener('input', updateButtonState);
    popupPhone.addEventListener('input', updateButtonState);
    
    // Event listener for contact button
    contactBtn.addEventListener('click', function(e) {
        toggleContactPopup();
    });

    // Event listener for close popup button
    closePopup.addEventListener('click', closeContactPopup);

    // Event listener for send button
    sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            focusFirstInvalidField();
            return;
        }
        
        // Collect form data
        const formData = {
            loanAmount: parseFloat(loanAmount.value),
            subsidyPercent: parseFloat(subsidyPercent.value),
            downpayment: parseFloat(downpayment.value),
            loanDuration: parseInt(loanDuration.value),
            email: popupEmail.value,
            phone: popupPhone.value,
            // Calculated data
            financedAmount: parseFloat(financedAmount.textContent.replace(/[^\d]/g, '')),
            subsidyAmount: parseFloat(subsidyAmount.textContent.replace(/[^\d]/g, '')),
            monthlyPayment: parseFloat(monthlyPayment.textContent.replace(/[^\d]/g, ''))
        };
        
        // Here you can send the data to your backend
        console.log('Form data:', formData);
        
        // Show success message
        alert('Thank you! We have received your application. We will contact you soon by email and phone.');
        
        // Close popup and reset form
        closeContactPopup();
        
        // Restore default values
        loanAmount.value = 25000;
        subsidyPercent.value = 20;
        downpayment.value = 5000;
        downpaymentSlider.value = 5000;
        loanDuration.value = 1;
        loanDurationSlider.value = 1;
        
        // Recalculate results
        calculateLoanResults();
    });
    
    // Initialize
    function init() {
        // Set initial values for sliders
        downpaymentSlider.max = loanAmount.value;
        
        // Calculate initial results
        calculateLoanResults();
        
        // Set initial button state
        updateButtonState();
        
        // Focus on first field
        loanAmount.focus();
        
        console.log('Loan calculator widget initialized successfully');
    }
    
    // Run initialization
    init();
    
    // Function for communication with parent iframe (optional)
    function sendMessageToParent(data) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'LOAN_CALCULATOR_DATA',
                data: data
            }, '*');
        }
    }
    
    // Expose functions for external use
    window.loanCalculator = {
        calculateResults: calculateLoanResults,
        validateForm: validateForm,
        sendMessageToParent: sendMessageToParent,
        toggleContactPopup: toggleContactPopup,
        closeContactPopup: closeContactPopup
    };
    
});

