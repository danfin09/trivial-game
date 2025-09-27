// 1. Use require instead of import
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todasl as preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(questions.map(q => q.category))];
  res.json(categories);
});


app.get('/api/question', (req, res) => {
  const { category } = req.query;
  
  let filteredQuestions = questions;
  
  if (category) {
    filteredQuestions = questions.filter(question => 
      question.category.toLowerCase() === category.toLowerCase()
    );
    
    if (filteredQuestions.length === 0) {
      return res.status(404).json({ 
        error: `No se encontraron preguntas para la categoría: ${category}` 
      });
    }
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const randomQuestion = filteredQuestions[randomIndex];

  res.json(randomQuestion);
});

// Endpoint para obtener categorías únicas
app.get('/api/categories', (req, res) => {
  const uniqueCategories = [...new Set(questions.map(q => q.category))];
  res.json(uniqueCategories);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
})