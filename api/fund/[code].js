import fetch from 'node-fetch'

export default async function handler(req, res) {
  try {
    const code = req.query.code || ''
    if (!code) return res.status(400).json({ success: false, error: 'code required' })
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`
    const text = await (await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fund.eastmoney.com/' },
      timeout: 8000,
    })).text()
    const nameMatch = text.match(/fS_name\s*=\s*"([^"]+)"/)
    const codeMatch = text.match(/fS_code\s*=\s*"([^"]+)"/)
    res.status(200).json({
      success: true,
      data: {
        name: nameMatch?.[1] || '',
        code: codeMatch?.[1] || code,
      }
    })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message })
  }
}
