const animalList = document.getElementById('animal-list');
const addAnimalForm = document.getElementById('add-animal-form');
const editAnimalForm = document.getElementById('edit-animal-form');
const modal = document.getElementById('edit-animal-modal');
const closeModalBtn = document.querySelector('.close');
let editingAnimalId = null;

// Fetch all animals from the server and display them
async function fetchAnimals() {
    const response = await fetch('/api/animals');
    const animals = await response.json();
    displayAnimals(animals);
}

// Display animals in a list
function displayAnimals(animals) {
    animalList.innerHTML = '';
    animals.forEach(animal => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${animal.name} (${animal.gender})</h3>
            <p>${animal.breed}, ${animal.age} лет</p>
            <p>${animal.description}</p>
            <p>Тип: ${animal.type}</p>
            <img src="${animal.photo_url}" alt="${animal.name}" width="100">
            <button onclick="deleteAnimal(${animal.id})">Удалить</button>
            <button onclick="openEditModal(${animal.id})">Редактировать</button>
            <hr>
        `;
        animalList.appendChild(div);
    });
}

// Delete animal
async function deleteAnimal(id) {
    await fetch(`/api/animals/${id}`, { method: 'DELETE' });
    fetchAnimals();
}

// Open modal for editing animal
async function openEditModal(id) {
    editingAnimalId = id;
    const animal = await getAnimalById(id);

    document.getElementById('edit-name').value = animal.name;
    document.getElementById('edit-breed').value = animal.breed;
    document.getElementById('edit-age').value = animal.age;
    document.getElementById('edit-gender').value = animal.gender;
    document.getElementById('edit-description').value = animal.description;
    document.getElementById('edit-photo_url').value = animal.photo_url;
    document.getElementById('edit-type').value = animal.type;

    modal.style.display = "block";
}

// Close modal
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// Get animal by ID
async function getAnimalById(id) {
    const response = await fetch('/api/animals');
    const animals = await response.json();
    return animals.find(animal => animal.id === id);
}

// Save edited animal
editAnimalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedAnimal = {
        name: document.getElementById('edit-name').value,
        breed: document.getElementById('edit-breed').value,
        age: parseInt(document.getElementById('edit-age').value),
        gender: document.getElementById('edit-gender').value,
        description: document.getElementById('edit-description').value,
        photo_url: document.getElementById('edit-photo_url').value,
        type: document.getElementById('edit-type').value, // тип животного
    };

    await fetch(`/api/animals/${editingAnimalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnimal)
    });

    modal.style.display = "none";
    fetchAnimals();
});

// Add new animal
addAnimalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newAnimal = {
        name: document.getElementById('name').value,
        breed: document.getElementById('breed').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        description: document.getElementById('description').value,
        photo_url: document.getElementById('photo_url').value,
        type: document.getElementById('type').value, // тип животного
    };

    await fetch('/api/animals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAnimal)
    });

    fetchAnimals();
});

// Initialize animal list on page load
fetchAnimals();
