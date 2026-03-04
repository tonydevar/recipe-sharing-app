import { useState, useEffect, useMemo } from 'react'
import { getRecipes } from '../api/recipes.js'
import RecipeCard from '../components/RecipeCard.jsx'
import CategoryFilterBar from '../components/CategoryFilterBar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import './HomePage.css'

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    getRecipes()
      .then((data) => {
        setRecipes(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = recipes

    if (activeCategory !== 'All') {
      result = result.filter(
        (r) => r.category.toLowerCase() === activeCategory.toLowerCase(),
      )
    }

    if (searchQuery.trim()) {
      const term = searchQuery.trim().toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(term)),
      )
    }

    return result
  }, [recipes, activeCategory, searchQuery])

  return (
    <div className="home-page">
      <div className="home-page__controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilterBar activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      {loading && (
        <div className="home-page__status">Loading recipes…</div>
      )}

      {error && (
        <div className="home-page__status home-page__status--error">
          Failed to load recipes: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="home-page__status">
          No recipes found. Try a different search or category.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
