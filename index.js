// 1. Use require instead of import
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todasl as preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)
app.get('/api/question', (req, res) => {
  
try{
  const randomIndex = Math.floor(Math.random() * questions.length);
  const randomQuestion = questions[randomIndex];

  res.json(randomQuestion);
} catch (error) {
    console.error('Error al obtener la pregunta:', error);
    res.status(500).json({ error: 'Error al obtener la pregunta' });
  }
});

// Endpoint para obtener categorías únicas
app.get('/api/categories', (req, res) => {
 try {
  const categories = [...new set(questions.map(q=>q.category))];
  res.json(categories);
 } catch (error) {
  console.log("error al obtener categories", error);
  res.status(500).json({error:"error interno en el selvidor"})
 }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
})