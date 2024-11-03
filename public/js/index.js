      let currentPage = 1;
      const itemsPerPage = 9; // Максимум 9 карточек на странице
      let animals = [];

      // Функция для загрузки данных из db.json
      async function fetchAnimals() {
        const response = await fetch("./db/db.json");
        const data = await response.json();
        animals = data.goods;
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
        const currentAnimals = animals.slice(startIndex, endIndex);

        currentAnimals.forEach((animal) => {
          const card = document.createElement("div");
          card.className = "animal-card";
          card.innerHTML = `
                    <img src="${animal.photo_url}" alt="${animal.name}" />
                    <div class="animal-info">
                        <h2>${animal.name} (${animal.gender})</h2>
                        <p class="breed">${animal.breed}</p>
                        <p class="age">${animal.age} лет</p>
                        <p>${animal.description}</p>
                        <p><strong>Статус:</strong> ${
                          animal.adopted
                            ? "Уже принят"
                            : "Доступен для усыновления"
                        }</p>
                    </div>
                `;
          animalCardsContainer.appendChild(card);
        });

        updatePagination();
      }

      // Функция для обновления состояния кнопок пагинации
      function updatePagination() {
        const totalPages = Math.ceil(animals.length / itemsPerPage);
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
        const totalPages = Math.ceil(animals.length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          displayAnimals();
        }
      });

      // Основная функция
      async function main() {
        await fetchAnimals();
      }

      // Запуск функции после загрузки страницы
      window.onload = main;