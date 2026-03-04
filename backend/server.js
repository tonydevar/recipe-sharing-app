const express = require('express');
const cors = require('cors');

const recipesRouter = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use('/api/recipes', recipesRouter);

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Recipe API listening on http://localhost:${PORT}`);
});

module.exports = app;
