import { Link } from 'react-router-dom'
import './RecipeCard.css'

const DIFFICULTY_EMOJI = {
  Easy: '🟢',
  Medium: '🟠',
  Hard: '🔴',
}

const CATEGORY_EMOJI = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍽️',
  Dessert: '🍰',
  Snack: '🥨',
}

export default function RecipeCard({ recipe }) {
  const { id, title, category, cookTime, difficulty, servings } = recipe
  const emoji = CATEGORY_EMOJI[category] || '🍴'
  const difficultyEmoji = DIFFICULTY_EMOJI[difficulty] || ''

  return (
    <Link to={`/recipes/${id}`} className="recipe-card">
      <div className="recipe-card__image" aria-hidden="true">
        {emoji}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{title}</h3>
        <div className="recipe-card__meta">
          <span className="recipe-card__category">{category}</span>
          <span className={`recipe-card__difficulty recipe-card__difficulty--${difficulty?.toLowerCase()}`}>
            {difficultyEmoji} {difficulty}
          </span>
        </div>
        <div className="recipe-card__footer">
          <span className="recipe-card__time">⏱ {cookTime} min</span>
          <span className="recipe-card__servings">👤 {servings} servings</span>
        </div>
      </div>
    </Link>
  )
}
