const animalList = document.getElementById('animal-list');
const addAnimalForm = document.getElementById('add-animal-form');

async function fetchAnimals() {
    const response = await fetch('/api/animals');
    const animals = await response.json();
    displayAnimals(animals);
}

function displayAnimals(animals) {
    animalList.innerHTML = '';
    animals.forEach(animal => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${animal.name} (${animal.gender})</h3>
            <p>${animal.breed}, ${animal.age} лет</p>
            <p>${animal.description}</p>
            <img src="${animal.photo_url}" alt="${animal.name}" width="100">
            <button onclick="deleteAnimal(${animal.id})">Удалить</button>
            <button onclick="editAnimal(${animal.id})">Редактировать</button>
            <hr>
        `;
        animalList.appendChild(div);
    });
}

async function deleteAnimal(id) {
    await fetch(`/api/animals/${id}`, { method: 'DELETE' });
    fetchAnimals();
}

function editAnimal(id) {
    const name = prompt("Новое имя:");
    const breed = prompt("Новая порода:");
    const age = prompt("Новый возраст:");
    const gender = prompt("Новый пол:");
    const description = prompt("Новое описание:");
    const photo_url = prompt("Новый URL фотографии:");

    const updatedAnimal = { name, breed, age: Number(age), gender, description, photo_url };
    fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnimal)
    }).then(fetchAnimals);
}

addAnimalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newAnimal = {
        name: document.getElementById('name').value,
        breed: document.getElementById('breed').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        description: document.getElementById('description').value,
        photo_url: document.getElementById('photo_url').value,
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

fetchAnimals();
