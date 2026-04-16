import fetch from 'node-fetch'

export default async function handler(req, res) {
  try {
    const keyword = req.query.q || ''
    if (!keyword) return res.status(200).json({ success: true, data: [] })
    const url = `https://searchapi.eastmoney.com/api/suggest/get?input=${encodeURIComponent(keyword)}&type=14&token=D43BF722C8E33BDC906FB84D85E326E8&count=10`
    const data = await (await fetch(url, { timeout: 8000 })).json()
    const items = data?.QuotationCodeTable?.Data || []
    const result = items.map(item => ({
      name: item.Name,
      code: item.Code,
      type: item.SecurityTypeName,
      market: item.MktNum,
    }))
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message, data: [] })
  }
}
