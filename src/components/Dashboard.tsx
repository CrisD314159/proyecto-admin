import { Plus, TrendingUp, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { Project } from '../App';

type DashboardProps = {
  projects: Project[];
  onProjectSelect: (projectId: string) => void;
};

export function Dashboard({ projects, onProjectSelect }: DashboardProps) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.progress > 0 && p.progress < 100).length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const completedTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'completed').length, 0
  );

  const getMethodologyColor = (methodology: string) => {
    switch (methodology) {
      case 'Scrum': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Kanban': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cascada': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-8 py-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Dashboard de Proyectos</h1>
            <p className="text-gray-600">Gestiona y da seguimiento a todos tus proyectos</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Proyectos</p>
                <p className="text-gray-900">{totalProjects}</p>
              </div>
              <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-1">Proyectos Activos</p>
                <p className="text-gray-900">{activeProjects}</p>
              </div>
              <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-1">Presupuesto Total</p>
                <p className="text-gray-900">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 mb-1">Tareas Completadas</p>
                <p className="text-gray-900">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Projects List */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Tus Proyectos</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-6 cursor-pointer group"
              onClick={() => onProjectSelect(project.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="text-gray-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Presupuesto</span>
                  <span className="text-gray-900">${project.budget.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Fecha límite</span>
                  <span className="text-gray-900">
                    {new Date(project.endDate).toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`${getMethodologyColor(project.methodology)} backdrop-blur-sm`}
                  >
                    {project.methodology}
                  </Badge>
                  {project.members.length > 0 && (
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 glass-subtle flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
                          style={{ zIndex: 10 - idx }}
                        >
                          <span className="text-white text-xs font-medium">{member.name[0]}</span>
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div 
                          className="w-8 h-8 rounded-full glass ring-2 ring-white dark:ring-gray-800 flex items-center justify-center"
                          style={{ zIndex: 7 }}
                        >
                          <span className="text-gray-600 text-xs font-medium">+{project.members.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
