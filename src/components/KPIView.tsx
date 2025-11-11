import { Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Project } from '../App';

type KPIViewProps = {
  project: Project;
  onCreateKPI?: () => void;
};

export function KPIView({ project, onCreateKPI }: KPIViewProps) {

  const getKPIStatus = (kpi: typeof project.kpis[0]) => {
    const percentage = (kpi.current / kpi.target) * 100;

    if (kpi.name === 'Bugs críticos abiertos') {
      if (kpi.current === 0) return 'excellent';
      if (kpi.current <= kpi.target) return 'good';
      return 'warning';
    }

    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'critical':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const kpiTrendData = [
    { mes: 'Ene', velocidad: 38, cobertura: 65, satisfaccion: 82 },
    { mes: 'Feb', velocidad: 42, cobertura: 68, satisfaccion: 85 },
    { mes: 'Mar', velocidad: 45, cobertura: 72, satisfaccion: 88 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Indicadores de Desempeño (KPIs)</h2>
          <p className="text-gray-600">Monitorea el progreso y cumplimiento de objetivos</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={onCreateKPI}
          >
            <Plus className="w-4 h-4" />
            Nuevo KPI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {project.kpis.map((kpi) => {
          const status = getKPIStatus(kpi);
          const percentage = Math.min((kpi.current / kpi.target) * 100, 100);

          return (
            <Card key={kpi.id} className="p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-gray-900">{kpi.name}</h3>
                <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-900">
                    {kpi.current}
                  </span>
                  <span className="text-gray-600">/ {kpi.target} {kpi.unit}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              <p className="text-gray-600">{kpi.description}</p>
            </Card>
          );
        })}
      </div>

      { }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Tendencia de KPIs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="velocidad"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Velocidad"
              />
              <Line
                type="monotone"
                dataKey="cobertura"
                stroke="#10b981"
                strokeWidth={2}
                name="Cobertura"
              />
              <Line
                type="monotone"
                dataKey="satisfaccion"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Satisfacción"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Comparativa Objetivo vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={project.kpis.map(kpi => ({
              name: kpi.name.split(' ').slice(0, 2).join(' '),
              Objetivo: kpi.target,
              Actual: kpi.current
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="Objetivo" fill="#94a3b8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Actual" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      { }
      <Card className="mt-6 p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 mb-2">Estado General del Proyecto</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">En buen estado</span>
            </div>
            <p className="text-gray-600 mt-2">
              El proyecto avanza según lo planeado con un {project.progress}% de progreso completado.
            </p>
          </div>

          <div>
            <p className="text-gray-600 mb-2">KPIs en Meta</p>
            <p className="text-gray-900">
              {project.kpis.filter(kpi => {
                const status = getKPIStatus(kpi);
                return status === 'excellent' || status === 'good';
              }).length} de {project.kpis.length}
            </p>
            <p className="text-gray-600 mt-2">
              La mayoría de los indicadores se encuentran dentro de los objetivos establecidos.
            </p>
          </div>

          <div>
            <p className="text-gray-600 mb-2">Próximos Hitos</p>
            <p className="text-gray-900">Sprint 3 completado</p>
            <p className="text-gray-600 mt-2">
              Se espera completar la fase actual en {Math.ceil(Math.random() * 15 + 5)} días.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
