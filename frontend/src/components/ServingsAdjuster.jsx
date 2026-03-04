import './ServingsAdjuster.css'

export default function ServingsAdjuster({ value, onChange }) {
  function decrement() {
    if (value > 1) onChange(value - 1)
  }
  function increment() {
    onChange(value + 1)
  }

  return (
    <div className="servings-adjuster">
      <span className="servings-adjuster__label">Servings</span>
      <div className="servings-adjuster__controls">
        <button
          className="servings-adjuster__btn"
          onClick={decrement}
          disabled={value <= 1}
          aria-label="Decrease servings"
        >
          −
        </button>
        <span className="servings-adjuster__value" aria-live="polite">
          {value}
        </span>
        <button
          className="servings-adjuster__btn"
          onClick={increment}
          aria-label="Increase servings"
        >
          +
        </button>
      </div>
    </div>
  )
}
