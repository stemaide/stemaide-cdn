// Enhanced cookie consent with session storage
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsentBanner = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-consent');
    
    if (!cookieConsentBanner || !acceptButton) {
        console.warn('Cookie consent elements not found');
        return;
    }
    
    // Check if user has already given consent
    function checkConsentStatus() {
        // Use global base path variable or fallback to default
        const basePath = window.BASE_PATH || '/reforme/';
        const handlerUrl = `${basePath}includes/cookie-consent-handler.php?check_consent=1`;
        
        fetch(handlerUrl)
            .then(response => response.json())
            .then(data => {
                if (data.show_banner) {
                    // Show banner after a short delay for better UX
                    setTimeout(() => {
                        cookieConsentBanner.classList.remove('consent-hidden');
                    }, 2000);
                }
                // If consent already given, hide banner immediately
            })
            .catch(error => {
                console.error('Error checking consent status:', error);
                // Fallback: show banner anyway
                setTimeout(() => {
                    cookieConsentBanner.classList.remove('consent-hidden');
                }, 2000);
            });
    }
    
    // Handle accept button click
    acceptButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Send consent to server
        // Use global base path variable or fallback to default
        const basePath = window.BASE_PATH || '/reforme/';
        const handlerUrl = `${basePath}includes/cookie-consent-handler.php`;
        
        fetch(handlerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=accept_cookies'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Hide the banner smoothly
                cookieConsentBanner.classList.add('consent-hidden');
                
                // Optional: Show confirmation message
                console.log('Cookie consent recorded successfully');
            } else {
                console.error('Failed to record consent:', data.message);
                // Still hide the banner on client side
                cookieConsentBanner.classList.add('consent-hidden');
            }
        })
        .catch(error => {
            console.error('Error recording consent:', error);
            // Hide banner even if there's an error
            cookieConsentBanner.classList.add('consent-hidden');
        });
    });
    
    // Initialize consent check
    checkConsentStatus();
});