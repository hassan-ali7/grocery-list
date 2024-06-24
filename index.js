// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('grocery-form');
    const input = document.getElementById('grocery-input');
    const quantityInput = document.getElementById('quantity-input');
    const unitInput = document.getElementById('unit-input');
    const categoryInput = document.getElementById('category-input');
    const list = document.getElementById('grocery-list');
    const clearBtn = document.getElementById('clear-list');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    const filterPurchased = document.getElementById('filter-purchased');
    const sortAlphaBtn = document.getElementById('sort-alpha');
    const sortCategoryBtn = document.getElementById('sort-category');

    let items = JSON.parse(localStorage.getItem('groceryList')) || [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemText = input.value.trim();
        const quantity = quantityInput.value.trim();
        const unit = unitInput.value;
        const category = categoryInput.value;
        if (itemText !== '' && quantity !== '') {
            const item = {
                text: itemText,
                quantity: quantity,
                unit: unit,
                category: category,
                purchased: false
            };
            items.push(item);
            addItemToList(item);
            saveList();
            form.reset();
        }
    });

    clearBtn.addEventListener('click', () => {
        list.innerHTML = '';
        items = [];
        localStorage.removeItem('groceryList');
    });

    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    searchInput.addEventListener('input', filterItems);
    filterCategory.addEventListener('change', filterItems);
    filterPurchased.addEventListener('change', filterItems);
    sortAlphaBtn.addEventListener('click', () => sortItems('alpha'));
    sortCategoryBtn.addEventListener('click', () => sortItems('category'));

    function addItemToList(item) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="grocery-item">
                <input type="checkbox" ${item.purchased ? 'checked' : ''}>
                <span class="item-text ${item.purchased ? 'purchased' : ''}">${item.text} (${item.quantity} ${item.unit}) - ${item.category}</span>
            </div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        list.appendChild(li);

        const checkbox = li.querySelector('input[type="checkbox"]');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const itemText = li.querySelector('.item-text');

        checkbox.addEventListener('change', () => {
            item.purchased = checkbox.checked;
            itemText.classList.toggle('purchased', item.purchased);
            saveList();
        });

        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit item:', item.text);
            const newQuantity = prompt('Edit quantity:', item.quantity);
            const newUnit = prompt('Edit unit:', item.unit);
            const newCategory = prompt('Edit category:', item.category);
            if (newText && newQuantity && newUnit && newCategory) {
                item.text = newText;
                item.quantity = newQuantity;
                item.unit = newUnit;
                item.category = newCategory;
                itemText.textContent = `${item.text} (${item.quantity} ${item.unit}) - ${item.category}`;
                saveList();
            }
        });

        deleteBtn.addEventListener('click', () => {
            items = items.filter(i => i !== item);
            list.removeChild(li);
            saveList();
        });
    }

    function saveList() {
        localStorage.setItem('groceryList', JSON.stringify(items));
    }

    function filterItems() {
        const searchText = searchInput.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const purchasedFilter = filterPurchased.value;

        list.innerHTML = '';
        items.filter(item => {
            const matchesSearchText = item.text.toLowerCase().includes(searchText);
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesPurchased = purchasedFilter === 'All' || 
                                      (purchasedFilter === 'Purchased' && item.purchased) || 
                                      (purchasedFilter === 'Not Purchased' && !item.purchased);

            return matchesSearchText && matchesCategory && matchesPurchased;
        }).forEach(addItemToList);
    }

    function sortItems(criteria) {
        if (criteria === 'alpha') {
            items.sort((a, b) => a.text.localeCompare(b.text));
        } else if (criteria === 'category') {
            items.sort((a, b) => a.category.localeCompare(b.category));
        }
        list.innerHTML = '';
        items.forEach(addItemToList);
        saveList();
    }

    items.forEach(addItemToList);
});
