const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    const json = await res.json()
    return json.success ? json.data : null
  } catch (e) {
    console.warn('API request failed:', path, e.message)
    return null
  }
}

export async function fetchIndices() {
  return request('/api/indices')
}

export async function fetchStocks({ page = 1, size = 30, sort = 'f3', order = '0', market } = {}) {
  const params = new URLSearchParams({ page, size, sort, order })
  if (market) params.set('market', market)
  return request(`/api/stocks?${params}`)
}

export async function fetchFunds({ page = 1, size = 30, type = '' } = {}) {
  const params = new URLSearchParams({ page, size, type })
  return request(`/api/funds?${params}`)
}

export async function fetchSectors() {
  return request('/api/sectors')
}

export async function fetchStockDetail(code) {
  return request(`/api/stock/${code}`)
}

export async function fetchFundDetail(code) {
  return request(`/api/fund/${code}`)
}

export async function fetchFundHoldings(code) {
  return request(`/api/fund-holdings/${code}`)
}

export async function searchStock(query) {
  return request(`/api/search?q=${encodeURIComponent(query)}`)
}
