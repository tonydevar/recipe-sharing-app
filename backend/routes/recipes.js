const express = require('express');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/recipes.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readRecipes() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeRecipes(recipes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// Validation rules
// ---------------------------------------------------------------------------

const recipeValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('title must be between 3 and 100 characters'),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('ingredients must be a non-empty array'),

  body('steps')
    .isArray({ min: 1 })
    .withMessage('steps must be a non-empty array'),
];

// ---------------------------------------------------------------------------
// GET /api/recipes
// Optional query params: ?category=Dinner  ?search=pasta
// ---------------------------------------------------------------------------

router.get('/', (req, res) => {
  let recipes = readRecipes();

  const { category, search } = req.query;

  if (category) {
    const cat = category.toLowerCase();
    recipes = recipes.filter((r) => r.category.toLowerCase() === cat);
  }

  if (search) {
    const term = search.toLowerCase();
    recipes = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
    );
  }

  res.json(recipes);
});

// ---------------------------------------------------------------------------
// GET /api/recipes/:id
// ---------------------------------------------------------------------------

router.get('/:id', (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find((r) => r.id === req.params.id);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  res.json(recipe);
});

// ---------------------------------------------------------------------------
// POST /api/recipes
// ---------------------------------------------------------------------------

router.post(
  '/',
  recipeValidationRules,
  handleValidationErrors,
  (req, res) => {
    const recipes = readRecipes();

    const now = new Date().toISOString();
    const newRecipe = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || '',
      cookTime: req.body.cookTime || null,
      difficulty: req.body.difficulty || '',
      servings: req.body.servings || null,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      createdAt: now,
      updatedAt: now,
    };

    recipes.push(newRecipe);
    writeRecipes(recipes);

    res.status(201).json(newRecipe);
  }
);

// ---------------------------------------------------------------------------
// PUT /api/recipes/:id
// ---------------------------------------------------------------------------

router.put(
  '/:id',
  recipeValidationRules,
  handleValidationErrors,
  (req, res) => {
    const recipes = readRecipes();
    const index = recipes.findIndex((r) => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const existing = recipes[index];
    const updated = {
      ...existing,
      title: req.body.title,
      description: req.body.description !== undefined ? req.body.description : existing.description,
      category: req.body.category !== undefined ? req.body.category : existing.category,
      cookTime: req.body.cookTime !== undefined ? req.body.cookTime : existing.cookTime,
      difficulty: req.body.difficulty !== undefined ? req.body.difficulty : existing.difficulty,
      servings: req.body.servings !== undefined ? req.body.servings : existing.servings,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      updatedAt: new Date().toISOString(),
    };

    recipes[index] = updated;
    writeRecipes(recipes);

    res.json(updated);
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/recipes/:id
// ---------------------------------------------------------------------------

router.delete('/:id', (req, res) => {
  const recipes = readRecipes();
  const index = recipes.findIndex((r) => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  recipes.splice(index, 1);
  writeRecipes(recipes);

  res.status(204).send();
});

module.exports = router;
