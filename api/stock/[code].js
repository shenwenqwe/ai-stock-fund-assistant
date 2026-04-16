import fetch from 'node-fetch'

async function fetchEM(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://finance.eastmoney.com/',
    },
    timeout: 8000,
  })
  const text = await res.text()
  const jsonStr = text.replace(/^[^(]*\(/, '').replace(/\);?$/, '')
  return JSON.parse(jsonStr)
}

export default async function handler(req, res) {
  try {
    const code = req.query.code || ''
    if (!code) return res.status(400).json({ success: false, error: 'code required' })
    const prefix = code.startsWith('6') ? '1' : '0'
    const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${prefix}.${code}&fields=f43,f44,f45,f46,f47,f48,f50,f51,f52,f55,f57,f58,f60,f116,f117,f162,f167,f168,f169,f170,f171`
    const data = await fetchEM(url)
    const d = data?.data || {}
    res.status(200).json({
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
        volume: d.f47,
        turnover: d.f48,
        marketCap: d.f116,
        pe: d.f162 ? (d.f162 / 100).toFixed(2) : '--',
        pb: d.f167 ? (d.f167 / 100).toFixed(2) : '--',
      }
    })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message })
  }
}
