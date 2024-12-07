const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");  // Добавляем CORS

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Обработчик для главной страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Обработчик для получения списка животных
app.get("/api/animals", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "db", "db.json"),
    "utf8",
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.json(JSON.parse(data).goods);
    }
  );
});

// Обработчик для получения конкретного животного по ID
app.get("/api/animals/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(
    path.join(__dirname, "public", "db", "db.json"),
    "utf8",
    (err, data) => {
      if (err) return res.status(500).send(err);
      const db = JSON.parse(data);
      const animal = db.goods.find((animal) => animal.id == id);
      if (animal) {
        res.json(animal);
      } else {
        res.status(404).send("Animal not found");
      }
    }
  );
});

// Обработчик для добавления новых животных
app.post("/api/animals", (req, res) => {
  const newAnimal = { id: Date.now(), ...req.body };
  fs.readFile(
    path.join(__dirname, "public", "db", "db.json"),
    "utf8",
    (err, data) => {
      if (err) return res.status(500).send(err);
      const db = JSON.parse(data);
      db.goods.push(newAnimal);
      fs.writeFile(
        path.join(__dirname, "public", "db", "db.json"),
        JSON.stringify(db, null, 2),
        (err) => {
          if (err) return res.status(500).send(err);
          res.status(201).json(newAnimal);
        }
      );
    }
  );
});

// Обработчик для удаления животного
app.delete("/api/animals/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(
    path.join(__dirname, "public", "db", "db.json"),
    "utf8",
    (err, data) => {
      if (err) return res.status(500).send(err);
      const db = JSON.parse(data);
      db.goods = db.goods.filter((animal) => animal.id != id);
      fs.writeFile(
        path.join(__dirname, "public", "db", "db.json"),
        JSON.stringify(db, null, 2),
        (err) => {
          if (err) return res.status(500).send(err);
          res.sendStatus(204);
        }
      );
    }
  );
});

// Обработчик для обновления животного
app.put("/api/animals/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(
    path.join(__dirname, "public", "db", "db.json"),
    "utf8",
    (err, data) => {
      if (err) return res.status(500).send(err);
      const db = JSON.parse(data);
      const index = db.goods.findIndex((animal) => animal.id == id);
      if (index !== -1) {
        db.goods[index] = { id: Number(id), ...req.body }; // Ensure ID remains the same
        fs.writeFile(
          path.join(__dirname, "public", "db", "db.json"),
          JSON.stringify(db, null, 2),
          (err) => {
            if (err) return res.status(500).send(err);
            res.json(db.goods[index]);
          }
        );
      } else {
        res.status(404).send("Animal not found");
      }
    }
  );
});

// Обработчик для получения списка контактов
app.get("/api/contacts", (req, res) => {
  fs.readFile(path.join(__dirname, "public", "db", "dbcontact.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(JSON.parse(data).contacts);
  });
});

// Обработчик для добавления нового контакта
app.post("/api/contacts", (req, res) => {
  const newContact = { id: Date.now(), ...req.body };

  fs.readFile(path.join(__dirname, "public", "db", "dbcontact.json"), "utf8", (err, data) => {
    if (err) return res.status(500).send(err);

    const db = JSON.parse(data);
    db.contacts.push(newContact);

    fs.writeFile(path.join(__dirname, "public", "db", "dbcontact.json"), JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(newContact);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
