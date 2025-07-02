document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Initialize variables
    const sizeOptions = document.querySelectorAll('.size-option');
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    const quantityInput = document.querySelector('.quantity-input');
    const addedToCartMessage = document.querySelector('.added-to-cart-message');
    const parallaxBg = document.querySelector('.parallax-bg');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    const colorOptions = document.querySelectorAll('.color-option');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    // Handle size selection
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add to Cart functionality
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function() {
            const selectedSize = document.querySelector('.size-option.active')?.dataset.size;
            const quantity = parseInt(quantityInput.value) || 1;
            
            // Validate size selection
            if (!selectedSize) {
                showNotification('Please select a size');
                return;
            }
            
            // Disable button and show loading state
            this.disabled = true;
            this.classList.add('loading');
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success state
                this.classList.remove('loading');
                this.classList.add('success');
                
                // Show success message
                if (addedToCartMessage) {
                    addedToCartMessage.classList.add('show');
                    setTimeout(() => {
                        addedToCartMessage.classList.remove('show');
                    }, 3000);
                }
                
                // Reset button after animation
                setTimeout(() => {
                    this.classList.remove('success');
                    this.disabled = false;
                }, 2000);
                
                // Here you would typically update the cart in your state management
                console.log('Added to cart:', { size: selectedSize, quantity });
                
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.classList.remove('loading', 'success');
                this.disabled = false;
                showNotification('Failed to add to cart. Please try again.');
            }
        });
    }
    
    // Helper function to show notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'added-to-cart-message';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Trigger reflow
        void notification.offsetWidth;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Handle size selection
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Enhanced Parallax Effect
    if (parallaxBg) {
        // Set initial position
        updateParallax();
        
        // Use requestAnimationFrame for smoother performance
        let ticking = false;
        
        // Update on scroll with debounce
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', updateParallax, { passive: true });
    }
    
    function updateParallax() {
        if (!parallaxBg) return;
        
        // Get the speed factor from data attribute or use default
        const speed = parseFloat(parallaxBg.getAttribute('data-speed')) || 0.4;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const yPos = -(scrollPosition * speed);
        
        // Apply the transform with hardware acceleration
        parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }

    // Product Image Gallery
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Update main image source
            const newSrc = this.querySelector('img').src.replace('100x125', '800x1000');
            mainImage.src = newSrc;
            // Add fade effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });

    // Color Selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all color options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Here you could update the product image based on color
            // For example: mainImage.src = `path/to/${this.dataset.color}-product.jpg`;
        });
    });

    // Quantity Selector
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) { // Assuming max quantity is 10
                quantityInput.value = currentValue + 1;
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add to Cart Animation is now handled by the main add to cart functionality above

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Here you would typically send the email to your server
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Sticky Navigation on Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        const headerHeight = navbar.offsetHeight;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                // Scroll Down
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                // Scroll Up
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }

    // Scroll-to-top button has been removed
});
