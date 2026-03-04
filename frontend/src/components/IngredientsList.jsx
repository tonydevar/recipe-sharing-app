import './IngredientsList.css'

function scaleAmount(amount, ratio) {
  if (!amount || amount.trim() === '') return ''
  const num = parseFloat(amount)
  if (isNaN(num)) return amount  // non-numeric amounts (e.g. "to taste") pass through
  const scaled = num * ratio
  // Round to at most 2 decimal places; strip trailing zeros
  return parseFloat(scaled.toFixed(2)).toString()
}

export default function IngredientsList({ ingredients, baseServings, currentServings }) {
  const ratio = baseServings > 0 ? currentServings / baseServings : 1

  return (
    <ul className="ingredients-list">
      {ingredients.map((ing, idx) => (
        <li key={idx} className="ingredients-list__item">
          <span className="ingredients-list__amount">
            {scaleAmount(ing.amount, ratio)}
          </span>
          {ing.unit && (
            <span className="ingredients-list__unit">{ing.unit}</span>
          )}
          <span className="ingredients-list__name">{ing.name}</span>
        </li>
      ))}
    </ul>
  )
}
