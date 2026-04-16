export const marketIndices = [
  { name: '上证指数', code: '000001', value: 3245.38, change: 28.56, changePercent: 0.89 },
  { name: '深证成指', code: '399001', value: 10562.17, change: -42.33, changePercent: -0.40 },
  { name: '创业板指', code: '399006', value: 2145.62, change: 15.28, changePercent: 0.72 },
  { name: '沪深300', code: '000300', value: 3892.45, change: 12.67, changePercent: 0.33 },
  { name: '偏股基金指数', code: 'H11021', value: 5623.18, change: 18.45, changePercent: 0.33 },
  { name: '债券基金指数', code: 'H11023', value: 2845.92, change: -3.21, changePercent: -0.11 },
]

export const aiRecommendations = [
  { id:1, name:'宁德时代', code:'300750', price:218.56, type:'stock', buyPrice:210, sellPrice:245, stopLossPrice:195, aiScore:92, riskLevel:'mid', winRate:82, todayAccuracy:85, industry:'新能源', holdPeriod:'1-3个月', reasons:['近30日资金持续流入，主力加仓明显','新能源行业政策利好频出','技术面突破关键阻力位'], scoreDetail:{data:28,trend:23,risk:16,market:14,accuracy:11}, historyResult:'correct' },
  { id:2, name:'贵州茅台', code:'600519', price:1756, type:'stock', buyPrice:1720, sellPrice:1850, stopLossPrice:1680, aiScore:88, riskLevel:'low', winRate:79, todayAccuracy:82, industry:'消费', holdPeriod:'3-6个月', reasons:['消费复苏主线明确，白酒龙头受益','历史波动率低，风险可控','北向资金连续5日净买入'], scoreDetail:{data:26,trend:22,risk:18,market:13,accuracy:9}, historyResult:'correct' },
  { id:3, name:'中芯国际', code:'688981', price:52.38, type:'stock', buyPrice:48.5, sellPrice:60, stopLossPrice:45, aiScore:85, riskLevel:'mid', winRate:75, todayAccuracy:78, industry:'半导体', holdPeriod:'1-3个月', reasons:['国产替代加速，订单饱满','半导体行业景气度回升','技术面MACD金叉确认'], scoreDetail:{data:25,trend:22,risk:15,market:14,accuracy:9}, historyResult:'correct' },
  { id:4, name:'比亚迪', code:'002594', price:268.5, type:'stock', buyPrice:255, sellPrice:295, stopLossPrice:240, aiScore:83, riskLevel:'mid', winRate:74, todayAccuracy:76, industry:'新能源车', holdPeriod:'1-3个月', reasons:['新能源车销量持续超预期','海外市场拓展顺利','智能驾驶技术突破'], scoreDetail:{data:24,trend:21,risk:16,market:13,accuracy:9}, historyResult:'wrong' },
  { id:5, name:'招商银行', code:'600036', price:35.62, type:'stock', buyPrice:34, sellPrice:38.5, stopLossPrice:32.5, aiScore:80, riskLevel:'low', winRate:76, todayAccuracy:80, industry:'金融', holdPeriod:'3-6个月', reasons:['银行板块估值修复空间大','息差企稳回升预期','分红率行业领先'], scoreDetail:{data:24,trend:20,risk:18,market:12,accuracy:6}, historyResult:'correct' },
  { id:6, name:'易方达蓝筹精选', code:'005827', price:1.8236, type:'fund', buyPrice:1.78, sellPrice:1.95, stopLossPrice:1.70, aiScore:78, riskLevel:'mid', winRate:72, todayAccuracy:75, industry:'混合型', holdPeriod:'3-6个月', reasons:['重仓消费+科技龙头，攻守兼备','基金经理长期业绩优秀','近期净值稳步回升'], scoreDetail:{data:23,trend:20,risk:16,market:12,accuracy:7}, historyResult:'correct', topHoldings:['贵州茅台','宁德时代','腾讯控股'] },
  { id:7, name:'中欧医疗健康', code:'003095', price:0.8562, type:'fund', buyPrice:0.82, sellPrice:0.95, stopLossPrice:0.78, aiScore:75, riskLevel:'mid', winRate:68, todayAccuracy:70, industry:'混合型', holdPeriod:'3-6个月', reasons:['医药板块估值处于历史低位','创新药政策支持力度加大','基金持仓集中度优化'], scoreDetail:{data:22,trend:19,risk:15,market:12,accuracy:7}, historyResult:'wrong', topHoldings:['药明康德','迈瑞医疗','恒瑞医药'] },
  { id:8, name:'华夏沪深300ETF', code:'510330', price:3.892, type:'fund', buyPrice:3.82, sellPrice:4.10, stopLossPrice:3.70, aiScore:73, riskLevel:'low', winRate:71, todayAccuracy:73, industry:'指数型', holdPeriod:'6-12个月', reasons:['宽基指数估值偏低，安全边际高','经济复苏预期下大盘蓝筹受益','定投性价比突出'], scoreDetail:{data:22,trend:18,risk:17,market:11,accuracy:5}, historyResult:'correct', topHoldings:['贵州茅台','宁德时代','招商银行'] },
  { id:9, name:'隆基绿能', code:'601012', price:24.85, type:'stock', buyPrice:23, sellPrice:28.5, stopLossPrice:21.5, aiScore:71, riskLevel:'high', winRate:65, todayAccuracy:68, industry:'光伏', holdPeriod:'1-3个月', reasons:['光伏行业产能出清接近尾声','海外需求持续增长','但短期价格战风险仍存'], scoreDetail:{data:21,trend:18,risk:14,market:11,accuracy:7}, historyResult:'wrong' },
  { id:10, name:'天弘余额宝', code:'000198', price:1.0, type:'fund', buyPrice:0.99, sellPrice:1.01, stopLossPrice:0.99, aiScore:68, riskLevel:'low', winRate:95, todayAccuracy:98, industry:'债券型', holdPeriod:'随时', reasons:['极低风险，流动性极佳','7日年化收益稳定在1.8%左右','适合闲置资金短期存放'], scoreDetail:{data:20,trend:17,risk:19,market:8,accuracy:4}, historyResult:'correct', topHoldings:['银行存款','国债','同业存单'] },
]

export const hotIndustries = [
  { name: '新能源', changePercent: 3.25, leadStock: '宁德时代', leadChange: 4.12 },
  { name: '半导体', changePercent: 2.87, leadStock: '中芯国际', leadChange: 3.56 },
  { name: '人工智能', changePercent: 2.45, leadStock: '科大讯飞', leadChange: 5.23 },
  { name: '消费电子', changePercent: 1.98, leadStock: '立讯精密', leadChange: 3.15 },
  { name: '光伏', changePercent: 1.76, leadStock: '隆基绿能', leadChange: 2.88 },
  { name: '医药生物', changePercent: 1.52, leadStock: '药明康德', leadChange: 2.45 },
  { name: '军工', changePercent: 1.33, leadStock: '中航沈飞', leadChange: 2.67 },
  { name: '白酒', changePercent: 1.21, leadStock: '贵州茅台', leadChange: 1.35 },
  { name: '银行', changePercent: 0.89, leadStock: '招商银行', leadChange: 1.12 },
  { name: '房地产', changePercent: -0.56, leadStock: '万科A', leadChange: -1.23 },
]

export const hotFunds = [
  { name: '易方达蓝筹精选', code: '005827', type: '混合型', dayChange: 1.85, weekChange: 3.21, monthChange: 5.67 },
  { name: '中欧医疗健康', code: '003095', type: '混合型', dayChange: 1.52, weekChange: 2.88, monthChange: 4.35 },
  { name: '华夏沪深300ETF', code: '510330', type: '指数型', dayChange: 0.89, weekChange: 1.56, monthChange: 3.12 },
  { name: '广发科技先锋', code: '008903', type: '股票型', dayChange: 2.33, weekChange: 4.12, monthChange: 7.23 },
  { name: '招商中证白酒', code: '161725', type: '指数型', dayChange: 1.12, weekChange: 2.15, monthChange: 3.89 },
  { name: '天弘余额宝', code: '000198', type: '债券型', dayChange: 0.01, weekChange: 0.03, monthChange: 0.15 },
  { name: '兴全合润', code: '163406', type: '混合型', dayChange: 1.67, weekChange: 3.45, monthChange: 6.12 },
  { name: '富国天惠', code: '161005', type: '混合型', dayChange: 1.23, weekChange: 2.67, monthChange: 4.78 },
  { name: '景顺长城新兴成长', code: '260108', type: '混合型', dayChange: 1.45, weekChange: 3.12, monthChange: 5.34 },
  { name: '嘉实沪深300ETF', code: '159919', type: '指数型', dayChange: 0.78, weekChange: 1.45, monthChange: 2.98 },
]

export const stockList = [
  { name:'宁德时代', code:'300750', price:218.56, change:8.56, changePercent:4.07, volume:'12.6万', marketCap:'5326亿', industry:'新能源' },
  { name:'贵州茅台', code:'600519', price:1756, change:23.5, changePercent:1.36, volume:'3.5万', marketCap:'22045亿', industry:'消费' },
  { name:'中芯国际', code:'688981', price:52.38, change:1.82, changePercent:3.60, volume:'23.5万', marketCap:'4123亿', industry:'半导体' },
  { name:'比亚迪', code:'002594', price:268.5, change:5.23, changePercent:1.99, volume:'9.0万', marketCap:'7801亿', industry:'新能源车' },
  { name:'招商银行', code:'600036', price:35.62, change:0.38, changePercent:1.08, volume:'56.8万', marketCap:'8976亿', industry:'金融' },
  { name:'隆基绿能', code:'601012', price:24.85, change:0.68, changePercent:2.81, volume:'34.6万', marketCap:'1885亿', industry:'光伏' },
  { name:'药明康德', code:'603259', price:62.35, change:-1.23, changePercent:-1.93, volume:'12.3万', marketCap:'1856亿', industry:'医药' },
  { name:'科大讯飞', code:'002230', price:48.92, change:2.35, changePercent:5.05, volume:'45.7万', marketCap:'1136亿', industry:'人工智能' },
  { name:'立讯精密', code:'002475', price:35.67, change:1.12, changePercent:3.24, volume:'23.5万', marketCap:'2567亿', industry:'消费电子' },
  { name:'中国平安', code:'601318', price:48.56, change:-0.34, changePercent:-0.70, volume:'67.9万', marketCap:'8856亿', industry:'金融' },
  { name:'迈瑞医疗', code:'300760', price:286.5, change:5.80, changePercent:2.07, volume:'2.3万', marketCap:'3472亿', industry:'医药' },
  { name:'海天味业', code:'603288', price:38.92, change:-0.56, changePercent:-1.42, volume:'8.9万', marketCap:'1812亿', industry:'消费' },
  { name:'万科A', code:'000002', price:8.56, change:-0.12, changePercent:-1.38, volume:'123.5万', marketCap:'1008亿', industry:'房地产' },
  { name:'中航沈飞', code:'600760', price:42.35, change:1.12, changePercent:2.71, volume:'5.7万', marketCap:'1162亿', industry:'军工' },
  { name:'恒瑞医药', code:'600276', price:45.23, change:0.89, changePercent:2.01, volume:'23.5万', marketCap:'2890亿', industry:'医药' },
]

export const fundList = [
  { name:'易方达蓝筹精选', code:'005827', nav:1.8236, dayChange:1.85, weekChange:3.21, monthChange:5.67, type:'混合型', riskLevel:'mid', topHoldings:['贵州茅台','宁德时代','腾讯控股'] },
  { name:'中欧医疗健康', code:'003095', nav:0.8562, dayChange:1.52, weekChange:2.88, monthChange:4.35, type:'混合型', riskLevel:'mid', topHoldings:['药明康德','迈瑞医疗','恒瑞医药'] },
  { name:'华夏沪深300ETF', code:'510330', nav:3.892, dayChange:0.89, weekChange:1.56, monthChange:3.12, type:'指数型', riskLevel:'low', topHoldings:['贵州茅台','宁德时代','招商银行'] },
  { name:'广发科技先锋', code:'008903', nav:2.156, dayChange:2.33, weekChange:4.12, monthChange:7.23, type:'股票型', riskLevel:'high', topHoldings:['中芯国际','科大讯飞','立讯精密'] },
  { name:'招商中证白酒', code:'161725', nav:1.2456, dayChange:1.12, weekChange:2.15, monthChange:3.89, type:'指数型', riskLevel:'mid', topHoldings:['贵州茅台','五粮液','泸州老窖'] },
  { name:'天弘余额宝', code:'000198', nav:1.0, dayChange:0.01, weekChange:0.03, monthChange:0.15, type:'债券型', riskLevel:'low', topHoldings:['银行存款','国债','同业存单'] },
  { name:'兴全合润', code:'163406', nav:1.5623, dayChange:1.67, weekChange:3.45, monthChange:6.12, type:'混合型', riskLevel:'mid', topHoldings:['宁德时代','贵州茅台','海康威视'] },
  { name:'富国天惠', code:'161005', nav:2.3456, dayChange:1.23, weekChange:2.67, monthChange:4.78, type:'混合型', riskLevel:'mid', topHoldings:['比亚迪','迈瑞医疗','招商银行'] },
  { name:'景顺长城新兴成长', code:'260108', nav:3.1256, dayChange:1.45, weekChange:3.12, monthChange:5.34, type:'混合型', riskLevel:'mid', topHoldings:['宁德时代','隆基绿能','药明康德'] },
  { name:'嘉实沪深300ETF', code:'159919', nav:4.123, dayChange:0.78, weekChange:1.45, monthChange:2.98, type:'指数型', riskLevel:'low', topHoldings:['贵州茅台','宁德时代','中国平安'] },
]

export const glossary = {
  '北向资金': '从香港市场流入A股的资金，通常被视为外资风向标',
  '止盈价': '建议在标的上涨到该价格时卖出获利',
  '止损价': '建议在标的下跌到该价格时卖出止损',
  '回撤': '从最高点回落的幅度，衡量风险大小',
  '波动率': '价格波动的剧烈程度，越高风险越大',
  '指数基金': '跟踪特定指数的基金，如沪深300',
  'MACD金叉': '短期均线上穿长期均线，通常视为买入信号',
  '主力资金': '大额机构资金，其流向影响股价走势',
  '净值': '基金每份的实际价值',
  '重仓股': '基金持仓占比最高的股票',
  '胜率': 'AI推荐标的后上涨的概率',
  'AI评分': '基于多维度数据计算的综合评分，满分100',
}
