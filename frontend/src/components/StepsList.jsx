import './StepsList.css'

export default function StepsList({ steps }) {
  return (
    <ol className="steps-list">
      {steps.map((step, idx) => (
        <li key={idx} className="steps-list__item">
          <span className="steps-list__number">{idx + 1}</span>
          <p className="steps-list__text">{step}</p>
        </li>
      ))}
    </ol>
  )
}
