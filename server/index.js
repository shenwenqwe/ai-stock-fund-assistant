import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Serve static files in production
app.use(express.static(path.join(__dirname, '../dist')))

// Helper: fetch JSON from eastmoney
async function fetchEM(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://finance.eastmoney.com/',
    },
    timeout: 8000,
  })
  const text = await res.text()
  // East Money sometimes returns JSONP
  const jsonStr = text.replace(/^[^(]*\(/, '').replace(/\);?$/, '')
  return JSON.parse(jsonStr)
}

// ============ API Routes ============

// 1. Market Indices - 上证/深证/创业板/沪深300/基金指数
app.get('/api/indices', async (req, res) => {
  try {
    const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f2,f3,f4,f12,f14&secids=1.000001,0.399001,0.399006,1.000300,0.399005'
    const data = await fetchEM(url)
    const items = data?.data?.diff || []
    const result = items.map(item => ({
      name: item.f14,
      code: item.f12,
      value: item.f2 / 100,
      change: item.f4 / 100,
      changePercent: item.f3 / 100,
    }))
    res.json({ success: true, data: result })
  } catch (e) {
    res.json({ success: false, error: e.message, data: getFallbackIndices() })
  }
})

// 2. Stock List - 沪深A股实时行情
app.get('/api/stocks', async (req, res) => {
  try {
    const page = req.query.page || 1
    const pageSize = req.query.size || 30
    const sortField = req.query.sort || 'f3' // f3=涨跌幅
    const sortOrder = req.query.order || '0' // 0=降序
    const market = req.query.market || 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23'
    const url = `https://push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=${pageSize}&po=${sortOrder}&np=1&fltt=2&invt=2&fid=${sortField}&fs=${market}&fields=f2,f3,f4,f5,f6,f7,f9,f12,f14,f15,f16,f17,f18,f20`
    const data = await fetchEM(url)
    const items = data?.data?.diff || []
    const result = items.filter(s => s.f2 > 0).map(item => ({
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
    res.json({ success: true, total: data?.data?.total || 0, data: result })
  } catch (e) {
    res.json({ success: false, error: e.message, data: [] })
  }
})

// 3. Fund List - 基金实时行情
app.get('/api/funds', async (req, res) => {
  try {
    const page = req.query.page || 1
    const pageSize = req.query.size || 30
    const fundType = req.query.type || '' // 1=股票型 2=混合型 3=指数型 4=债券型
    const ftMap = { '1': 'gp', '2': 'hh', '3': 'zq', '4': 'zq', '': 'all' }
    const ft = ftMap[fundType] || 'all'
    const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${ft}&rs=&gs=0&sc=rzdf&st=desc&pi=${page}&pn=${pageSize}&dx=1`
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://fund.eastmoney.com/data/fundranking.html',
      },
      timeout: 8000,
    })
    const text = await resp.text()
    // Parse: var rankData = {datas:["code,name,...","code,name,..."],allRecords:123,...}
    const datasMatch = text.match(/datas:\[(.*?)\]/)
    const totalMatch = text.match(/allRecords:(\d+)/)
    const total = totalMatch ? parseInt(totalMatch[1]) : 0
    const items = datasMatch ? datasMatch[1].split('","').map(s => s.replace(/"/g, '').split(',')) : []
    // Fields: 0=code,1=name,2=abbr,3=date,4=nav,5=accNav,6=dayChange,7=weekChange,8=monthChange,9=3mChange,10=6mChange,11=yearChange,12=2yChange,13=3yChange,14=thisYearChange
    const result = items.map(f => ({
      name: f[1],
      code: f[0],
      nav: f[4] || '--',
      accNav: f[5] || '--',
      dayChange: parseFloat(f[6]) || 0,
      weekChange: parseFloat(f[7]) || 0,
      monthChange: parseFloat(f[8]) || 0,
      threeMonthChange: parseFloat(f[9]) || 0,
      sixMonthChange: parseFloat(f[10]) || 0,
      yearChange: parseFloat(f[11]) || 0,
      fundType: ft === 'all' ? '混合型' : ft === 'gp' ? '股票型' : ft === 'zq' ? '债券型' : '混合型',
      riskLevel: 'mid',
    }))
    res.json({ success: true, total, data: result })
  } catch (e) {
    res.json({ success: false, error: e.message, data: [] })
  }
})

// 4. Hot Sectors - 行业板块涨幅榜
app.get('/api/sectors', async (req, res) => {
  try {
    const url = 'https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=15&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2&fields=f2,f3,f4,f12,f14,f104,f105,f128,f140,f136'
    const data = await fetchEM(url)
    const items = data?.data?.diff || []
    const result = items.map(item => ({
      name: item.f14,
      code: item.f12,
      changePercent: item.f3,
      change: item.f4,
      leadStock: item.f128 || item.f140 || '--',
      leadChange: item.f136 || 0,
      upCount: item.f104,
      downCount: item.f105,
    }))
    res.json({ success: true, data: result })
  } catch (e) {
    res.json({ success: false, error: e.message, data: [] })
  }
})

// 5. Stock Detail - 个股详情
app.get('/api/stock/:code', async (req, res) => {
  try {
    const code = req.params.code
    const prefix = code.startsWith('6') ? '1' : '0'
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${prefix}.${code}&fields=f43,f44,f45,f46,f47,f48,f50,f51,f52,f55,f57,f58,f60,f116,f117,f162,f167,f168,f169,f170,f171,f177,f293`
    const data = await fetchEM(url)
    const d = data?.data || {}
    res.json({
      success: true,
      data: {
        name: d.f58,
        code: d.f57,
        price: d.f43 / 100,
        change: d.f169 / 100,
        changePercent: d.f170 / 100,
        open: d.f44 / 100,
        high: d.f45 / 100,
        low: d.f46 / 100,
        prevClose: d.f60 / 100,
        volume: formatVolume(d.f47),
        turnover: d.f48,
        marketCap: formatCap(d.f116),
        pe: d.f162 ? (d.f162 / 100).toFixed(2) : '--',
        pb: d.f167 ? (d.f167 / 100).toFixed(2) : '--',
      }
    })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

// 6. Fund Detail - 基金详情（含持仓）
app.get('/api/fund/:code', async (req, res) => {
  try {
    const code = req.params.code
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`
    const text = await (await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fund.eastmoney.com/' },
      timeout: 8000,
    })).text()
    // Parse JS variables
    const nameMatch = text.match(/fS_name\s*=\s*"([^"]+)"/)
    const codeMatch = text.match(/fS_code\s*=\s*"([^"]+)"/)
    const navMatch = text.match(/Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/)
    res.json({
      success: true,
      data: {
        name: nameMatch?.[1] || '',
        code: codeMatch?.[1] || code,
      }
    })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

// 7. Search - 搜索股票/基金
app.get('/api/search', async (req, res) => {
  try {
    const keyword = req.query.q || ''
    if (!keyword) return res.json({ success: true, data: [] })
    const url = `https://searchapi.eastmoney.com/api/suggest/get?input=${encodeURIComponent(keyword)}&type=14&token=D43BF722C8E33BDC906FB84D85E326E8&count=10`
    const data = await (await fetch(url, { timeout: 8000 })).json()
    const items = data?.QuotationCodeTable?.Data || []
    const result = items.map(item => ({
      name: item.Name,
      code: item.Code,
      type: item.SecurityTypeName,
      market: item.MktNum,
    }))
    res.json({ success: true, data: result })
  } catch (e) {
    res.json({ success: false, error: e.message, data: [] })
  }
})

// 8. Fund holdings - 基金重仓股
app.get('/api/fund-holdings/:code', async (req, res) => {
  try {
    const code = req.params.code
    const url = `https://fund.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${code}&topline=10&year=&month=&rt=0.9`
    const text = await (await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fund.eastmoney.com/' },
      timeout: 8000,
    })).text()
    // Extract stock names from HTML
    const stockMatches = [...text.matchAll(/<a[^>]*>([^<]+)<\/a>/g)]
    const stocks = stockMatches.map(m => m[1]).filter(s => s.length > 1 && s.length < 10).slice(0, 10)
    res.json({ success: true, data: stocks })
  } catch (e) {
    res.json({ success: false, error: e.message, data: [] })
  }
})

// ============ Helpers ============

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
  if (c >= 10000) return (c / 10000).toFixed(2) + '万'
  return String(c)
}

function getFallbackIndices() {
  return [
    { name: '上证指数', code: '000001', value: 0, change: 0, changePercent: 0 },
    { name: '深证成指', code: '399001', value: 0, change: 0, changePercent: 0 },
    { name: '创业板指', code: '399006', value: 0, change: 0, changePercent: 0 },
    { name: '沪深300', code: '000300', value: 0, change: 0, changePercent: 0 },
    { name: '中证500', code: '399005', value: 0, change: 0, changePercent: 0 },
  ]
}

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'Not found' })
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 AI Stock Fund Assistant server running on http://localhost:${PORT}`)
  console.log(`   API: http://localhost:${PORT}/api/indices`)
  console.log(`   API: http://localhost:${PORT}/api/stocks`)
  console.log(`   API: http://localhost:${PORT}/api/funds`)
  console.log(`   API: http://localhost:${PORT}/api/sectors`)
})
