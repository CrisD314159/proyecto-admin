import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Project, TeamMember, Phase } from '../App';

type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: Omit<Project, 'id'>) => void;
};

export function CreateProjectDialog({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endDate: '',
    budget: '',
    methodology: 'Scrum' as 'Scrum' | 'Kanban' | 'Cascada',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    roleDescription: '',
  });

  const [phases, setPhases] = useState<Phase[]>([]);
  const [newPhase, setNewPhase] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (currentStep === 1) {
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

      setCurrentStep(2);
      return;
    }

    const newProject: Omit<Project, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      endDate: formData.endDate,
      budget: parseFloat(formData.budget),
      methodology: formData.methodology,
      progress: 0,
      members: teamMembers.map((member, index) => ({
        ...member,
        id: `m${index + 1}`,
      })),
      phases: phases.map((phase, index) => ({
        ...phase,
        id: `p${index + 1}`,
        status: 'pending' as const,
      })),
      tasks: [],
      kpis: [],
    };

    onCreateProject(newProject);

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      endDate: '',
      budget: '',
      methodology: 'Scrum',
    });
    setTeamMembers([]);
    setPhases([]);
    setNewMember({ name: '', role: '', roleDescription: '' });
    setNewPhase({ name: '', startDate: '', endDate: '' });
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

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.role.trim() && newMember.roleDescription.trim()) {
      setTeamMembers(prev => [...prev, { ...newMember, id: '' }]);
      setNewMember({ name: '', role: '', roleDescription: '' });
    }
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhase = () => {
    if (newPhase.name.trim() && newPhase.startDate && newPhase.endDate) {
      setPhases(prev => [...prev, { ...newPhase, id: '', status: 'pending' }]);
      setNewPhase({ name: '', startDate: '', endDate: '' });
    }
  };

  const handleRemovePhase = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Crear Nuevo Proyecto
          </DialogTitle>
          <div className="flex items-center gap-2 pt-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Información Básica</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Equipo & Fases</span>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 1 && (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 mb-5">
                  Nombre del Proyecto
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  required
                />
                {errors.endDate && (
                  <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe el objetivo y alcance del proyecto"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p style={{ color: 'red', fontSize: '12px' }}>{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="methodology" className="text-gray-900">
                    Metodología
                  </Label>
                  <Select
                    value={formData.methodology}
                    onValueChange={(value: string) => handleChange('methodology', value)}
                  >
                    <SelectTrigger id="methodology">
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
                  <Label htmlFor="endDate" className="text-gray-900">
                    Fecha de Finalización
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && (
                    <p style={{ color: 'red', fontSize: '12px' }}>{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-900">
                  Presupuesto en dólares
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  min="0"
                  step="1000"
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && (
                  <p style={{ color: 'red', fontSize: '12px' }}>{errors.budget}</p>
                )}
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              { }
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Miembros del Equipo (Opcional)</h3>

                { }
                <Card className="p-4 mb-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Nombre completo"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Rol (ej: Product Owner)"
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Descripción del rol"
                      value={newMember.roleDescription}
                      onChange={(e) => setNewMember(prev => ({ ...prev, roleDescription: e.target.value }))}
                    />
                    <Button
                      type="button"
                      onClick={handleAddMember}
                      className="w-full gap-2"
                      disabled={!newMember.name.trim() || !newMember.role.trim() || !newMember.roleDescription.trim()}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Miembro
                    </Button>
                  </div>
                </Card>

                { }
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <Badge variant="outline">{member.role}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{member.roleDescription}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              { }
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fases del Proyecto (Opcional)</h3>

                { }
                <Card className="p-4 mb-4 bg-gray-50">
                  <div className="space-y-3">
                    <Input
                      placeholder="Nombre de la fase"
                      value={newPhase.name}
                      onChange={(e) => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm text-gray-600">Fecha Inicio</Label>
                        <Input
                          type="date"
                          value={newPhase.startDate}
                          onChange={(e) => setNewPhase(prev => ({ ...prev, startDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Fecha Fin</Label>
                        <Input
                          type="date"
                          value={newPhase.endDate}
                          onChange={(e) => setNewPhase(prev => ({ ...prev, endDate: e.target.value }))}
                          min={newPhase.startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddPhase}
                      className="w-full gap-2"
                      disabled={!newPhase.name.trim() || !newPhase.startDate || !newPhase.endDate}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Fase
                    </Button>
                  </div>
                </Card>

                { }
                {phases.length > 0 && (
                  <div className="space-y-2">
                    {phases.map((phase, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{phase.name}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(phase.startDate).toLocaleDateString('es-ES')} - {new Date(phase.endDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePhase(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        { }
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          <div className="flex gap-2">
            {currentStep === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              className="gap-2"
            >
              {currentStep === 1 ? (
                <>
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Crear Proyecto'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
