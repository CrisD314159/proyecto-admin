import { useMemo } from 'react';
import type { Project } from '../App';

type GanttViewProps = {
  project: Project;
};

export function GanttView({ project }: GanttViewProps) {
  const ganttData = useMemo(() => {
    // Calcular el rango de fechas del proyecto
    const allDates = [
      ...project.phases.map(p => new Date(p.startDate)),
      ...project.phases.map(p => new Date(p.endDate)),
    ];
    
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Generar meses para la timeline
    const months: Date[] = [];
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (current <= maxDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    // Calcular días totales
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return { minDate, maxDate, months, totalDays };
  }, [project.phases]);

  const getPhasePosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startOffset = Math.ceil((start.getTime() - ganttData.minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / ganttData.totalDays) * 100;
    const width = (duration / ganttData.totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Diagrama de Gantt</h2>
        <p className="text-gray-600">Visualización temporal de las fases del proyecto</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Timeline Header */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <div className="w-64 px-6 py-4 border-r border-gray-200">
              <span className="text-gray-700">Fase</span>
            </div>
            <div className="flex-1 px-4 py-4">
              <div className="flex">
                {ganttData.months.map((month, idx) => (
                  <div
                    key={idx}
                    className="flex-1 text-center text-gray-700"
                  >
                    {month.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Rows */}
        <div>
          {project.phases.map((phase) => {
            const position = getPhasePosition(phase.startDate, phase.endDate);
            return (
              <div key={phase.id} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="w-64 px-6 py-4 border-r border-gray-200">
                  <p className="text-gray-900">{phase.name}</p>
                  <p className="text-gray-600">
                    {new Date(phase.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - {new Date(phase.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <div className="flex-1 px-4 py-6 relative">
                  <div
                    className={`absolute h-8 rounded-md ${getPhaseColor(phase.status)} shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center px-3`}
                    style={position}
                  >
                    <span className="text-white truncate">{phase.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today Marker */}
        <div className="relative">
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ 
              left: `${((new Date().getTime() - ganttData.minDate.getTime()) / (ganttData.maxDate.getTime() - ganttData.minDate.getTime())) * 100}%`,
              marginLeft: '16rem' 
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Hoy
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">En Progreso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-red-500"></div>
          <span className="text-gray-600">Fecha Actual</span>
        </div>
      </div>
    </div>
  );
}
