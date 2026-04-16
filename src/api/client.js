const API_BASE = import.meta.env.VITE_API_BASE || ''
const PROXY_LIST = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
]

// Fetch via CORS proxy with fallback
async function proxyFetch(url) {
  for (const mkProxy of PROXY_LIST) {
    try {
      const res = await fetch(mkProxy(url), { signal: AbortSignal.timeout(10000) })
      if (res.ok) return await res.text()
    } catch (e) { /* try next proxy */ }
  }
  return null
}

// Parse East Money JSONP-style response
function parseEM(text) {
  if (!text) return null
  try {
    const clean = text.replace(/^[^({]*\(/, '').replace(/\);?\s*$/, '')
    return JSON.parse(clean)
  } catch {
    try { return JSON.parse(text) } catch { return null }
  }
}

// Try backend API first (works with Express server)
async function request(path) {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const json = await res.json()
    if (json.success) return json.data
  } catch (e) { /* backend unavailable */ }
  return null
}

function formatVolume(vol) {
  if (!vol || vol === '-') return '--'
  const v = Number(vol)
  if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿'
  if (v >= 10000) return (v / 10000).toFixed(1) + '万'
  return String(v)
}

function formatCap(cap) {
  if (!cap || cap === '-') return '--'
  const c = Number(cap)
  if (c >= 1000000000000) return (c / 1000000000000).toFixed(2) + '万亿'
  if (c >= 100000000) return (c / 100000000).toFixed(2) + '亿'
  return String(c)
}

export async function fetchIndices() {
  const serverData = await request('/api/indices')
  if (serverData) return serverData

  try {
    const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f2,f3,f4,f12,f14&secids=1.000001,0.399001,0.399006,1.000300,0.399005'
    const text = await proxyFetch(url)
    const data = parseEM(text)
    const items = data?.data?.diff || []
    return items.map(item => ({
      name: item.f14,
      code: item.f12,
      value: item.f2 / 100,
      change: item.f4 / 100,
      changePercent: item.f3 / 100,
    }))
  } catch (e) {
    console.warn('fetchIndices failed:', e)
    return null
  }
}

export async function fetchStocks({ page = 1, size = 30, sort = 'f3', order = '0', market } = {}) {
  const serverData = await request(`/api/stocks?page=${page}&size=${size}&sort=${sort}&order=${order}`)
  if (serverData) return serverData

  try {
    const fs = market || 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23'
    const url = `https://push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=${size}&po=${order}&np=1&fltt=2&invt=2&fid=${sort}&fs=${fs}&fields=f2,f3,f4,f5,f6,f7,f9,f12,f14,f15,f16,f17,f18,f20`
    const text = await proxyFetch(url)
    const data = parseEM(text)
    const items = data?.data?.diff || []
    return items.filter(s => s.f2 > 0).map(item => ({
      name: item.f14,
      code: item.f12,
      price: item.f2,
      change: item.f4,
      changePercent: item.f3,
      volume: formatVolume(item.f5),
      turnover: item.f6,
      amplitude: item.f7,
      high: item.f15,
      low: item.f16,
      open: item.f17,
      prevClose: item.f18,
      marketCap: item.f20 ? formatCap(item.f20) : '--',
      pe: item.f9 ? (item.f9 / 100).toFixed(2) : '--',
    }))
  } catch (e) {
    console.warn('fetchStocks failed:', e)
    return null
  }
}

export async function fetchFunds({ page = 1, size = 30, type = '' } = {}) {
  const serverData = await request(`/api/funds?page=${page}&size=${size}&type=${type}`)
  if (serverData) return serverData

  try {
    const ftMap = { '1': 'gp', '2': 'hh', '3': 'zq', '4': 'zq', '': 'all' }
    const ft = ftMap[type] || 'all'
    const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${ft}&rs=&gs=0&sc=rzdf&st=desc&pi=${page}&pn=${size}&dx=1`
    const text = await proxyFetch(url)
    if (!text) return null
    const datasMatch = text.match(/datas:\[(.*?)\]/)
    const items = datasMatch ? datasMatch[1].split('","').map(s => s.replace(/"/g, '').split(',')) : []
    return items.map(f => ({
      name: f[1],
      code: f[0],
      nav: f[4] || '--',
      dayChange: parseFloat(f[6]) || 0,
      weekChange: parseFloat(f[7]) || 0,
      monthChange: parseFloat(f[8]) || 0,
      fundType: ft === 'gp' ? '股票型' : ft === 'zq' ? '债券型' : '混合型',
      riskLevel: 'mid',
    }))
  } catch (e) {
    console.warn('fetchFunds failed:', e)
    return null
  }
}

export async function fetchSectors() {
  const serverData = await request('/api/sectors')
  if (serverData) return serverData

  try {
    const url = 'https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=15&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2&fields=f2,f3,f4,f12,f14,f104,f105,f128,f140,f136'
    const text = await proxyFetch(url)
    const data = parseEM(text)
    const items = data?.data?.diff || []
    return items.map(item => ({
      name: item.f14,
      code: item.f12,
      changePercent: item.f3,
      change: item.f4,
      leadStock: item.f128 || item.f140 || '--',
      leadChange: item.f136 || 0,
      upCount: item.f104,
      downCount: item.f105,
    }))
  } catch (e) {
    console.warn('fetchSectors failed:', e)
    return null
  }
}

export async function fetchStockDetail(code) {
  const serverData = await request(`/api/stock/${code}`)
  if (serverData) return serverData

  try {
    const prefix = code.startsWith('6') ? '1' : '0'
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${prefix}.${code}&fields=f43,f44,f45,f46,f47,f48,f57,f58,f60,f116,f162,f167,f169,f170`
    const text = await proxyFetch(url)
    const data = parseEM(text)
    const d = data?.data || {}
    return {
      name: d.f58,
      code: d.f57,
      price: d.f43 / 100,
      change: d.f169 / 100,
      changePercent: d.f170 / 100,
      open: d.f44 / 100,
      high: d.f45 / 100,
      low: d.f46 / 100,
      prevClose: d.f60 / 100,
      volume: d.f47,
      turnover: d.f48,
      marketCap: d.f116,
      pe: d.f162 ? (d.f162 / 100).toFixed(2) : '--',
      pb: d.f167 ? (d.f167 / 100).toFixed(2) : '--',
    }
  } catch (e) {
    console.warn('fetchStockDetail failed:', e)
    return null
  }
}

export async function fetchFundDetail(code) {
  return request(`/api/fund/${code}`)
}

export async function fetchFundHoldings(code) {
  return request(`/api/fund-holdings/${code}`)
}

export async function searchStock(query) {
  const serverData = await request(`/api/search?q=${encodeURIComponent(query)}`)
  if (serverData) return serverData

  try {
    const url = `https://searchapi.eastmoney.com/api/suggest/get?input=${encodeURIComponent(query)}&type=14&token=D43BF722C8E33BDC906FB84D85E326E8&count=10`
    const text = await proxyFetch(url)
    const data = parseEM(text)
    const items = data?.QuotationCodeTable?.Data || []
    return items.map(item => ({
      name: item.Name,
      code: item.Code,
      type: item.SecurityTypeName,
      market: item.MktNum,
    }))
  } catch (e) {
    console.warn('searchStock failed:', e)
    return null
  }
}
