// script.js (Versi Akhir)

let cart = []; 

// =======================================================
// FUNGSI PEMBANTU
// =======================================================

// Fungsi untuk format angka menjadi Rupiah
const formatRupiah = (angka) => {
    const numberString = angka.toString();
    return 'Rp ' + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fungsi untuk mengaktifkan/menonaktifkan menu mobile
const toggleMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active'); 
    }
}

// Fungsi untuk menampilkan notifikasi kustom yang elegan
const showCustomNotification = (message) => {
    const notification = document.getElementById('custom-notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500); 
        }, 3000); 
    }
};


// =======================================================
// FUNGSI KERANJANG DAN MODAL
// =======================================================

const toggleCart = () => {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        if (modal.style.display === "block") {
            modal.style.display = "none";
        } else {
            const checkoutModal = document.getElementById('checkout-modal');
            if(checkoutModal) checkoutModal.style.display = 'none'; 
            modal.style.display = "block";
            renderCart(); 
        }
    }
}

const showCheckout = () => {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const receipt = document.getElementById('receipt');
    const checkoutForm = document.getElementById('checkout-form');

    if (cartModal) cartModal.style.display = 'none';
    if (checkoutModal) checkoutModal.style.display = 'block';
    if (receipt) receipt.style.display = 'none';
    if (checkoutForm) checkoutForm.style.display = 'block';
}

const hideCheckout = () => {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'none';
}

const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

const addItemToCart = (itemElement) => {
    const name = itemElement.dataset.name;
    const price = parseInt(itemElement.dataset.price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartCount();
    showCustomNotification(`Berhasil: ${name} ditambahkan ke keranjang.`);
};


const renderCart = () => {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (!cartItemsElement || !cartTotalElement || !emptyMessage || !checkoutButton) return;
    
    cartItemsElement.innerHTML = ''; 

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartTotalElement.textContent = formatRupiah(0);
        checkoutButton.disabled = true;
        return;
    }

    emptyMessage.style.display = 'none';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-controls">
                <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                <span class="price-item">${formatRupiah(itemTotal)}</span>
                <button class="remove-item" data-index="${index}">&times;</button> 
            </div>
        `;
        cartItemsElement.appendChild(itemDiv);
    });

    cartTotalElement.textContent = formatRupiah(total);
    checkoutButton.disabled = false;
};

const updateQuantity = (index, action) => {
    const itemIndex = parseInt(index);
    
    if (itemIndex >= 0 && itemIndex < cart.length) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
            showCustomNotification(`Kuantitas ${cart[itemIndex].name} ditambah.`);
        } else if (action === 'decrease') {
            cart[itemIndex].quantity -= 1;
            
            if (cart[itemIndex].quantity < 1) {
                const itemName = cart[itemIndex].name;
                cart.splice(itemIndex, 1);
                showCustomNotification(`${itemName} dihapus dari keranjang.`);
            } else {
                 showCustomNotification(`Kuantitas ${cart[itemIndex].name} dikurangi.`);
            }
        }
    }
    
    updateCartCount();
    renderCart();
};

const removeItem = (index) => {
    const itemIndex = parseInt(index);
    if (itemIndex >= 0 && itemIndex < cart.length) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1); 
        updateCartCount();
        renderCart(); 
        showCustomNotification(`${itemName} dihapus dari keranjang.`);
    }
}


// =======================================================
// FUNGSI CHECKOUT
// =======================================================

document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama')?.value || '';
    const nomeja = document.getElementById('nomeja')?.value || ''; 

    if (!nama || !nomeja) {
        showCustomNotification('Harap isi Nama dan Nomor Meja.');
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById('receipt-date').textContent = new Date().toLocaleString('id-ID');
    document.getElementById('receipt-nama').textContent = nama;
    document.getElementById('receipt-meja').textContent = nomeja; 

    const receiptItemsElement = document.getElementById('receipt-items');
    if (receiptItemsElement) {
        receiptItemsElement.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const li = document.createElement('li');
            li.textContent = `${item.name} (${item.quantity}x) - ${formatRupiah(itemTotal)}`;
            receiptItemsElement.appendChild(li);
        });
    }
    
    document.getElementById('receipt-total').textContent = formatRupiah(total);

    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('receipt').style.display = 'block';

    cart = [];
    updateCartCount();
    
    showCustomNotification(`Pesanan berhasil diproses! Silakan scan QRIS.`);
});


// =======================================================
// FUNGSI UNDUH STRUK
// =======================================================

const downloadReceipt = () => {
    if (typeof html2canvas === 'undefined' || typeof saveAs === 'undefined') {
        showCustomNotification('Error: Library Unduh Struk belum dimuat.');
        return;
    }

    const receiptElement = document.getElementById('receipt');
    
    if (!receiptElement) {
        showCustomNotification('Error: Elemen struk tidak ditemukan.');
        return;
    }

    html2canvas(receiptElement, {
        scale: 2, 
        logging: false,
        backgroundColor: '#1E1E1E' 
    }).then(canvas => {
        canvas.toBlob(function(blob) {
            saveAs(blob, `Struk_WinrazCoffee_${Date.now()}.jpg`);
            showCustomNotification('Struk berhasil diunduh sebagai JPG!');
        }, 'image/jpeg', 0.9); 
    }).catch(error => {
        console.error('Error saat mengunduh struk:', error);
        showCustomNotification('Gagal mengunduh struk.');
    });
};


// =======================================================
// FUNGSI NAVABR SCROLL
// =======================================================

const handleScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return; 
    
    // Cek keberadaan elemen 'home' untuk membedakan index.html dan menu.html
    const isHomePage = document.getElementById('home'); 

    if (isHomePage) {
        // Logika Transparansi di index.html
        if (window.scrollY > 50) { 
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    } else {
         // Logika Solid di menu.html
         navbar.classList.add('navbar-scrolled');
    }
};


// =======================================================
// INISIALISASI & DELEGASI EVENT
// =======================================================

const initEventListeners = () => {
    // 1. Listener untuk tombol 'add-to-cart'
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.menu-item');
            if (itemElement) {
                addItemToCart(itemElement);
            }
        });
    });

    // 2. Listener DELEGASI untuk tombol keranjang (+, -, x)
    const cartModal = document.getElementById('cart-modal');
    if(cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('qty-btn')) {
                const index = e.target.dataset.index;
                const action = e.target.dataset.action;
                updateQuantity(index, action);
            }
            
            if (e.target && e.target.classList.contains('remove-item')) {
                const index = e.target.dataset.index;
                removeItem(index);
            }
        });

        const closeButton = document.querySelector('#cart-modal .close-button');
        if (closeButton) {
            closeButton.addEventListener('click', toggleCart);
        }
    }
    
    // 3. Listener untuk tombol checkout
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', showCheckout);
    }
    
    // 4. Listener untuk efek scroll navbar
    window.addEventListener('scroll', handleScroll);
    
    // Panggil sekali saat dimuat untuk menyesuaikan status awal navbar
    handleScroll();
};


// Panggil fungsi inisialisasi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initEventListeners(); 
});