$(document).ready(function () {

    // Change main product image
    function changeImage(src) {
        $('#mainProductImage').attr('src', src);
    }

    // Make the function available globally
    window.changeImage = changeImage;

    // Quantity selector functionality
    $('#decreaseQuantity').on('click', function () {
        const $quantityInput = $('#quantityInput');
        if (parseInt($quantityInput.val()) > 1) {
            $quantityInput.val(parseInt($quantityInput.val()) - 1);
        }
    });

    $('#increaseQuantity').on('click', function () {
        const $quantityInput = $('#quantityInput');
        $quantityInput.val(parseInt($quantityInput.val()) + 1);
    });

    $('#checkout').hide();
    if (localStorage.getItem('showCheckout') === 'true') {
        $('#checkout').show();
        localStorage.removeItem('showCheckout'); // Reset after showing
    }
    // Add to cart
    $('#addToCartBtn').on('click', function () {
        var productId = $(this).data('product-id');
        var price = $(this).data('price');
        var quantity = $('#quantityInput').val();
        var user_id = $(this).data('user-id');


        $.ajax({
            url: basePath + 'includes/cart.inc.php',
            method: 'POST',
            data: {
                'add_item': true,
                product_id: productId,
                price: price,
                quantity: quantity,
                user_id: user_id
            },
            success: function (response) {
                console.log('Success response:', response);
                try {
                    var result = typeof response === 'string' ? JSON.parse(response) : response;
                    if (result.status === 'success') {
                        alert(result.message);
                        // Show cart notification
                        const $toastEl = $('#cartNotification');
                        const toast = new bootstrap.Toast($toastEl[0]);
                        toast.show();

                        // Show checkout actions
                        $('#checkoutActions').css('display', 'flex');
                    } else {
                        alert('Error: ' + result.message);
                    }
                } catch (error) {
                    alert('An error occurred!. Please try again.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX request failed', textStatus, errorThrown);
                alert('An error occurred. Please try again.');
            }
        });
    });

    // update payment details in cart
    function updateTotals() {
        var subtotal = 0;
        $('.quantity-input').each(function () {
            var price = $(this).data('price');
            var quantity = $(this).val();
            subtotal += price * quantity;
        });
        $('#subtotal').text('GH₵' + subtotal.toFixed(2));
        $('#total').text('GH₵' + subtotal.toFixed(2));
    }

    $('.quantity-input').on('change', function () {
        updateTotals();

        // update cart item quantity
        var productId = $(this).data('product-id');
        var quantity = $(this).val();
        var userId = $(this).data('user-id');
        $.ajax({
            url: 'includes/cart.inc.php',
            method: 'POST',
            data: {
                'update_quantity': true,
                product_id: productId,
                quantity: quantity,
                user_id: userId
            },
            success: function (response) {
                console.log('Success response:', response);
                try {
                    var result = typeof response === 'string' ? JSON.parse(response) : response;
                    console.log('Parsed result:', result);
                    if (result.status === 'success') {
                        location.reload();
                    } else {
                        alert('Error: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error parsin response: ', error);
                    alert('An error occurred. Please try again.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX request failed', textStatus, errorThrown);
                alert('An error occurred. Please try again.');
            }
        });
    });

    updateTotals();
    // delete item from cart
    $('.delete-item').on('click', function () {
        var productId = $(this).data('product-id');
        var cartId = $(this).data('cart-id');
        var userId = $(this).data('user-id');
        $.ajax({
            url: 'includes/cart.inc.php',
            method: 'POST',
            data: {
                'delete-item': true,
                product_id: productId,
                cart_id: cartId,
                user_id: userId
            },
            success: function (response) {
                console.log('Success response:', response);
                try {
                    var result = typeof response === 'string' ? JSON.parse(response) : response;
                    console.log('Parsed result:', result);
                    if (result.status === 'success') {
                        alert(result.message);
                        location.reload();
                    } else {
                        alert('Error: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error parsin response: ', error);
                    alert('An error occurred. Please try again.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX request failed', textStatus, errorThrown);
                alert('An error occurred. Please try again.');
            }
        });
    });

    // Activate Bootstrap tabs
    $('button[data-bs-toggle="tab"]').on('click', function(event) {
        event.preventDefault();
        const target = $($(this).attr('data-bs-target'));
        
        // Hide all tab panes
        $('.tab-pane').removeClass('show active');
        
        // Remove active class from all tabs
        $('button[data-bs-toggle="tab"]').removeClass('active');
        
        // Show the selected tab pane
        target.addClass('show active');
        
        // Add active class to the clicked tab
        $(this).addClass('active');
    });

    const shippingCosts = {
        'Accra': 50.00,
        'Kumasi': 70,
    }

    //delivery handling
    $('#delivery-options').on('change', function () {
        var deliveryOption = $(this).val();
        var deliveryLocation = $('#delivery-location').val();

        if (deliveryOption == 'door-delivery') {
            $('#delivery-location').show();
        } else {
            $('#delivery-location').hide();
        }

    });
});
