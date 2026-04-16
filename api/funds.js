import fetch from 'node-fetch'

export default async function handler(req, res) {
  try {
    const { page = 1, size = 30, type = '' } = req.query
    const url = `https://fundapi.eastmoney.com/fundapi/FundRankListApi/FundRankList?fundType=${type}&pageIndex=${page}&pageSize=${size}&sort=desc&orderBy=D1&callback=`
    const data = await (await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fund.eastmoney.com/' },
      timeout: 8000,
    })).json()
    const items = data?.Data?.RankList || []
    const result = items.map(item => ({
      name: item.FundName,
      code: item.FundCode,
      nav: item.Nav,
      accNav: item.AccNav,
      dayChange: item.D1,
      weekChange: item.W1,
      monthChange: item.M1,
      threeMonthChange: item.M3,
      sixMonthChange: item.M6,
      yearChange: item.Y1,
      fundType: item.FundType,
      riskLevel: item.RiskLevel || 'mid',
    }))
    res.status(200).json({ success: true, total: data?.Data?.TotalCount || 0, data: result })
  } catch (e) {
    res.status(200).json({ success: false, error: e.message, data: [] })
  }
}
