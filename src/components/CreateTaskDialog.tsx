import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Task, Phase } from '../App';

type CreateTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  phases: Phase[];
  teamMembers: string[];
};

export function CreateTaskDialog({ 
  open, 
  onOpenChange, 
  onCreateTask, 
  phases,
  teamMembers 
}: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Media' as 'Crítica' | 'Alta' | 'Media' | 'Baja',
    assignee: '',
    phaseId: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la tarea es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.assignee) {
      newErrors.assignee = 'Debe asignar la tarea a un miembro del equipo';
    }
    
    if (!formData.phaseId) {
      newErrors.phaseId = 'Debe seleccionar una fase';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de finalización es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create new task
    const newTask: Omit<Task, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      assignee: formData.assignee,
      phaseId: formData.phaseId,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      images: [],
    };

    onCreateTask(newTask);
    
    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priority: 'Media',
      assignee: '',
      phaseId: '',
      status: 'pending',
      startDate: '',
      endDate: '',
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Crear Nueva Tarea
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-gray-900">
              Nombre de la Tarea <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-name"
              placeholder="Ej: Diseño de arquitectura del sistema"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-gray-900">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="task-description"
              placeholder="Describe los objetivos y alcance de la tarea..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority" className="text-gray-900">
                Prioridad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: string) => handleChange('priority', value)}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-status" className="text-gray-900">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) => handleChange('status', value)}
              >
                <SelectTrigger id="task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee and Phase */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-assignee" className="text-gray-900">
                Asignado a <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assignee}
                onValueChange={(value: string) => handleChange('assignee', value)}
              >
                <SelectTrigger id="task-assignee" className={errors.assignee ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar miembro" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Sin asignar" disabled>
                      No hay miembros del equipo
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.assignee && (
                <p className="text-sm text-red-500">{errors.assignee}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-phase" className="text-gray-900">
                Fase <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.phaseId}
                onValueChange={(value: string) => handleChange('phaseId', value)}
              >
                <SelectTrigger id="task-phase" className={errors.phaseId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar fase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.length > 0 ? (
                    phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="sin-fase" disabled>
                      No hay fases creadas
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.phaseId && (
                <p className="text-sm text-red-500">{errors.phaseId}</p>
              )}
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-startDate" className="text-gray-900">
                Fecha de Inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-endDate" className="text-gray-900">
                Fecha de Finalización <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear Tarea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
