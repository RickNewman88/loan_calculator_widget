# Loan Calculator Widget

A complete and accessible widget for loan calculations, designed to be embedded in any website using an iframe.

## 🚀 Features

- **Complete form** with real-time validations
- **Responsive design** that adapts to any device
- **Complete accessibility** with ARIA labels and keyboard navigation
- **Automatic calculations** with French amortization method
- **Email validation** and mandatory consent
- **Smart button** that reveals contact form progressively
- **Communication with parent page** via postMessage
- **Inline input layout** (label left, input right)
- **Synchronized sliders** for downpayment and loan duration
- **Real-time calculations** with 5.5% annual interest rate

## 📁 File Structure

```
loan-widget/
├── index.html          # Main widget file
├── style.css           # CSS styles
├── script.js           # JavaScript logic
├── ejemplo-embed.html  # Embedding example
└── README.md           # This file
```

## 🔧 Installation

1. **Download** all files to a folder called `loan-widget`
2. **Upload** the folder to your web server
3. **Embed** the widget using the provided HTML code

## 📱 Embedding Code

### Basic
```html
<iframe 
    src="path/to/loan-widget/index.html" 
    width="400" 
    height="560" 
    style="border:0;"
    title="Loan Calculator">
</iframe>
```

### Responsive
```html
<iframe 
    src="path/to/loan-widget/index.html" 
    width="100%" 
    height="560" 
    style="border:0; max-width: 400px;"
    title="Loan Calculator">
</iframe>
```

### With custom styles
```html
<div style="max-width: 400px; margin: 0 auto;">
    <iframe 
        src="path/to/loan-widget/index.html" 
        width="100%" 
        height="560" 
        style="border:0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
        title="Loan Calculator">
    </iframe>
</div>
```

## 🎯 Form Fields

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| **Loan Amount** | Number | 1,000€ - 60,000€ | Total loan amount |
| **Subsidy Percentage** | Number | 0% - 100% | Government assistance percentage |
| **Downpayment** | Number + Slider | 0€ - Loan Amount | Initial client payment |
| **Loan Duration** | Number + Slider | 4 - 20 years | Repayment period |
| **Contact Email** | Email | - | To receive quote (hidden initially) |
| **Consent** | Checkbox | Required | Terms acceptance (hidden initially) |

## 📊 Calculated Results

- **Loan amount financed**: max(Loan amount - Subsidy amount - Downpayment, 0)
- **Subsidy**: Loan amount × (Subsidy % ÷ 100)
- **Monthly payment**: French amortization with 5.5% annual interest rate

## 🔌 JavaScript API

The widget exposes a global `window.loanCalculator` API with the following functions:

```javascript
// Calculate results
window.loanCalculator.calculateResults();

// Validate form
window.loanCalculator.validateForm();

// Send message to parent page
window.loanCalculator.sendMessageToParent(data);

// Toggle email section visibility
window.loanCalculator.toggleEmailSection();
```

## 📨 Communication with Parent Page

The widget can communicate with the containing page:

```javascript
// In the parent page
window.addEventListener('message', function(event) {
    if (event.data.type === 'LOAN_CALCULATOR_DATA') {
        console.log('Form data:', event.data.data);
        // Process data here
    }
});
```

## 🎨 Customization

### Colors
Main colors can be modified in `style.css`:
- **Primary**: `#667eea` (blue)
- **Secondary**: `#764ba2` (purple)
- **Success**: `#38a169` (green)
- **Error**: `#e53e3e` (red)

### Sizes
- **Maximum width**: 400px (modifiable in CSS)
- **Recommended height**: 560px for iframe

## ♿ Accessibility

- **ARIA labels** for all fields
- **Complete keyboard navigation**
- **High contrast** by default
- **Motion reduction** respected
- **Screen reader** compatible
- **Visible focus** on all elements
- **aria-live** for real-time updates

## 🌐 Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, tablet, mobile
- **Frameworks**: Works on any website
- **HTTPS**: Recommended for production

## 🆕 Version 2.0 New Features

- **English interface** throughout
- **Inline input layout** (label left, input right)
- **Dual controls** for downpayment and duration
- **Real-time calculations** with interest rate
- **Progressive disclosure** of contact form
- **Enhanced accessibility** and keyboard support

## 🚀 Future Improvements

- [ ] Multiple loan types
- [ ] Local preference storage
- [ ] Results export
- **Customizable themes**
- [ ] Interest rate API integration
- [ ] Amortization schedule display

## 📝 License

This project is open source and available under the MIT license.

## 🤝 Contributions

Contributions are welcome. Please open an issue or pull request for suggestions and improvements.

## 📞 Support

For technical support or questions, contact the development team.

---

**Version**: 2.0.0  
**Last updated**: 2024  
**Author**: Your Name
