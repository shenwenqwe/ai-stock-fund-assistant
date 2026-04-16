import { marketIndices } from '../data/mockData'

export default function IndexBar({ data }) {
  const indices = data || marketIndices
  return (
    <div className="card mb-3">
      <div className="text-sm font-bold text-gray-800 mb-2">📊 实时大盘指数</div>
      <div className="grid grid-cols-3 gap-2">
        {indices.map(idx => {
          const isUp = Number(idx.changePercent) >= 0
          const val = Number(idx.value)
          return (
            <div key={idx.code} className="text-center py-1.5">
              <div className="text-xs text-gray-500 truncate">{idx.name}</div>
              <div className={`text-sm font-bold ${isUp ? 'rise' : 'fall'}`}>
                {val > 100 ? val.toFixed(2) : val.toFixed(4)}
              </div>
              <div className={`text-xs ${isUp ? 'rise' : 'fall'}`}>
                {isUp ? '+' : ''}{Number(idx.changePercent).toFixed(2)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
