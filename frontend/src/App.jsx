import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'
import AddRecipePage from './pages/AddRecipePage.jsx'
import EditRecipePage from './pages/EditRecipePage.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__logo">
            🍳 Recipe Sharing
          </Link>
          <nav className="app-header__nav">
            <Link to="/">Browse</Link>
            <Link to="/recipes/new">Add Recipe</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes/new" element={<AddRecipePage />} />
          <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}
