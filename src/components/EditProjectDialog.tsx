import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Project } from '../App';

type EditProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  project: Project | null;
};

export function EditProjectDialog({ open, onOpenChange, onEditProject, project }: EditProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endDate: '',
    budget: '',
    methodology: 'Scrum' as 'Scrum' | 'Kanban' | 'Cascada',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        endDate: project.endDate,
        budget: String(project.budget),
        methodology: project.methodology,
      });
      setErrors({});
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) return;
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de finalización es requerida';
    }
    
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'El presupuesto debe ser mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update project
    const updates: Partial<Project> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      endDate: formData.endDate,
      budget: parseFloat(formData.budget),
      methodology: formData.methodology,
    };

    onEditProject(project.id, updates);
    onOpenChange(false);
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
    onOpenChange(false);
    setErrors({});
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Editar Proyecto
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-gray-900">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ej: Sistema de Gestión Empresarial"
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
            <Label htmlFor="edit-description" className="text-gray-900">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Describe el objetivo y alcance del proyecto..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Methodology and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-methodology" className="text-gray-900">
                Metodología <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.methodology}
                onValueChange={(value: string) => handleChange('methodology', value)}
              >
                <SelectTrigger id="edit-methodology">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scrum">Scrum</SelectItem>
                  <SelectItem value="Kanban">Kanban</SelectItem>
                  <SelectItem value="Cascada">Cascada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-endDate" className="text-gray-900">
                Fecha de Finalización <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="edit-budget" className="text-gray-900">
              Presupuesto (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-budget"
              type="number"
              placeholder="150000"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              min="0"
              step="1000"
              className={errors.budget ? 'border-red-500' : ''}
            />
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget}</p>
            )}
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
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
