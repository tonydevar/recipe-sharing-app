import { useNavigate, Link } from 'react-router-dom'
import { createRecipe } from '../api/recipes.js'
import RecipeForm from '../components/RecipeForm.jsx'
import './FormPage.css'

export default function AddRecipePage() {
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    const created = await createRecipe(payload)
    navigate(`/recipes/${created.id}`)
  }

  return (
    <div className="form-page">
      <Link to="/" className="form-page__back">← Back to recipes</Link>
      <h1 className="form-page__title">Add New Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Create Recipe" />
    </div>
  )
}
