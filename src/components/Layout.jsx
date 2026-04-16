import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, BarChart3, Filter, Brain, User } from 'lucide-react'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/market', label: '行情', icon: BarChart3 },
  { path: '/screening', label: '筛选', icon: Filter },
  { path: '/ai-recommend', label: 'AI推荐', icon: Brain },
  { path: '/my', label: '我的', icon: User },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-page">
      <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-lg mx-auto">
        <div className="flex justify-around items-center h-14">
          {tabs.map(tab => {
            const active = location.pathname === tab.path
            const Icon = tab.icon
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  active ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-xs mt-0.5">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
