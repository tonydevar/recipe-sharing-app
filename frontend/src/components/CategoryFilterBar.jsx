import './CategoryFilterBar.css'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function CategoryFilterBar({ activeCategory, onChange }) {
  return (
    <div className="category-filter" role="toolbar" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`category-filter__btn${activeCategory === cat ? ' category-filter__btn--active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
