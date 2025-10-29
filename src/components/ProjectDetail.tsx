import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Users, Calendar, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TasksView } from './TasksView';
import { GanttView } from './GanttView';
import { KPIView } from './KPIView';
import { DocumentsView } from './DocumentsView';
import type { Project } from '../App';

type ProjectDetailProps = {
  project: Project;
  onBack: () => void;
};

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getMethodologyColor = (methodology: string) => {
    switch (methodology) {
      case 'Scrum': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Kanban': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cascada': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canDelete = project.progress < 20;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">{project.name}</h1>
              <Badge 
                variant="outline" 
                className={getMethodologyColor(project.methodology)}
              >
                {project.methodology}
              </Badge>
            </div>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              className={`gap-2 ${!canDelete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'}`}
              disabled={!canDelete}
              title={!canDelete ? 'No se puede eliminar un proyecto con más del 20% de progreso' : 'Eliminar proyecto'}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Fecha límite</p>
              <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Presupuesto</p>
              <p className="text-gray-900">${project.budget.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">Equipo</p>
              <p className="text-gray-900">{project.members.length} miembros</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Progreso</p>
              <p className="text-gray-900">{project.progress}%</p>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-8">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Tareas
              </TabsTrigger>
              <TabsTrigger value="gantt" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Gantt
              </TabsTrigger>
              <TabsTrigger value="kpi" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                KPIs
              </TabsTrigger>
              <TabsTrigger value="docs" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Documentos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="p-8 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members */}
                <Card className="p-6 border border-gray-200">
                  <h3 className="text-gray-900 mb-4">Equipo del Proyecto</h3>
                  <div className="space-y-3">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white">{member.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900">{member.name}</p>
                          <p className="text-blue-600">{member.role}</p>
                          <p className="text-gray-600">{member.roleDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Phases */}
                <Card className="p-6 border border-gray-200">
                  <h3 className="text-gray-900 mb-4">Fases del Proyecto</h3>
                  <div className="space-y-3">
                    {project.phases.map((phase) => (
                      <div key={phase.id} className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-900">{phase.name}</p>
                          <Badge 
                            variant="outline"
                            className={
                              phase.status === 'completed' 
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : phase.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }
                          >
                            {phase.status === 'completed' ? 'Completada' : phase.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {new Date(phase.startDate).toLocaleDateString('es-ES')} - {new Date(phase.endDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0 h-full">
              <TasksView project={project} />
            </TabsContent>

            <TabsContent value="gantt" className="mt-0 h-full">
              <GanttView project={project} />
            </TabsContent>

            <TabsContent value="kpi" className="mt-0 h-full">
              <KPIView project={project} />
            </TabsContent>

            <TabsContent value="docs" className="mt-0 h-full">
              <DocumentsView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
