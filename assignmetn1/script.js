let products = [];
let cart = [];
let currentPage = 1;
const itemsPerPage = 4;

const fetchProducts = async () => {
    const url = `https://fakestoreapi.com/products`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Product data fetch failed');
        const data = await response.json();
        products = data;
        filterCategories(data);
        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const filterCategories = (data) => {
    const categorySelect = document.getElementById('category-select');
    const categories = [...new Set(data.map(product => product.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
};

const displayProducts = (filteredProducts) => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage; //0 //4 //6 //
    const endIndex = startIndex + itemsPerPage; //4 //8 //10 
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.category}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="viwDetails(${product.id})"> View Details</button>   
        `;
        productsContainer.appendChild(productElement);
    });

    displayPagination(filteredProducts.length);
};

const displayPagination = (totalItems) => {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            applyFilters();
        };
        paginationContainer.appendChild(button);
    }
};

const applyFilters = () => {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const category = document.getElementById('category-select').value;
    const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();

    let filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice && 
        (category ? product.category === category : true) &&
        product.title.toLowerCase().includes(searchQuery)
    );

    displayProducts(filteredProducts);
};

const sortProductsByPrice = () => {
    products.sort((a, b) => a.price - b.price);
    applyFilters();
};

const searchProducts = () => {
    applyFilters();
};

const addToCart = (id) => {
    const product = products.find(product => product.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    displayCart();
};

const removeFromCart = (id) => {
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
    }

    displayCart();
};

const displayCart = () => {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="details">
                <h4>${item.title}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItemElement);
    });

    const totalPriceElement = document.createElement('div');
    totalPriceElement.classList.add('total-price');
    totalPriceElement.innerHTML = `
        <h3>Total Price: $${totalPrice.toFixed(2)}</h3>
    `;
    cartContainer.appendChild(totalPriceElement);
};

fetchProducts();
