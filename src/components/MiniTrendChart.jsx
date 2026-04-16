import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { fetchStockTrend, fetchFundTrend } from '../api/client'

export default function MiniTrendChart({ code, type = 'stock', height = 80 }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const trend = type === 'fund'
        ? await fetchFundTrend(code)
        : await fetchStockTrend(code)
      if (!cancelled && trend && trend.length > 0) {
        setData(trend)
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [code, type])

  if (loading) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <div className="text-xs text-gray-300">加载走势...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <div className="text-xs text-gray-300">暂无走势数据</div>
      </div>
    )
  }

  const prices = data.map(d => d.price).filter(p => !isNaN(p))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const preClose = data[0]?.preClose || data[0]?.price
  const lastPrice = prices[prices.length - 1]
  const isUp = lastPrice >= preClose
  const color = isUp ? '#ef4444' : '#22c55e'

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null
    const d = payload[0].payload
    return (
      <div className="bg-white shadow-lg rounded px-2 py-1 text-xs border">
        <div className="text-gray-500">{d.time}</div>
        <div style={{ color }} className="font-bold">{d.price?.toFixed(2)}</div>
        {d.avg && <div className="text-yellow-500">均价 {d.avg.toFixed(2)}</div>}
      </div>
    )
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad_${code}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis domain={[minPrice * 0.999, maxPrice * 1.001]} hide />
          {type === 'stock' && preClose && (
            <ReferenceLine y={preClose} stroke="#999" strokeDasharray="2 2" strokeWidth={0.5} />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad_${code})`}
            dot={false}
            activeDot={{ r: 2, fill: color }}
          />
          {type === 'stock' && (
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#f59e0b"
              strokeWidth={1}
              dot={false}
              strokeDasharray="2 2"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
