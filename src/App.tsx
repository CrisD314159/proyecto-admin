import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { Sidebar } from './components/Sidebar';

export type Project = {
  id: string;
  name: string;
  description: string;
  endDate: string;
  budget: number;
  methodology: 'Scrum' | 'Kanban' | 'Cascada';
  progress: number;
  members: TeamMember[];
  phases: Phase[];
  tasks: Task[];
  kpis: KPI[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  roleDescription: string;
  avatar?: string;
};

export type Phase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  assignee: string;
  phaseId: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  images?: string[];
};

export type KPI = {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  description: string;
};

export type Document = {
  id: string;
  name: string;
  type: 'technical' | 'guide';
  size: string;
  uploadDate: string;
  url: string;
};

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'project'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - proyecto de ejemplo
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sistema de Gestión Empresarial',
      description: 'Desarrollo de un sistema integral para la gestión de operaciones empresariales',
      endDate: '2025-12-31',
      budget: 150000,
      methodology: 'Scrum',
      progress: 45,
      members: [
        {
          id: 'm1',
          name: 'Ana García',
          role: 'Product Owner',
          roleDescription: 'Responsable de definir y priorizar el backlog del producto'
        },
        {
          id: 'm2',
          name: 'Carlos Mendoza',
          role: 'Scrum Master',
          roleDescription: 'Facilita el proceso Scrum y elimina impedimentos'
        },
        {
          id: 'm3',
          name: 'Laura Martínez',
          role: 'Desarrolladora Frontend',
          roleDescription: 'Desarrollo de interfaces de usuario'
        },
        {
          id: 'm4',
          name: 'Pedro Sánchez',
          role: 'Desarrollador Backend',
          roleDescription: 'Desarrollo de API y lógica de negocio'
        }
      ],
      phases: [
        {
          id: 'p1',
          name: 'Análisis y Diseño',
          startDate: '2025-01-15',
          endDate: '2025-03-15',
          status: 'completed'
        },
        {
          id: 'p2',
          name: 'Desarrollo Sprint 1-3',
          startDate: '2025-03-16',
          endDate: '2025-06-30',
          status: 'in-progress'
        },
        {
          id: 'p3',
          name: 'Desarrollo Sprint 4-6',
          startDate: '2025-07-01',
          endDate: '2025-09-30',
          status: 'pending'
        },
        {
          id: 'p4',
          name: 'Testing y QA',
          startDate: '2025-10-01',
          endDate: '2025-11-30',
          status: 'pending'
        },
        {
          id: 'p5',
          name: 'Despliegue',
          startDate: '2025-12-01',
          endDate: '2025-12-31',
          status: 'pending'
        }
      ],
      tasks: [
        {
          id: 't1',
          name: 'Diseño de arquitectura del sistema',
          description: 'Definir la arquitectura general del sistema y componentes principales',
          priority: 'Crítica',
          assignee: 'Pedro Sánchez',
          phaseId: 'p1',
          status: 'completed',
          startDate: '2025-01-15',
          endDate: '2025-02-01'
        },
        {
          id: 't2',
          name: 'Desarrollo del módulo de autenticación',
          description: 'Implementar sistema de login, registro y recuperación de contraseña',
          priority: 'Alta',
          assignee: 'Pedro Sánchez',
          phaseId: 'p2',
          status: 'completed',
          startDate: '2025-03-16',
          endDate: '2025-04-15'
        },
        {
          id: 't3',
          name: 'Diseño de dashboard principal',
          description: 'Crear el diseño responsive del dashboard con widgets principales',
          priority: 'Alta',
          assignee: 'Laura Martínez',
          phaseId: 'p2',
          status: 'in-progress',
          startDate: '2025-04-16',
          endDate: '2025-05-30'
        },
        {
          id: 't4',
          name: 'Integración con API de pagos',
          description: 'Conectar el sistema con pasarela de pagos externa',
          priority: 'Media',
          assignee: 'Pedro Sánchez',
          phaseId: 'p2',
          status: 'pending',
          startDate: '2025-06-01',
          endDate: '2025-06-30'
        }
      ],
      kpis: [
        {
          id: 'k1',
          name: 'Velocidad del equipo',
          target: 50,
          current: 45,
          unit: 'puntos/sprint',
          description: 'Mide la cantidad de puntos de historia completados por sprint'
        },
        {
          id: 'k2',
          name: 'Cobertura de pruebas',
          target: 80,
          current: 72,
          unit: '%',
          description: 'Porcentaje de código cubierto por pruebas unitarias'
        },
        {
          id: 'k3',
          name: 'Bugs críticos abiertos',
          target: 0,
          current: 2,
          unit: 'bugs',
          description: 'Número de bugs críticos sin resolver'
        },
        {
          id: 'k4',
          name: 'Satisfacción del cliente',
          target: 90,
          current: 88,
          unit: '%',
          description: 'Nivel de satisfacción del Product Owner con los entregables'
        }
      ]
    },
    {
      id: '2',
      name: 'Aplicación Móvil E-commerce',
      description: 'App móvil para comercio electrónico con pago integrado',
      endDate: '2026-03-30',
      budget: 80000,
      methodology: 'Kanban',
      progress: 15,
      members: [],
      phases: [],
      tasks: [],
      kpis: []
    },
    {
      id: '3',
      name: 'Portal Web Corporativo',
      description: 'Sitio web corporativo con CMS personalizado',
      endDate: '2025-08-15',
      budget: 45000,
      methodology: 'Cascada',
      progress: 78,
      members: [],
      phases: [],
      tasks: [],
      kpis: []
    }
  ]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProjectId(null);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard') {
            handleBackToDashboard();
          }
        }}
      />
      
      <main className="flex-1 overflow-hidden">
        {currentView === 'dashboard' ? (
          <Dashboard 
            projects={projects} 
            onProjectSelect={handleProjectSelect}
          />
        ) : selectedProject ? (
          <ProjectDetail 
            project={selectedProject}
            onBack={handleBackToDashboard}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
