import { LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
};

export function Sidebar({ collapsed, onToggle, currentView, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'
        } glass transition-all duration-300 ease-in-out flex flex-col relative`}
    >

      <div className="h-16 flex items-center justify-between px-4 border-b border-border/30">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">ProjectFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      { }
      <nav className="flex-1 p-3 space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${currentView === 'dashboard'
              ? 'glass-strong text-blue-600 shadow-lg shadow-blue-500/20'
              : 'text-gray-700 dark:text-gray-300 hover:glass-subtle'
            }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

      </nav>
    </aside>
  );
}
