// Enhanced E-commerce Store Management with Authentication
class ByteBazarStore {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.currentUser = null;
        this.users = []; // In a real app, this would be handled by a backend
        this.products = [
            {
                id: 1,
                name: "Yuki Aim - Polar75 - 8k Dragon Edition",
                category: "keyboard",
                price: 190,
                image: "photos/yuki aim 1.png",
                badge: "hot",
                features: ["8000Hz Polling", "75% Layout", "Linear Switches"],
                rating: 4.8,
                inStock: true
            },
            {
                id: 2,
                name: "Yuki Aim Hall Effect Magnetic 65%",
                category: "keyboard",
                price: 175,
                image: "photos/yuki aim 2.png",
                features: ["Hall Effect", "65% Layout", "Gaming Optimized"],
                rating: 4.9,
                inStock: true
            },
            {
                id: 3,
                name: "Viper Mini",
                category: "mouse",
                price: 89,
                image: "photos/mouse_2-removebg-preview.png",
                badge: "",
                features: ["Ultra-light", "8000 DPI", "RGB Lighting"],
                rating: 4.7,
                inStock: true
            },
            {
                id: 4,
                name: "Viper Mini Signature Edition",
                category: "mouse",
                price: 115,
                image: "photos/mouse 1.png",
                badge: "sale",
                features: ["Signature Design", "Pro Sensor", "Wireless"],
                rating: 4.6,
                inStock: true
            },
            {
                id: 5,
                name: "Razer Barracuda Pro",
                category: "headphone",
                price: 200,
                image: "photos/headphone-removebg-preview.png",
                badge: "new",
                features: ["Active Noise Cancelling", "THX Spatial Audio", "50hr Battery"],
                rating: 4.8,
                inStock: false
            },
            {
                id: 6,
                name: "Yuki Aim - Kitsune LARGE Mousepad",
                category: "mousepad",
                price: 35,
                image: "photos/mousepad 2.png",
                badge: "",
                features: ["XXL Size", "Stitched Edges", "Anti-slip Base"],
                rating: 4.5,
                inStock: true
            },
            {
                id: 7,
                name: "Koorui 24E3 24\" 165Hz Gaming Monitor",
                category: "monitor",
                price: 199,
                image: "photos/monitor1.png",
                badge: "hot",
                features: ["165Hz Refresh", "1ms Response", "FreeSync"],
                rating: 4.4,
                inStock: true
            },
            {
                id: 8,
                name: "AOC C27G4X 27\" Curved Gaming Monitor",
                category: "monitor",
                price: 250,
                image: "photos/monitor2.jpg",
                badge: "",
                features: ["1500R Curve", "180Hz", "VA Panel"],
                rating: 4.6,
                inStock: true
            }
        ];
        this.currentFilter = 'all';
        this.currentSort = 'featured';
        this.init();
    }

    init() {
        this.loadUserData();
        this.renderProducts();
        this.updateCartCount();
        this.bindEvents();
        this.initScrollEffects();
        this.updateAuthUI();
    }

    // Authentication Methods
    loadUserData() {
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));
        const savedUsers = JSON.parse(localStorage.getItem('users'));
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));

        if (savedUsers) this.users = savedUsers;
        if (savedUser) this.currentUser = savedUser;
        if (savedCart) this.cart = savedCart;
        if (savedWishlist) this.wishlist = savedWishlist;
    }

    saveUserData() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    register(userData) {
        console.log('Register method called with:', userData);
        
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            throw new Error('All fields are required');
        }

        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            orders: [],
            addresses: []
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        console.log('New user created:', newUser);
        console.log('Current user set:', this.currentUser);
        
        this.saveUserData();
        console.log('User data saved');
        
        // Update UI after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.updateAuthUI();
            console.log('Auth UI updated');
        }, 100);

        return newUser;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        this.saveUserData();
        this.updateAuthUI();

        return user;
    }

    logout() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
        this.updateAuthUI();
        this.updateCartCount();
        this.renderCart();
    }

    updateAuthUI() {
        const loginLink = document.querySelector('.login-link');
        const userDropdown = document.getElementById('userDropdown');
        const userName = document.getElementById('userName');

        console.log('Updating auth UI:', {
            currentUser: this.currentUser,
            loginLink: !!loginLink,
            userDropdown: !!userDropdown,
            userName: !!userName
        });

        if (this.currentUser && loginLink && userDropdown) {
            loginLink.style.display = 'none';
            userDropdown.style.display = 'block';
            
            if (userName) {
                userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
            
            // Make sure the dropdown shows inline-block or flex
            userDropdown.style.display = 'inline-block';
            
        } else if (loginLink && userDropdown) {
            loginLink.style.display = 'flex';
            userDropdown.style.display = 'none';
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        if (strength < 3) return 'weak';
        if (strength < 5) return 'medium';
        return 'strong';
    }

    bindEvents() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // User dropdown toggle
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdownContent = userDropdown.querySelector('.dropdown-content');
                if (dropdownContent) {
                    dropdownContent.classList.toggle('active');
                }
            });
        }

        // Add click handlers for dropdown items
        document.addEventListener('click', (e) => {
            if (e.target.onclick) return; // Skip if element has onclick handler
            
            // Handle profile click
            if (e.target.closest('a[onclick*="showProfile"]')) {
                e.preventDefault();
                showProfile();
            }
            // Handle orders click  
            else if (e.target.closest('a[onclick*="showOrders"]')) {
                e.preventDefault();
                showOrders();
            }
            // Handle wishlist click
            else if (e.target.closest('a[onclick*="showWishlist"]')) {
                e.preventDefault();
                showWishlist();
            }
            // Handle logout click
            else if (e.target.closest('a[onclick*="logout"]')) {
                e.preventDefault();
                logout();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdownContent = document.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.remove('active');
            }
        });

        // Password strength indicator
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => {
                const strength = this.checkPasswordStrength(e.target.value);
                const strengthIndicator = document.getElementById('passwordStrength');
                strengthIndicator.className = `password-strength ${strength}`;
            });
        }

        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', (e) => {
                const password = document.getElementById('registerPassword').value;
                if (e.target.value !== password && e.target.value.length > 0) {
                    e.target.setCustomValidity('Passwords do not match');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
    }

    initScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.category-card, .product-card, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    renderProducts(productsToRender = null) {
        const products = productsToRender || this.getFilteredAndSortedProducts();
        const grid = document.getElementById('productsGrid');
        
        grid.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                    ${product.badge ? `<div class="product-badge badge-${product.badge}">${product.badge}</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-features">
                        ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="add-to-cart ${!product.inStock ? 'disabled' : ''}" 
                                onclick="store.addToCart(${product.id})" 
                                ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-${product.inStock ? 'cart-plus' : 'bell'}"></i>
                            ${product.inStock ? 'Add to Cart' : 'Notify Me'}
                        </button>
                        <button class="wishlist-btn ${this.wishlist.includes(product.id) ? 'active' : ''}" 
                                onclick="store.toggleWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-apply intersection observer to new elements
        setTimeout(() => {
            document.querySelectorAll('.product-card').forEach(el => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('fade-in');
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(el);
            });
        }, 100);
    }

    getFilteredAndSortedProducts() {
        let filtered = this.currentFilter === 'all' 
            ? [...this.products] 
            : this.products.filter(p => p.category === this.currentFilter);

        switch (this.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default: // featured
                filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        }

        return filtered;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartCount();
        this.renderCart();
        this.saveUserData();
        this.showToast(`${product.name} added to cart!`, 'success');
        
        // Button feedback
        const button = event.target.closest('.add-to-cart');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        const product = this.products.find(p => p.id === productId);
        
        if (index === -1) {
            this.wishlist.push(productId);
            this.showToast(`${product.name} added to wishlist!`, 'success');
        } else {
            this.wishlist.splice(index, 1);
            this.showToast(`${product.name} removed from wishlist`, 'warning');
        }
        
        this.saveUserData();
        
        // Update button state
        const button = event.target.closest('.wishlist-btn');
        button.classList.toggle('active');
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCartCount();
                this.renderCart();
                this.saveUserData();
            }
        }
    }

    removeFromCart(productId) {
        const product = this.cart.find(item => item.id === productId);
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartCount();
        this.renderCart();
        this.saveUserData();
        this.showToast(`${product.name} removed from cart`, 'warning');
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p>Start adding some awesome products!</p>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=Image+Not+Found'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="store.updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="store.updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="store.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
}

// Global functions for HTML event handlers
function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    store.renderCart();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal() {
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function clearCart() {
    if (store.cart.length === 0) {
        store.showToast('Cart is already empty!', 'warning');
        return;
    }
    store.cart = [];
    store.updateCartCount();
    store.renderCart();
    store.saveUserData();
    store.showToast('Cart cleared!', 'warning');
}

function checkout() {
    if (store.cart.length === 0) {
        store.showToast('Your cart is empty!', 'warning');
        return;
    }
    if (!store.currentUser) {
        store.showToast('Please login to checkout!', 'warning');
        showModal('loginModal');
        return;
    }
    store.showToast('Checkout feature coming soon!', 'success');
}

function filterProducts(category) {
    store.currentFilter = category;
    store.renderProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function sortProducts(sortType) {
    store.currentSort = sortType;
    store.renderProducts();
}

function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    store.showToast('Thank you for subscribing!', 'success');
    event.target.reset();
}

function showModal(modalId) {
    closeModal(); // Close any existing modals
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function switchToLogin() {
    closeModal();
    showModal('loginModal');
}

function switchToRegister() {
    closeModal();
    showModal('registerModal');
}

function showForgotPassword() {
    closeModal();
    showModal('forgotPasswordModal');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Authentication form handlers
function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        store.login(email, password);
        store.showToast('Login successful!', 'success');
        closeModal();
    } catch (error) {
        store.showToast(error.message, 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Check password confirmation
    const confirmPassword = formData.get('confirmPassword');
    if (userData.password !== confirmPassword) {
        store.showToast('Passwords do not match!', 'error');
        return;
    }

    console.log('Attempting to register user:', userData.email);
    
    try {
        const newUser = store.register(userData);
        console.log('User registered successfully:', newUser);
        store.showToast(`Welcome ${newUser.firstName}! Account created successfully!`, 'success');
        closeModal();
    } catch (error) {
        console.error('Registration error:', error);
        store.showToast(error.message, 'error');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    // Simulate sending reset email
    store.showToast('Password reset link sent to your email!', 'success');
    closeModal();
    event.target.reset();
}

// Social login handlers
function socialLogin(provider) {
    store.showToast(`${provider} login will be implemented soon!`, 'warning');
}

// User account functions
function showProfile() {
    store.showToast('Profile management coming soon!', 'warning');
}

function showOrders() {
    store.showToast('Order history coming soon!', 'warning');
}

function showWishlist() {
    if (store.wishlist.length === 0) {
        store.showToast('Your wishlist is empty!', 'warning');
        return;
    }
    
    const wishlistProducts = store.products.filter(p => store.wishlist.includes(p.id));
    store.renderProducts(wishlistProducts);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    store.showToast(`Showing ${wishlistProducts.length} wishlist items`, 'success');
}

function logout() {
    console.log('Logout function called');
    console.log('Current user before logout:', store.currentUser);
    
    store.logout();
    
    console.log('Current user after logout:', store.currentUser);
    store.showToast('Logged out successfully!', 'success');
    
    // Close dropdown if open
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.remove('active');
    }
}

function showFilters() {
    store.showToast('Advanced filters coming soon!', 'warning');
}

// Initialize the store when DOM is loaded
let store;
document.addEventListener('DOMContentLoaded', () => {
    store = new ByteBazarStore();
    
    // Add a test function to check DOM elements
    window.testAuth = function() {
        console.log('=== DOM Element Check ===');
        console.log('Login link:', document.querySelector('.login-link'));
        console.log('User dropdown:', document.getElementById('userDropdown'));  
        console.log('User name:', document.getElementById('userName'));
        console.log('Dropdown content:', document.querySelector('.dropdown-content'));
        console.log('Current user:', store.currentUser);
        console.log('========================');
    };
    
    // Call test function after a delay
    setTimeout(() => {
        console.log('Testing DOM elements...');
        window.testAuth();
    }, 1000);
});