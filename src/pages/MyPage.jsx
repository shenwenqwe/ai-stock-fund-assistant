import { useState } from 'react'
import { Star, Clock, BookOpen, Bell, Settings, ChevronRight, Moon, Sun, RefreshCw } from 'lucide-react'
import { aiRecommendations } from '../data/mockData'

const menuItems = [
  { icon: Star, label: '我的收藏', desc: '自选股票/基金', color: 'text-yellow-500' },
  { icon: Clock, label: '推荐历史', desc: '近30天AI推荐记录', color: 'text-blue-500' },
  { icon: BookOpen, label: '投资日志', desc: '记录买卖，AI复盘', color: 'text-green-500' },
  { icon: Bell, label: '风险预警', desc: '价格提醒设置', color: 'text-red-500' },
  { icon: Settings, label: '账号设置', desc: '刷新频率/主题', color: 'text-gray-500' },
]

const recentHistory = [
  { date: '04-15', name: '宁德时代', result: 'correct', change: '+3.2%' },
  { date: '04-15', name: '贵州茅台', result: 'correct', change: '+1.1%' },
  { date: '04-14', name: '比亚迪', result: 'wrong', change: '-0.8%' },
  { date: '04-14', name: '中芯国际', result: 'correct', change: '+2.5%' },
  { date: '04-13', name: '隆基绿能', result: 'wrong', change: '-1.5%' },
  { date: '04-13', name: '招商银行', result: 'correct', change: '+0.6%' },
]

export default function MyPage() {
  const [activeSection, setActiveSection] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [refreshFreq, setRefreshFreq] = useState('5s')

  const favorites = aiRecommendations.slice(0, 4)

  return (
    <div className="px-4 pt-3 pb-4">
      {/* User Header */}
      <div className="card mb-3 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold">U</div>
        <div>
          <div className="font-bold text-gray-900">投资者用户</div>
          <div className="text-xs text-gray-400">风险偏好：稳健型 · 加入30天</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="card text-center py-3">
          <div className="text-lg font-bold text-primary">{favorites.length}</div>
          <div className="text-xs text-gray-400">自选标的</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-lg font-bold text-green-600">78%</div>
          <div className="text-xs text-gray-400">推荐胜率</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-lg font-bold text-purple-600">12</div>
          <div className="text-xs text-gray-400">操作记录</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="card mb-3">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <button
              key={i}
              onClick={() => setActiveSection(activeSection === item.label ? null : item.label)}
              className="flex items-center justify-between w-full py-3 border-b border-gray-50 last:border-0 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={item.color} />
                <div className="text-left">
                  <div className="text-sm text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </div>
              <ChevronRight size={16} className={`text-gray-300 transition-transform ${activeSection === item.label ? 'rotate-90' : ''}`} />
            </button>
          )
        })}
      </div>

      {/* Expandable Sections */}
      {activeSection === '我的收藏' && (
        <div className="card mb-3">
          <div className="text-sm font-bold text-gray-800 mb-2">自选标的</div>
          {favorites.map(f => (
            <div key={f.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm text-gray-800">{f.name}</div>
                <div className="text-xs text-gray-400">{f.code} · {f.industry}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {f.type === 'fund' ? f.price.toFixed(4) : f.price.toFixed(2)}
                </div>
                <div className={`text-xs ${f.historyResult === 'correct' ? 'rise' : 'fall'}`}>
                  {f.historyResult === 'correct' ? '↑ 推荐正确' : '↓ 未达预期'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === '推荐历史' && (
        <div className="card mb-3">
          <div className="text-sm font-bold text-gray-800 mb-2">近30天推荐记录</div>
          {recentHistory.map((h, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{h.date}</span>
                <span className="text-sm text-gray-800">{h.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${h.result === 'correct' ? 'rise' : 'fall'}`}>{h.change}</span>
                <span className={`tag ${h.result === 'correct' ? 'tag-risk-low' : 'tag-risk-high'}`}>
                  {h.result === 'correct' ? '正确' : '错误'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === '投资日志' && (
        <div className="card mb-3">
          <div className="text-sm font-bold text-gray-800 mb-2">投资日志</div>
          <div className="text-center py-6 text-gray-400 text-sm">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            暂无交易记录<br />点击下方按钮开始记录
          </div>
          <button className="btn-primary w-full">记录新交易</button>
        </div>
      )}

      {activeSection === '风险预警' && (
        <div className="card mb-3">
          <div className="text-sm font-bold text-gray-800 mb-2">预警设置</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">开盘提醒</span>
              <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">推荐标的价格提醒</span>
              <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">风险等级变化提醒</span>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === '账号设置' && (
        <div className="card mb-3">
          <div className="text-sm font-bold text-gray-800 mb-2">设置</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2"><RefreshCw size={14} /> 数据刷新频率</span>
              <div className="flex gap-1">
                {['5s', '10s', '30s'].map(f => (
                  <button
                    key={f}
                    onClick={() => setRefreshFreq(f)}
                    className={`px-2 py-1 rounded text-xs ${refreshFreq === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                {darkMode ? <Moon size={14} /> : <Sun size={14} />} 主题模式
              </span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-1 rounded text-xs ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
              >{darkMode ? '深色' : '浅色'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
