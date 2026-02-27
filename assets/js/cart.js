// Unified cart functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== STORE PAGE FUNCTIONALITY ====================
    if (document.getElementById('products-container')) {
        // Store page product loading and category filtering
        const categoryLinks = document.querySelectorAll('.category-link');
        const productsContainer = document.getElementById('products-container');
        const categoryTitle = document.getElementById('category-title');
        const categoryDescription = document.getElementById('category-description');
        
        if (categoryLinks.length > 0 && productsContainer) {
            // Category filtering
            categoryLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const categoryId = this.dataset.categoryId;
                    const categoryName = this.textContent.trim();
                    
                    // Update active state
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update title and description
                    if (categoryTitle) categoryTitle.textContent = categoryName;
                    if (categoryDescription) categoryDescription.textContent = `Browse all ${categoryName} products`;
                    
                    // Filter products
                    const productCards = productsContainer.querySelectorAll('.product-card');
                    productCards.forEach(card => {
                        const cardCategoryId = card.dataset.categoryId;
                        if (categoryId === 'all' || cardCategoryId === categoryId) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
            
            // Hover effects for product cards
            document.addEventListener('mouseover', function(e) {
                if (e.target.closest('.product-card')) {
                    var overlay = e.target.closest('.product-card').querySelector('.product-overlay');
                    if (overlay) {
                        overlay.classList.remove('opacity-0');
                    }
                }
            });
            
            document.addEventListener('mouseout', function(e) {
                if (e.target.closest('.product-card')) {
                    var overlay = e.target.closest('.product-card').querySelector('.product-overlay');
                    if (overlay) {
                        overlay.classList.add('opacity-0');
                    }
                }
            });
        }
        
        // Featured product image switching
        window.changeMainImage = function(src) {
            const mainImage = document.querySelector('#store .featured-image-container img');
            if (mainImage) {
                mainImage.src = src;
            }
        };
        
        // Featured product quantity controls
        const decreaseBtnFeatured = document.getElementById('decreaseQuantityFeatured');
        const increaseBtnFeatured = document.getElementById('increaseQuantityFeatured');
        const quantityInputFeatured = document.getElementById('quantityInputFeatured');
        
        if (decreaseBtnFeatured && increaseBtnFeatured && quantityInputFeatured) {
            decreaseBtnFeatured.addEventListener('click', function() {
                let value = parseInt(quantityInputFeatured.value);
                if (value > 1) {
                    quantityInputFeatured.value = value - 1;
                }
            });
            
            increaseBtnFeatured.addEventListener('click', function() {
                let value = parseInt(quantityInputFeatured.value);
                let max = parseInt(quantityInputFeatured.max);
                if (value < max) {
                    quantityInputFeatured.value = value + 1;
                }
            });
        }
        
        // Featured product add to cart
        const addToCartBtnFeatured = document.getElementById('addToCartBtnFeatured');
        if (addToCartBtnFeatured && quantityInputFeatured) {
            addToCartBtnFeatured.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const price = this.dataset.price;
                const quantity = quantityInputFeatured.value;
                const userId = this.dataset.userId;
                
                // Disable button during request
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...';
                
                // Use global base path variable or fallback to default
                const basePath = window.BASE_PATH || '/reforme/';
                const apiUrl = `${basePath}api/cart.php`;
                
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'add_item': true,
                        'product_id': productId,
                        'price': price,
                        'quantity': quantity,
                        'user_id': userId
                    })
                })
                .then(response => response.text())
                .then(data => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'success') {
                            showToast(result.message, 'success');

                            // Update cart badge
                            const cartBadge = document.querySelector('.purchasenow .badge');
                            if (cartBadge) {
                                const currentCount = parseInt(cartBadge.textContent) || 0;
                                cartBadge.textContent = currentCount + parseInt(quantity);
                            }
                            
                            // Show cart notification
                            const cartNotification = document.getElementById('cartNotification');
                            if (cartNotification) {
                                const toast = new bootstrap.Toast(cartNotification);
                                toast.show();
                            }
                            
                            // Show checkout actions
                            const checkoutActions = document.getElementById('checkoutActions');
                            if (checkoutActions) {
                                checkoutActions.style.display = 'flex';
                            }
                        } else {
                            showToast('Error: ' + result.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                        showToast('An error occurred. Please try again.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('An error occurred. Please try again.', 'error');
                })
                .finally(() => {
                    // Re-enable button
                    this.disabled = false;
                    this.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Add to Cart';
                });
            });
        }
    }
    
    // ==================== DETAILS PAGE FUNCTIONALITY ====================
    if (document.getElementById('decreaseQuantity')) {
        // Quantity controls (same as store page)
        const decreaseBtn = document.getElementById('decreaseQuantity');
        const increaseBtn = document.getElementById('increaseQuantity');
        const quantityInput = document.getElementById('quantityInput');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                let max = parseInt(quantityInput.max);
                if (value < max) {
                    quantityInput.value = value + 1;
                }
            });
        }
        
        // Add to cart functionality (same as store page featured product)
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn && quantityInput) {
            addToCartBtn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const price = this.dataset.price;
                const quantity = quantityInput.value;
                const userId = this.dataset.userId;
                
                // Disable button during request
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...';
                
                // Use global base path variable or fallback to default
                const basePath = window.BASE_PATH || '/reforme/';
                const apiUrl = `${basePath}api/cart.php`;
                
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'add_item': true,
                        'product_id': productId,
                        'price': price,
                        'quantity': quantity,
                        'user_id': userId
                    })
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    console.log('Response headers:', [...response.headers.entries()]);
                    return response.text();
                })
                .then(data => {
                    console.log('Raw response data:', data);
                    try {
                        const result = JSON.parse(data);
                        console.log('Parsed result:', result);
                        if (result.status === 'success') {
                            showToast(result.message, 'success');
                            
                            // Update cart badge
                            const cartBadge = document.querySelector('.purchasenow .badge');
                            if (cartBadge) {
                                const currentCount = parseInt(cartBadge.textContent) || 0;
                                cartBadge.textContent = currentCount + parseInt(quantity);
                            }
                            
                            // Show cart notification
                            const cartNotification = document.getElementById('cartNotification');
                            if (cartNotification) {
                                const toast = new bootstrap.Toast(cartNotification);
                                toast.show();
                            }
                            
                            // Show checkout actions
                            const checkoutActions = document.getElementById('checkoutActions');
                            if (checkoutActions) {
                                checkoutActions.style.display = 'flex';
                            }
                        } else {
                            showToast('Error: ' + result.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                        console.error('Response data that failed to parse:', data);
                        
                        // Try to extract some useful information from the response
                        if (data.trim().startsWith('<')) {
                            showToast('Server returned HTML instead of JSON. Please check if the page is working correctly.', 'error');
                        } else if (data.trim() === '') {
                            showToast('Server returned empty response. Please try again.', 'error');
                        } else {
                            showToast('Server response format error. Please try again.', 'error');
                        }
                    }
                })
                .catch(error => {
                    console.error('Network/Fetch error:', error);
                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        showToast('Network connection error. Please check your internet connection.', 'error');
                    } else {
                        showToast('An unexpected error occurred. Please try again.', 'error');
                    }
                })
                .finally(() => {
                    // Re-enable button
                    this.disabled = false;
                    this.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Add to Cart';
                });
            });
        }
        
        // Image switching function (same as store page)
        window.changeImage = function(src) {
            const mainImage = document.getElementById('mainProductImage');
            if (mainImage) {
                mainImage.src = src;
            }
        };
    }
    
    // ==================== CART PAGE FUNCTIONALITY ====================
    if (document.querySelector('.delete-item')) {
        // Handle delete item functionality
        document.addEventListener('click', function(e) {
            if (e.target.closest('.delete-item')) {
                e.preventDefault();
                
                const deleteBtn = e.target.closest('.delete-item');
                const productId = deleteBtn.dataset.productId;
                const cartId = deleteBtn.dataset.cartId;
                const userId = deleteBtn.dataset.userId;
                
                // Confirm deletion
                if (!confirm('Are you sure you want to remove this item from your cart?')) {
                    return;
                }
                
                // Disable button during request
                deleteBtn.disabled = true;
                const originalContent = deleteBtn.innerHTML;
                deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
                
                // Make AJAX request
                // Use global base path variable or fallback to default
                const basePath = window.BASE_PATH || '/reforme/';
                const apiUrl = `${basePath}api/cart.php`;
                
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'delete-item': true,
                        'product_id': productId,
                        'cart_id': cartId,
                        'user_id': userId
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Remove the table row
                        deleteBtn.closest('tr').remove();
                        
                        // Show success message
                        showToast(data.message, 'success');
                        
                        // Update cart totals
                        updateCartTotals();
                    } else {
                        showToast('Error: ' + data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Delete error:', error);
                    showToast('An error occurred while removing the item. Please try again.', 'error');
                })
                .finally(() => {
                    // Re-enable button
                    deleteBtn.disabled = false;
                    deleteBtn.innerHTML = originalContent;
                });
            }
        });
        
        // Handle quantity changes
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const quantityInput = e.target;
                const productId = quantityInput.dataset.productId;
                const userId = quantityInput.dataset.userId;
                const newQuantity = parseInt(quantityInput.value);
                
                if (newQuantity < 1) {
                    quantityInput.value = 1;
                    return;
                }
                
                // Update quantity via AJAX
                // Use global base path variable or fallback to default
                const basePath = window.BASE_PATH || '/reforme/';
                const apiUrl = `${basePath}api/cart.php`;
                
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'update_quantity': true,
                        'product_id': productId,
                        'quantity': newQuantity,
                        'user_id': userId
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        updateCartTotals();
                    } else {
                        showToast('Error updating quantity: ' + data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Quantity update error:', error);
                    showToast('Error updating quantity. Please try again.', 'error');
                });
            }
        });
        
        // Update cart totals function
        function updateCartTotals() {
            const rows = document.querySelectorAll('tbody tr');
            let total = 0;
            
            rows.forEach(row => {
                // Skip rows with colspan (like "No items" message) and ensure row has enough cells
                if (!row.querySelector('td[colspan]') && row.cells.length >= 3) {
                    try {
                        const priceCell = row.cells[1];
                        const quantityCell = row.cells[2];
                        
                        if (priceCell && quantityCell) {
                            const priceElement = priceCell.querySelector('span');
                            const quantityInput = quantityCell.querySelector('input');
                            
                            if (priceElement && quantityInput) {
                                const priceText = priceElement.textContent.replace('GH₵', '').trim();
                                const price = parseFloat(priceText);
                                const quantity = parseInt(quantityInput.value);
                                
                                if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
                                    total += price * quantity;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('Error calculating row total:', error);
                        // Continue with other rows
                    }
                }
            });
            
            // Update subtotal and total displays
            const totalElements = document.querySelectorAll('td span');
            totalElements.forEach(element => {
                if (element.textContent.includes('GH₵')) {
                    element.textContent = 'GH₵' + total.toFixed(2);
                }
            });
            
            // Check if cart is empty and show appropriate message
            const productRows = Array.from(rows).filter(row => 
                !row.querySelector('td[colspan]') && row.cells.length >= 3
            );
            
            if (productRows.length === 0) {
                location.reload(); // Reload to show empty cart message
            }
        }
    }
    
    // ==================== SHARED UTILITY FUNCTIONS ====================
    // Toast notification function (used across all pages)
    function showToast(message, type = 'info') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '10000';
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', function() {
            toastContainer.remove();
        });
    }
    
    // Make showToast globally available
    window.showToast = showToast;
});