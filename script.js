// Replace with your published Google Sheets CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv';

let allProducts = [];

// Fetch data from Google Sheets
async function fetchData() {
    try {
        const response = await fetch(SHEET_URL);
        const csvData = await response.text();
        parseCSV(csvData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Parse CSV data
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    allProducts = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const product = {};
            for (let j = 0; j < headers.length; j++) {
                product[headers[j].trim()] = values[j].trim();
            }
            allProducts.push(product);
        }
    }
    
    displayPlaylists();
}

// Display all playlists/categories
function displayPlaylists() {
    const playlistsSection = document.getElementById('playlists');
    playlistsSection.innerHTML = '<h2>Collections</h2>';
    
    // Get unique playlists
    const playlists = [...new Set(allProducts.map(product => product.Playlist))];
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist';
        playlistElement.innerHTML = `
            <h3>${playlist}</h3>
        `;
        playlistElement.addEventListener('click', () => displayProducts(playlist));
        playlistsSection.appendChild(playlistElement);
    });
}

// Display products in a playlist
function displayProducts(playlist) {
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = `<h2>${playlist}</h2><div class="products-grid"></div>`;
    
    const productsGrid = productsSection.querySelector('.products-grid');
    const filteredProducts = allProducts.filter(product => product.Playlist === playlist);
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.ImageURL}" alt="${product.ProductName}">
            <h3>${product.ProductName}</h3>
            <a href="${product.ProductLink}" target="_blank">View Product</a>
        `;
        productsGrid.appendChild(productElement);
    });
}

// Search functionality
document.getElementById('searchButton').addEventListener('click', searchProducts);
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') searchProducts();
});

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = `<h2>Search Results</h2><div class="products-grid"></div>`;
    
    const productsGrid = productsSection.querySelector('.products-grid');
    const filteredProducts = allProducts.filter(product => 
        product.ProductName.toLowerCase().includes(searchTerm) || 
        product.Playlist.toLowerCase().includes(searchTerm));
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.ImageURL}" alt="${product.ProductName}">
            <h3>${product.ProductName}</h3>
            <p>Collection: ${product.Playlist}</p>
            <a href="${product.ProductLink}" target="_blank">View Product</a>
        `;
        productsGrid.appendChild(productElement);
    });
}

// Initialize
fetchData();
