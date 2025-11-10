import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { KPI } from '../App';

type CreateKPIDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateKPI: (kpi: Omit<KPI, 'id'>) => void;
};

export function CreateKPIDialog({ open, onOpenChange, onCreateKPI }: CreateKPIDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    unit: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del KPI es requerido';
    }

    if (!formData.target || parseFloat(formData.target) <= 0) {
      newErrors.target = 'El objetivo debe ser mayor a 0';
    }

    if (!formData.current || parseFloat(formData.current) < 0) {
      newErrors.current = 'El valor actual debe ser mayor o igual a 0';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'La unidad de medida es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newKPI: Omit<KPI, 'id'> = {
      name: formData.name.trim(),
      target: parseFloat(formData.target),
      current: parseFloat(formData.current),
      unit: formData.unit.trim(),
      description: formData.description.trim(),
    };

    onCreateKPI(newKPI);

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      target: '',
      current: '',
      unit: '',
      description: '',
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Crear Nuevo KPI
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          { }
          <div className="space-y-2">
            <Label htmlFor="kpi-name" className="text-gray-900">
              Nombre del KPI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kpi-name"
              placeholder="Ej: Velocidad del equipo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          { }
          <div className="space-y-2">
            <Label htmlFor="kpi-description" className="text-gray-900">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="kpi-description"
              placeholder="Describe qué mide este KPI..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          { }
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kpi-target" className="text-gray-900">
                Objetivo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kpi-target"
                type="number"
                placeholder="100"
                value={formData.target}
                onChange={(e) => handleChange('target', e.target.value)}
                min="0"
                step="0.01"
                className={errors.target ? 'border-red-500' : ''}
              />
              {errors.target && (
                <p className="text-sm text-red-500">{errors.target}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpi-current" className="text-gray-900">
                Valor Actual <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kpi-current"
                type="number"
                placeholder="75"
                value={formData.current}
                onChange={(e) => handleChange('current', e.target.value)}
                min="0"
                step="0.01"
                className={errors.current ? 'border-red-500' : ''}
              />
              {errors.current && (
                <p className="text-sm text-red-500">{errors.current}</p>
              )}
            </div>
          </div>

          { }
          <div className="space-y-2">
            <Label htmlFor="kpi-unit" className="text-gray-900">
              Unidad de Medida <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kpi-unit"
              placeholder="Ej: puntos/sprint, %, bugs, etc."
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className={errors.unit ? 'border-red-500' : ''}
            />
            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit}</p>
            )}
          </div>

          { }
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear KPI
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
