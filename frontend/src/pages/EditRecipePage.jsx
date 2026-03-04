import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getRecipe, updateRecipe } from '../api/recipes.js'
import RecipeForm from '../components/RecipeForm.jsx'
import './FormPage.css'

export default function EditRecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRecipe(id)
      .then((data) => setRecipe(data))
      .catch((err) => {
        if (err.message === 'Recipe not found' || err.message.includes('404')) {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(payload) {
    await updateRecipe(id, payload)
    navigate(`/recipes/${id}`)
  }

  if (loading) {
    return <div className="form-page__status">Loading recipe…</div>
  }

  if (notFound) {
    return (
      <div className="form-page__status form-page__status--notfound">
        <p>Recipe not found.</p>
        <Link to="/">← Back to recipes</Link>
      </div>
    )
  }

  return (
    <div className="form-page">
      <Link to={`/recipes/${id}`} className="form-page__back">← Back to recipe</Link>
      <h1 className="form-page__title">Edit Recipe</h1>
      <RecipeForm
        initialValues={recipe}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  )
}
