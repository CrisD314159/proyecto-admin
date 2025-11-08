import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import type { Project } from '../App';

type DeleteProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteProject: (projectId: string) => void;
  project: Project | null;
};

export function DeleteProjectDialog({ 
  open, 
  onOpenChange, 
  onDeleteProject, 
  project 
}: DeleteProjectDialogProps) {
  if (!project) return null;

  const canDelete = project.progress < 20;

  const handleDelete = () => {
    if (canDelete) {
      onDeleteProject(project.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900">
            {canDelete ? '¿Eliminar proyecto?' : 'No se puede eliminar el proyecto'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Estás a punto de eliminar el proyecto <strong>"{project.name}"</strong>.
                <br /><br />
                Esta acción no se puede deshacer. Se eliminarán permanentemente:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Todas las tareas del proyecto</li>
                  <li>Todos los miembros asignados</li>
                  <li>Todas las fases y KPIs</li>
                  <li>Todos los documentos asociados</li>
                </ul>
              </>
            ) : (
              <>
                El proyecto <strong>"{project.name}"</strong> tiene un progreso del {project.progress}%.
                <br /><br />
                Solo se pueden eliminar proyectos con menos del 20% de progreso.
                Si deseas eliminarlo, primero debes reducir el progreso del proyecto.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar Proyecto
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
