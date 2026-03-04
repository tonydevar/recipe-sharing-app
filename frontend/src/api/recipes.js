const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    // express-validator returns { errors: [{msg, ...}] }; pass array as JSON string
    if (body.errors && Array.isArray(body.errors)) {
      throw new Error(JSON.stringify(body.errors))
    }
    const message = body.error || body.message || `HTTP ${res.status}`
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

export function getRecipes(params = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'All') query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return fetch(`${BASE_URL}/api/recipes${qs}`).then(handleResponse)
}

export function getRecipe(id) {
  return fetch(`${BASE_URL}/api/recipes/${id}`).then(handleResponse)
}

export function createRecipe(data) {
  return fetch(`${BASE_URL}/api/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function updateRecipe(id, data) {
  return fetch(`${BASE_URL}/api/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function deleteRecipe(id) {
  return fetch(`${BASE_URL}/api/recipes/${id}`, {
    method: 'DELETE',
  }).then(handleResponse)
}
