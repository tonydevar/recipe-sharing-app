import { useState } from 'react'
import './RecipeForm.css'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const EMPTY_INGREDIENT = { amount: '', unit: '', name: '' }
const EMPTY_STEP = ''

function validate(fields) {
  const errors = {}

  if (!fields.title || fields.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.'
  } else if (fields.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or fewer.'
  }

  const hasIngredient = fields.ingredients.some((i) => i.name.trim() !== '')
  if (!hasIngredient) {
    errors.ingredients = 'Add at least one ingredient with a name.'
  }

  const hasStep = fields.steps.some((s) => s.trim() !== '')
  if (!hasStep) {
    errors.steps = 'Add at least one step.'
  }

  return errors
}

export default function RecipeForm({ initialValues, onSubmit, submitLabel = 'Save Recipe' }) {
  const [fields, setFields] = useState({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    category: initialValues?.category ?? CATEGORIES[0],
    cookTime: initialValues?.cookTime ?? '',
    difficulty: initialValues?.difficulty ?? DIFFICULTIES[0],
    servings: initialValues?.servings ?? '',
    ingredients: initialValues?.ingredients?.length
      ? initialValues.ingredients
      : [{ ...EMPTY_INGREDIENT }],
    steps: initialValues?.steps?.length ? initialValues.steps : [EMPTY_STEP],
  })

  const [clientErrors, setClientErrors] = useState({})
  const [serverErrors, setServerErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // ── Simple field update ──
  function setField(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  // ── Ingredients ──
  function setIngredient(idx, key, value) {
    setFields((prev) => {
      const updated = prev.ingredients.map((ing, i) =>
        i === idx ? { ...ing, [key]: value } : ing,
      )
      return { ...prev, ingredients: updated }
    })
  }

  function addIngredient() {
    setFields((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...EMPTY_INGREDIENT }],
    }))
  }

  function removeIngredient(idx) {
    setFields((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }))
  }

  // ── Steps ──
  function setStep(idx, value) {
    setFields((prev) => {
      const updated = prev.steps.map((s, i) => (i === idx ? value : s))
      return { ...prev, steps: updated }
    })
  }

  function addStep() {
    setFields((prev) => ({ ...prev, steps: [...prev.steps, EMPTY_STEP] }))
  }

  function removeStep(idx) {
    setFields((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx),
    }))
  }

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault()
    setServerErrors([])

    const errors = validate(fields)
    setClientErrors(errors)
    if (Object.keys(errors).length > 0) return

    // Clean up: drop empty steps / ingredients without name
    const payload = {
      ...fields,
      title: fields.title.trim(),
      description: fields.description.trim(),
      cookTime: fields.cookTime !== '' ? Number(fields.cookTime) : null,
      servings: fields.servings !== '' ? Number(fields.servings) : null,
      ingredients: fields.ingredients.filter((i) => i.name.trim() !== ''),
      steps: fields.steps.filter((s) => s.trim() !== ''),
    }

    setSubmitting(true)
    try {
      await onSubmit(payload)
    } catch (err) {
      // Try to parse server validation errors array
      try {
        const body = JSON.parse(err.message)
        if (Array.isArray(body)) {
          setServerErrors(body.map((e) => e.msg || e.message || String(e)))
        } else {
          setServerErrors([err.message])
        }
      } catch {
        setServerErrors([err.message])
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      {/* ── Server errors ── */}
      {serverErrors.length > 0 && (
        <div className="recipe-form__server-errors" role="alert">
          <strong>Could not save recipe:</strong>
          <ul>
            {serverErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Title ── */}
      <div className={`form-group${clientErrors.title ? ' form-group--error' : ''}`}>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={fields.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="e.g. Spaghetti Carbonara"
          maxLength={100}
        />
        {clientErrors.title && <p className="form-error">{clientErrors.title}</p>}
      </div>

      {/* ── Description ── */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={fields.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="A short description of the recipe…"
          rows={3}
          maxLength={500}
        />
      </div>

      {/* ── Category + Difficulty row ── */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={fields.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={fields.difficulty}
            onChange={(e) => setField('difficulty', e.target.value)}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Cook time + Servings row ── */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cookTime">Cook Time (minutes)</label>
          <input
            id="cookTime"
            type="number"
            min={1}
            max={1440}
            value={fields.cookTime}
            onChange={(e) => setField('cookTime', e.target.value)}
            placeholder="e.g. 30"
          />
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            id="servings"
            type="number"
            min={1}
            max={100}
            value={fields.servings}
            onChange={(e) => setField('servings', e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      {/* ── Ingredients ── */}
      <fieldset className={`form-fieldset${clientErrors.ingredients ? ' form-fieldset--error' : ''}`}>
        <legend>Ingredients *</legend>
        {clientErrors.ingredients && (
          <p className="form-error">{clientErrors.ingredients}</p>
        )}
        <div className="ingredient-rows">
          {fields.ingredients.map((ing, idx) => (
            <div key={idx} className="ingredient-row">
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => setIngredient(idx, 'amount', e.target.value)}
                placeholder="Amount"
                className="ingredient-row__amount"
                aria-label={`Ingredient ${idx + 1} amount`}
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => setIngredient(idx, 'unit', e.target.value)}
                placeholder="Unit"
                className="ingredient-row__unit"
                aria-label={`Ingredient ${idx + 1} unit`}
              />
              <input
                type="text"
                value={ing.name}
                onChange={(e) => setIngredient(idx, 'name', e.target.value)}
                placeholder="Name *"
                className="ingredient-row__name"
                aria-label={`Ingredient ${idx + 1} name`}
              />
              <button
                type="button"
                className="btn-icon btn-icon--remove"
                onClick={() => removeIngredient(idx)}
                disabled={fields.ingredients.length <= 1}
                aria-label={`Remove ingredient ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn-add" onClick={addIngredient}>
          + Add ingredient
        </button>
      </fieldset>

      {/* ── Steps ── */}
      <fieldset className={`form-fieldset${clientErrors.steps ? ' form-fieldset--error' : ''}`}>
        <legend>Steps *</legend>
        {clientErrors.steps && (
          <p className="form-error">{clientErrors.steps}</p>
        )}
        <div className="step-rows">
          {fields.steps.map((step, idx) => (
            <div key={idx} className="step-row">
              <span className="step-row__number">{idx + 1}</span>
              <textarea
                value={step}
                onChange={(e) => setStep(idx, e.target.value)}
                placeholder={`Step ${idx + 1}…`}
                rows={2}
                aria-label={`Step ${idx + 1}`}
              />
              <button
                type="button"
                className="btn-icon btn-icon--remove"
                onClick={() => removeStep(idx)}
                disabled={fields.steps.length <= 1}
                aria-label={`Remove step ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn-add" onClick={addStep}>
          + Add step
        </button>
      </fieldset>

      {/* ── Submit ── */}
      <div className="recipe-form__footer">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
