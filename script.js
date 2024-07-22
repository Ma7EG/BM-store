let items = [];
const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    displayCart();

    document.getElementById('searchBtn').addEventListener('click', filterItems);
    document.getElementById('filterBtn').addEventListener('click', filterItems);
    document.getElementById('sortBtn').addEventListener('click', sortItems);
});

function fetchItems() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            items = data;
            displayItems(items);
            loadCategories();
        })
        .catch(error => console.error('Error fetching items:', error));
}

function displayItems(items) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    items.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>$${item.price}</p>
            <button onclick="showDetails(${item.id})">Show Details</button>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function showDetails(id) {
    const item = items.find(p => p.id === id);
    Swal.fire({
        title: item.title,
        text: item.description,
        imageUrl: item.image,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: item.title,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Add to Cart',
        preConfirm: () => {
            addToCart(item.id);
        }
    });
}

function displayCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    cart.forEach(item => {
        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cartItem');
        const product = items.find(p => p.id === item.id);
        cartDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>Quantity: ${item.qty}</p>
            <p>Total: $${(product.price * item.qty).toFixed(2)}</p>
            <button onclick="increaseQty(${item.id})">+</button>
            <button onclick="decreaseQty(${item.id})">-</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartList.appendChild(cartDiv);
    });
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }
    displayCart();
}

function increaseQty(id) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.qty++;
        displayCart();
    }
}

function decreaseQty(id) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem && cartItem.qty > 1) {
        cartItem.qty--;
    } else {
        cart.splice(cart.indexOf(cartItem), 1);
    }
    displayCart();
}

function removeFromCart(id) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cart.splice(cart.indexOf(cartItem), 1);
        displayCart();
    }
}

function filterItems() {
    const search = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('category').value;
    let filteredItems = items.filter(item => item.title.toLowerCase().includes(search));
    if (category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    displayItems(filteredItems);
}

// function filterItems() {
//     const search = document.getElementById('search').value.toLowerCase();
//     const category = document.getElementById('category').value;
//     let filteredItems = items.filter(item => item.title.toLowerCase().includes(search));
//     if (category == 'all') {
//         filteredItems = filteredItems.filter(item => item.category === category);
//     }
//     displayItems(filteredItems);
// }

function sortItems() {
    const sortOrder = document.getElementById('priceSort').value;
    let sortedItems = [...items];
    if (sortOrder === 'asc') {
        sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
        sortedItems.sort((a, b) => b.price - a.price);
    }
    displayItems(sortedItems);
}

function loadCategories() {
    const category = document.getElementById('category');
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    uniqueCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        category.appendChild(option);
    });
}
