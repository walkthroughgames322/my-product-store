const sheetID = "1gYBzv3UDQ2i1vSvsJcZJCxxmwxz409FpieLlEQ6ySKY";
const sheetName = "Sheet1";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

let allProducts = [];
let categories = new Set();

fetch(sheetURL)
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.trim().split("\n").slice(1); // skip header row
    allProducts = rows.map(row => {
      // split by comma, but handle commas inside quotes if needed
      const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const name = parts[0]?.trim();
      const image = parts[1]?.trim();
      const link = parts[2]?.trim();
      const tags = parts[3]?.trim().toLowerCase() || "";
      if (tags) {
        tags.split(",").forEach(tag => categories.add(tag.trim()));
      }
      return { name, image, link, tags };
    });

    createPlaylistButtons();
    displayProducts(allProducts);
  });

function createPlaylistButtons() {
  const playlistsSection = document.getElementById("playlists");
  playlistsSection.innerHTML = "";

  // Add "All" button to show all products
  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = "playlist-btn active";
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    displayProducts(allProducts);
  });
  playlistsSection.appendChild(allBtn);

  // Create button for each unique category
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.className = "playlist-btn";
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filtered = allProducts.filter(product => product.tags.includes(category));
      displayProducts(filtered);
    });
    playlistsSection.appendChild(btn);
  });
}

// Highlight the active playlist button
function setActiveButton(activeBtn) {
  const buttons = document.querySelectorAll(".playlist-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

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

// Search filtering on currently displayed products and active category
document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  // Find currently active category
  const activeBtn = document.querySelector(".playlist-btn.active");
  const activeCategory = activeBtn ? activeBtn.textContent.toLowerCase() : "";

  let filtered;
  if (activeCategory && activeCategory !== "all") {
    filtered = allProducts.filter(product =>
      product.tags.includes(activeCategory) &&
      (product.name.toLowerCase().includes(searchText) ||
       product.tags.includes(searchText))
    );
  } else {
    filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.tags.includes(searchText)
    );
  }
  displayProducts(filtered);
});
