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

export default async function handler(req, res) {
  try {
    const { page = 1, size = 30, sort = 'f3', order = '0' } = req.query
    const market = req.query.market || 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23'
    const url = `https://push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=${size}&po=${order}&np=1&fltt=2&invt=2&fid=${sort}&fs=${market}&fields=f2,f3,f4,f5,f6,f7,f9,f12,f14,f15,f16,f17,f18,f20`
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
    res.status(200).json({ success: true, total: data?.data?.total || 0, data: result })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message, data: [] })
  }
}
