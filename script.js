
const sheetID = "1gYBzv3UDQ2i1vSvsJcZJCxxmwxz409FpieLlEQ6ySKY";
const sheetName = "Sheet1";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

fetch(sheetURL)
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split("\n").slice(1);
    const products = rows.map(row => {
      const [name, image, link, tags] = row.split(",");
      return { name, image, link, tags };
    });

    window.allProducts = products;
    displayProducts(products);
  });

function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach(product => {
    if (!product.name || !product.link || !product.image) return;
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <a href="${product.link}" target="_blank">Buy Now</a>
    `;
    productList.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const filtered = window.allProducts.filter(product =>
    product.name.toLowerCase().includes(searchText) ||
    (product.tags && product.tags.toLowerCase().includes(searchText))
  );
  displayProducts(filtered);
});
