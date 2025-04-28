const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const resultsRouter = require('./routes/results');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/results', resultsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Hangman Game API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
