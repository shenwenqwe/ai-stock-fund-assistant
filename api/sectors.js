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
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message, data: [] })
  }
}
