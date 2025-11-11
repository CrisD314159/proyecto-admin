import { useState } from 'react';
import { Search, Upload, FileText, BookOpen, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type Document = {
  id: string;
  name: string;
  type: 'technical' | 'guide';
  size: string;
  uploadDate: string;
  category: string;
};

export function DocumentsView() {
  const [searchTerm, setSearchTerm] = useState('');

  const documents: Document[] = [
    {
      id: 'd1',
      name: 'Arquitectura del Sistema.pdf',
      type: 'technical',
      size: '2.4 MB',
      uploadDate: '2025-02-15',
      category: 'Diseño'
    },
    {
      id: 'd2',
      name: 'Especificación de API REST.pdf',
      type: 'technical',
      size: '1.8 MB',
      uploadDate: '2025-03-01',
      category: 'Backend'
    },
    {
      id: 'd3',
      name: 'Diagrama de Base de Datos.pdf',
      type: 'technical',
      size: '1.2 MB',
      uploadDate: '2025-02-20',
      category: 'Base de Datos'
    },
    {
      id: 'd4',
      name: 'Guía de Instalación y Configuración.pdf',
      type: 'guide',
      size: '3.1 MB',
      uploadDate: '2025-03-10',
      category: 'Setup'
    },
    {
      id: 'd5',
      name: 'Manual de Usuario Final.pdf',
      type: 'guide',
      size: '5.6 MB',
      uploadDate: '2025-03-15',
      category: 'Usuario'
    },
    {
      id: 'd6',
      name: 'Guía de Desarrollo Frontend.pdf',
      type: 'guide',
      size: '2.9 MB',
      uploadDate: '2025-03-05',
      category: 'Desarrollo'
    },
    {
      id: 'd7',
      name: 'Protocolo de Testing y QA.pdf',
      type: 'technical',
      size: '1.5 MB',
      uploadDate: '2025-03-12',
      category: 'Testing'
    },
    {
      id: 'd8',
      name: 'Guía de Despliegue en Producción.pdf',
      type: 'guide',
      size: '2.2 MB',
      uploadDate: '2025-03-18',
      category: 'Deployment'
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const technicalDocs = filteredDocuments.filter(doc => doc.type === 'technical');
  const guideDocs = filteredDocuments.filter(doc => doc.type === 'guide');

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card className="p-5 border border-gray-200 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {doc.type === 'technical' ? (
            <FileText className="w-6 h-6 text-blue-600" />
          ) : (
            <BookOpen className="w-6 h-6 text-green-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {doc.name}
          </h3>
          <div className="flex items-center gap-3 text-gray-600 mb-3">
            <span>{doc.size}</span>
            <span>•</span>
            <span>{new Date(doc.uploadDate).toLocaleDateString('es-ES')}</span>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {doc.category}
          </Badge>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:bg-green-50 hover:text-green-600">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:bg-red-50 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-8">
      { }
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Gestión Documental</h2>
          <p className="text-gray-600">Repositorio de documentación técnica y guías de uso</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Upload className="w-4 h-4" />
          Subir Documento
        </Button>
      </div>

      { }
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      { }
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Todos ({filteredDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Documentación Técnica ({technicalDocs.length})
          </TabsTrigger>
          <TabsTrigger value="guides" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Guías de Uso ({guideDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-0">
          {filteredDocuments.map(doc => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4 mt-0">
          {technicalDocs.length > 0 ? (
            technicalDocs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))
          ) : (
            <Card className="p-8 border border-gray-200 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No se encontraron documentos técnicos</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-0">
          {guideDocs.length > 0 ? (
            guideDocs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))
          ) : (
            <Card className="p-8 border border-gray-200 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No se encontraron guías de uso</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      { }
      <Card className="mt-8 p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Arrastra documentos aquí</h3>
          <p className="text-gray-600 mb-4">
            O haz clic para seleccionar archivos
          </p>
          <Button variant="outline">
            Seleccionar Archivos
          </Button>
          <p className="text-gray-500 mt-4">
            Soporta PDF, DOC, DOCX, XLS, XLSX hasta 50MB
          </p>
        </div>
      </Card>

      { }
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total de Documentos</p>
              <p className="text-gray-900">{documents.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Guías de Uso</p>
              <p className="text-gray-900">{documents.filter(d => d.type === 'guide').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">Docs Técnicas</p>
              <p className="text-gray-900">{documents.filter(d => d.type === 'technical').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
