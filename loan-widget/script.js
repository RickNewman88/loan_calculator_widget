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
    const email = document.getElementById('email');
    const consent = document.getElementById('consent');
    const contactBtn = document.getElementById('contactBtn');
    const emailSection = document.getElementById('emailSection');
    
    // Results elements
    const financedAmount = document.getElementById('financedAmount');
    const subsidyAmount = document.getElementById('subsidyAmount');
    const monthlyPayment = document.getElementById('monthlyPayment');
    
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
        const amount = parseFloat(loanAmount.value) || 0;
        const subsidy = parseFloat(subsidyPercent.value) || 0;
        const down = parseFloat(downpayment.value) || 0;
        const duration = parseFloat(loanDuration.value) || 12;
        
        // Calculate subsidy amount
        const subsidyEuro = (amount * subsidy) / 100;
        
        // Calculate principal financed (max of 0 and loan amount - subsidy - downpayment)
        const financed = Math.max(amount - subsidyEuro - down, 0);
        
        // Calculate monthly payment
        const monthly = calculateMonthlyPayment(financed, ANNUAL_INTEREST_RATE, duration);
        
        // Update results
        financedAmount.textContent = formatCurrency(financed);
        subsidyAmount.textContent = formatCurrency(subsidyEuro);
        monthlyPayment.textContent = formatCurrency(monthly);
        
        return {
            financed,
            subsidyEuro,
            monthly
        };
    }
    
    // Function to validate the complete form
    function validateForm() {
        const isEmailValid = isValidEmail(email.value);
        const isConsentChecked = consent.checked;
        const isFormValid = isEmailValid && isConsentChecked;
        
        return isFormValid;
    }
    
    // Function to show/hide email section
    function toggleEmailSection() {
        if (emailSection.style.display === 'none') {
            emailSection.style.display = 'block';
            contactBtn.textContent = 'Submit Application';
            contactBtn.type = 'submit';
            contactBtn.disabled = true;
            
            // Update button help text
            const buttonHelp = document.getElementById('buttonHelp');
            buttonHelp.textContent = 'Complete email and consent to submit';
            buttonHelp.style.color = '#718096';
            
            // Focus on email field
            email.focus();
        } else {
            emailSection.style.display = 'none';
            contactBtn.textContent = 'Contact Us';
            contactBtn.type = 'button';
            contactBtn.disabled = false;
            
            // Reset form
            email.value = '';
            consent.checked = false;
            
            // Update button help text
            const buttonHelp = document.getElementById('buttonHelp');
            buttonHelp.textContent = 'Click to reveal contact form';
            buttonHelp.style.color = '#718096';
        }
    }
    
    // Function to update button state based on email validation
    function updateButtonState() {
        if (emailSection.style.display !== 'none') {
            const isValid = validateForm();
            contactBtn.disabled = !isValid;
            
            const buttonHelp = document.getElementById('buttonHelp');
            if (isValid) {
                buttonHelp.textContent = 'Ready to submit!';
                buttonHelp.style.color = '#38a169';
            } else {
                buttonHelp.textContent = 'Complete email and consent to submit';
                buttonHelp.style.color = '#718096';
            }
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
        const value = parseInt(this.value) || 12;
        
        // Validate range
        if (value > 20) {
            this.value = 20;
        } else if (value < 4) {
            this.value = 4;
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
    
    // Event listeners for email validation
    email.addEventListener('input', updateButtonState);
    consent.addEventListener('change', updateButtonState);
    
    // Event listener for contact button
    contactBtn.addEventListener('click', function(e) {
        if (this.type === 'button') {
            // First click - show email section
            toggleEmailSection();
        }
        // If type is submit, let the form handle submission
    });
    
    // Event listener for form submission
    loanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please complete all fields correctly.');
            return;
        }
        
        // Collect form data
        const formData = {
            loanAmount: parseFloat(loanAmount.value),
            subsidyPercent: parseFloat(subsidyPercent.value),
            downpayment: parseFloat(downpayment.value),
            loanDuration: parseInt(loanDuration.value),
            email: email.value,
            consent: consent.checked,
            // Calculated data
            financedAmount: parseFloat(financedAmount.textContent.replace(/[^\d]/g, '')),
            subsidyAmount: parseFloat(subsidyAmount.textContent.replace(/[^\d]/g, '')),
            monthlyPayment: parseFloat(monthlyPayment.textContent.replace(/[^\d]/g, ''))
        };
        
        // Here you can send the data to your backend
        console.log('Form data:', formData);
        
        // Show success message
        alert('Thank you! We have received your application. We will contact you soon by email.');
        
        // Reset form and hide email section
        loanForm.reset();
        toggleEmailSection();
        
        // Restore default values
        loanAmount.value = 25000;
        subsidyPercent.value = 20;
        downpayment.value = 5000;
        downpaymentSlider.value = 5000;
        loanDuration.value = 12;
        loanDurationSlider.value = 12;
        
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
        toggleEmailSection: toggleEmailSection
    };
    
});

# hola david
