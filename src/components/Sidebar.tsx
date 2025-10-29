import { LayoutDashboard, FolderKanban, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
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
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative shadow-sm`}
      style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ProjectFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            currentView === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-100`}
        >
          <FolderKanban className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Proyectos</span>}
        </button>

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-100`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Documentos</span>}
        </button>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-gray-900">Usuario Demo</p>
              <p className="text-gray-500 truncate">demo@projectflow.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
