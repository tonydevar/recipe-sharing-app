import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getRecipe, deleteRecipe } from '../api/recipes.js'
import ServingsAdjuster from '../components/ServingsAdjuster.jsx'
import IngredientsList from '../components/IngredientsList.jsx'
import StepsList from '../components/StepsList.jsx'
import './RecipeDetailPage.css'

const DIFFICULTY_CLASS = {
  Easy: 'badge--easy',
  Medium: 'badge--medium',
  Hard: 'badge--hard',
}

const CATEGORY_EMOJI = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍽️',
  Dessert: '🍰',
  Snack: '🥨',
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [currentServings, setCurrentServings] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getRecipe(id)
      .then((data) => {
        setRecipe(data)
        setCurrentServings(data.servings)
      })
      .catch((err) => {
        if (err.message === 'Recipe not found' || err.message.includes('404')) {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteRecipe(id)
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="detail-page__status">
        Loading recipe…
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="detail-page__status detail-page__status--notfound">
        <p>Recipe not found.</p>
        <Link to="/">← Back to recipes</Link>
      </div>
    )
  }

  if (!recipe) return null

  const emoji = CATEGORY_EMOJI[recipe.category] || '🍴'
  const diffClass = DIFFICULTY_CLASS[recipe.difficulty] || ''

  return (
    <article className="detail-page">
      {/* ── Back nav ── */}
      <Link to="/" className="detail-page__back">← Back to recipes</Link>

      {/* ── Hero ── */}
      <div className="detail-page__hero" aria-hidden="true">
        {emoji}
      </div>

      {/* ── Header ── */}
      <header className="detail-page__header">
        <h1 className="detail-page__title">{recipe.title}</h1>

        <div className="detail-page__badges">
          <span className="badge">{recipe.category}</span>
          <span className={`badge ${diffClass}`}>{recipe.difficulty}</span>
        </div>

        <div className="detail-page__meta">
          <span>⏱ {recipe.cookTime} min</span>
          <span>👤 {recipe.servings} base servings</span>
        </div>

        {recipe.description && (
          <p className="detail-page__description">{recipe.description}</p>
        )}

        {/* ── Action buttons ── */}
        <div className="detail-page__actions">
          <Link to={`/recipes/${id}/edit`} className="btn btn--secondary">
            ✏️ Edit
          </Link>
          <button
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : '🗑 Delete'}
          </button>
        </div>

        {deleteError && (
          <p className="detail-page__error">Delete failed: {deleteError}</p>
        )}
      </header>

      {/* ── Ingredients ── */}
      <section className="detail-page__section">
        <div className="detail-page__section-header">
          <h2>Ingredients</h2>
          <ServingsAdjuster value={currentServings} onChange={setCurrentServings} />
        </div>
        <IngredientsList
          ingredients={recipe.ingredients}
          baseServings={recipe.servings}
          currentServings={currentServings}
        />
      </section>

      {/* ── Steps ── */}
      <section className="detail-page__section">
        <h2>Instructions</h2>
        <StepsList steps={recipe.steps} />
      </section>
    </article>
  )
}
