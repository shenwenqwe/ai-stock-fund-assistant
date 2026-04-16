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
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message, data: [] })
  }
}
