$(document).ready(function () {
    // // function adds product to cart
    // $('#add-cart').on('click', function () {
    //     let finalQuantity = parseInt($('#quantity').val());
    //     $('#cart-qunatity').val(finalQuantity);
    //     let quantity = parseInt($('#cart-qunatity').val());
    //     //$('#cart').submit();
    //     console.log(quantity);
    // });
    // // function increases quantity
    // $('#ti-plus').on('click', function () {
    //     let currentVal = parseInt($('#quantity').val());
    //     currentVal++;
    //     $('#quantity').val(currentVal);
    // });

    // // function decreases quantity
    // $('#ti-minus').on('click', function () {
    //     let currentVal = parseInt($('#quantity').val());
    //     currentVal--;
    //     $('#quantity').val(currentVal);
    // });

    // function to toggle side bar
    var sidebar = $('#sidebar');
    var sidebarToggle = $('#sidebar-toggle');
    if (sidebarToggle.length && sidebar.length) {
        sidebarToggle.on('click', function () {
            sidebar.toggleClass('collapsed');
        });
    }

    function previewImage(input, previewId) {
        var $preview = $('#' + previewId);
        $preview.empty();
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('<img>').attr('src', e.target.result).appendTo($preview);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Attach the function to file inputs
    $('input[type="file"]').on('change', function () {
        var previewId = $(this).attr('id') + 'Preview';
        previewImage(this, previewId);
    });


    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function () {
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            const isCollapsed = target.classList.contains('show');

            // Collapse all descriptions
            document.querySelectorAll('.full-description').forEach(desc => {
                desc.classList.remove('show');
            });

            // Toggle the clicked description
            if (!isCollapsed) {
                target.classList.add('show');
                this.textContent = 'Read Less';
            } else {
                this.textContent = 'Read More';
            }
        });
    });
});