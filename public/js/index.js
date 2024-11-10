let currentPage = 1;
const itemsPerPage = 9; // Максимум 9 карточек на странице
let animals = [];
let filteredAnimals = [];

// Функция для загрузки данных из db.json
async function fetchAnimals() {
  const response = await fetch("./db/db.json");
  const data = await response.json();
  animals = data.goods;
  filteredAnimals = [...animals];  // Изначально все животные
  populateBreedFilter();           // Заполним фильтр пород
  displayAnimals();
}

// Функция для отображения карточек животных
function displayAnimals() {
  const animalCardsContainer = document.querySelector(".animal-cards");
  animalCardsContainer.innerHTML = "";

  // Определяем начальный и конечный индексы для текущей страницы
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Получаем животных для текущей страницы
  const currentAnimals = filteredAnimals.slice(startIndex, endIndex);

  currentAnimals.forEach((animal) => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `
                    <img src="${animal.photo_url}" alt="${animal.name}" />
                    <div class="animal-info">
                        <div class="animal-info-flexbox">
                        <h2>${animal.name} (${animal.gender})</h2>
                        <p class="age">${animal.age} лет</p></div>
                        <p class="breed">${animal.breed}</p>
                    </div>
                `;
    animalCardsContainer.appendChild(card);
  });

  updatePagination();
}

// Функция для обновления состояния кнопок пагинации
function updatePagination() {
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  document.getElementById(
    "page-info"
  ).innerText = `Страница ${currentPage} из ${totalPages}`;

  document.getElementById("prev").disabled = currentPage === 1;
  document.getElementById("next").disabled = currentPage === totalPages;
}

// Обработчики событий для кнопок пагинации
document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayAnimals();
  }
});

document.getElementById("next").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayAnimals();
  }
});

// Функция для фильтрации животных по всем критериям
function applyFilters() {
  let filtered = animals;

  // Фильтр по имени
  const searchValue = document.getElementById("search-name").value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(animal =>
      animal.name.toLowerCase().includes(searchValue)
    );
  }

  // Фильтр по породе
  const breedValue = document.getElementById("breed-filter").value;
  if (breedValue) {
    filtered = filtered.filter(animal => animal.breed === breedValue);
  }

  // Фильтр по виду
  const speciesValue = document.getElementById("species-filter").value;
  if (speciesValue) {
    filtered = filtered.filter(animal => animal.species === speciesValue);
  }

  // Фильтр по полу
  const genderValue = document.getElementById("gender-filter").value;
  if (genderValue) {
    filtered = filtered.filter(animal => animal.gender === genderValue);
  }

  // Сортировка по возрасту
  const ageSortValue = document.getElementById("age-sort").value;
  if (ageSortValue) {
    filtered = filtered.sort((a, b) =>
      ageSortValue === "asc" ? a.age - b.age : b.age - a.age
    );
  }

  filteredAnimals = filtered;
  currentPage = 1;  // Сброс на первую страницу
  displayAnimals();
}

// Функция для заполнения фильтра пород
function populateBreedFilter() {
  const breedSelect = document.getElementById("breed-filter");
  const breeds = [...new Set(animals.map(animal => animal.breed))];

  breeds.forEach(breed => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    breedSelect.appendChild(option);
  });
}

// Обработчик для всех фильтров
document.getElementById("search-name").addEventListener("input", applyFilters);
document.getElementById("breed-filter").addEventListener("change", applyFilters);
document.getElementById("species-filter").addEventListener("change", applyFilters);
document.getElementById("gender-filter").addEventListener("change", applyFilters);
document.getElementById("age-sort").addEventListener("change", applyFilters);

// Основная функция
async function main() {
  await fetchAnimals();
}

// Запуск функции после загрузки страницы
window.onload = main;