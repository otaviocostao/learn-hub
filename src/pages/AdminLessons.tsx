// src/pages/AdminLesson.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button'; // Usar Button do Shadcn para consistência

import type { Course } from '@/types/course'; // Import type para interfaces
import { getCourseById } from '@/services/course_service';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Adicionar useNavigate
import { Pencil, Plus, Trash, ArrowLeft, Loader2 } from 'lucide-react'; // Adicionar Loader2
import type { Lesson } from '@/types/lesson';
import { 
  getLessonsByCourseId, 
  createLesson as apiCreateLesson, // Renomear para evitar conflito com variável local
  updateLesson as apiUpdateLesson,
  deleteLesson as apiDeleteLesson 
} from '@/services/lesson_service';
import { toast } from "sonner" // Para feedback


// Tipo para o modelo da aula
type LessonModelType = "video" | "ebook";

// Estado inicial para um formulário de aula (usado para adicionar e editar)
const getInitialLessonFormData = (
    baseLesson?: Partial<Lesson>,
    courseIdToSet?: string,
    defaultOrder?: number
): Omit<Lesson, 'id' | 'course_id'> & { course_id?: string } => ({
  title: baseLesson?.title || '',
  description: baseLesson?.description || '',
  order: baseLesson?.order !== undefined ? baseLesson.order : (defaultOrder || 1),
  model: baseLesson?.model || 'video',
  instructor: baseLesson?.instructor || '',
  category: baseLesson?.category || '',
  duration_minutes: baseLesson?.duration_minutes || 0,
  youtube_video_id: baseLesson?.youtube_video_id || '', // Usando camelCase
  ebook_url: baseLesson?.ebook_url || '',           // Usando camelCase
  course_id: courseIdToSet || baseLesson?.course_id || '', // course_id será string aqui
});


const AdminLesson: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Para formulários
  const [error, setError] = useState<string | null>(null);

  // Para o Dialog de Adicionar Aula
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState<boolean>(false);
  const [newLessonForm, setNewLessonForm] = useState<Omit<Lesson, 'id' | 'course_id'> & { course_id?: string }>(
    getInitialLessonFormData(undefined, courseId, (lessons?.length || 0) + 1)
  );

  // Para o Dialog de Editar Aula
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null); // A aula original sendo editada
  const [editLessonForm, setEditLessonForm] = useState<Omit<Lesson, 'id' | 'course_id'> & { course_id?: string } | null>(null);


  const fetchCourseAndLessons = useCallback(async () => {
    if (!courseId) {
      setError("ID do curso não fornecido na URL.");
      setLoadingCourse(false); setLoadingLessons(false);
      return;
    }
    setLoadingCourse(true); setLoadingLessons(true); setError(null);
    try {
      const courseData = await getCourseById(courseId);
      if (!courseData) throw new Error("Curso não encontrado.");
      setCourse(courseData);
        
      const courseLessons = await getLessonsByCourseId(courseId);
      setLessons(courseLessons);
      // Atualiza a ordem padrão para nova aula
      setNewLessonForm(getInitialLessonFormData(undefined, courseId, courseLessons.length + 1));
    } catch (err) {
      console.error("Erro ao buscar curso ou aulas:", err);
      const errorMessage = err instanceof Error ? err.message : "Falha ao carregar dados.";
      setError(errorMessage);
      toast.error("Erro ao carregar dados", { description: errorMessage });
    } finally {
      setLoadingCourse(false); setLoadingLessons(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [fetchCourseAndLessons]);


  const handleOpenAddDialog = () => {
    setNewLessonForm(getInitialLessonFormData(undefined, courseId, lessons.length + 1));
    setIsAddLessonDialogOpen(true);
  };

  const handleAddFormChange = (field: keyof typeof newLessonForm, value: string | number | LessonModelType) => {
    setNewLessonForm(prev => ({ ...prev, [field]: value }));
    if (field === 'model') {
        setNewLessonForm(prev => ({
            ...prev,
            youtube_video_id: value === 'video' ? prev.youtube_video_id : '',
            ebook_url: value === 'ebook' ? prev.ebook_url : '',
        }));
    }
  };
  
  const handleCreateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast.error("Erro", { description: "ID do curso ausente." });
      return;
    }
    if (!newLessonForm.title.trim()) {
      toast.error("Erro de Validação", { description: "O título da aula é obrigatório." });
      return;
    }
    if (newLessonForm.order <= 0) {
        toast.error("Erro de Validação", { description: "A ordem da aula deve ser um número positivo." });
        return;
    }

    setIsSubmitting(true);
    try {
      // A interface `Lesson` espera course_id, mas o serviço `apiCreateLesson`
      // recebe courseId como primeiro argumento e adiciona course_id ao payload.
      // Precisamos garantir que o payload para apiCreateLesson não tenha 'course_id' se ele for adicionado pelo serviço.
      const payloadForService: Omit<Lesson, 'id' | 'course_id'> = {
        title: newLessonForm.title,
        description: newLessonForm.description,
        order: newLessonForm.order,
        model: newLessonForm.model,
        instructor: newLessonForm.instructor,
        category: newLessonForm.category,
        duration_minutes: Number(newLessonForm.duration_minutes) || 0,
        youtube_video_id: newLessonForm.model === 'video' ? newLessonForm.youtube_video_id : undefined,
        ebook_url: newLessonForm.model === 'ebook' ? newLessonForm.ebook_url : undefined,
      };

      await apiCreateLesson(courseId, payloadForService);
      toast.success("Aula criada com sucesso!");
      setIsAddLessonDialogOpen(false);
      fetchCourseAndLessons(); // Re-busca aulas para atualizar a lista
    } catch (err) {
      console.error("Erro ao criar aula:", err);
      const errorMessage = err instanceof Error ? err.message : "Falha ao criar a aula.";
      toast.error("Erro ao criar aula", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleOpenEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson); // Guarda a aula original
    setEditLessonForm(getInitialLessonFormData(lesson, lesson.course_id, lesson.order)); // Preenche o form
  };

  const handleEditFormChange = (field: keyof NonNullable<typeof editLessonForm>, value: string | number | LessonModelType) => {
    setEditLessonForm(prev => prev ? ({ ...prev, [field]: value }) : null);
    if (field === 'model' && editLessonForm) {
        setEditLessonForm(prev => prev ? ({
            ...prev,
            youtube_video_id: value === 'video' ? prev.youtube_video_id : '',
            ebook_url: value === 'ebook' ? prev.ebook_url : '',
        }) : null);
    }
  };

  const handleUpdateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editLessonForm || !courseId) {
      toast.error("Erro", { description: "Dados insuficientes para editar a aula." });
      return;
    }
    if (!editLessonForm.title.trim()) {
      toast.error("Erro de Validação", { description: "O título da aula é obrigatório." });
      return;
    }

    setIsSubmitting(true);
    try {
      const updates: Partial<Omit<Lesson, 'id' | 'course_id'>> = {
        title: editLessonForm.title,
        description: editLessonForm.description,
        order: editLessonForm.order,
        model: editLessonForm.model,
        instructor: editLessonForm.instructor,
        category: editLessonForm.category,
        duration_minutes: Number(editLessonForm.duration_minutes) || 0,
        youtube_video_id: editLessonForm.model === 'video' ? editLessonForm.youtube_video_id : undefined,
        ebook_url: editLessonForm.model === 'ebook' ? editLessonForm.ebook_url : undefined,
      };
      await apiUpdateLesson(courseId, editingLesson.id, updates);
      toast.success("Aula atualizada com sucesso!");
      setEditingLesson(null); // Fecha o dialog
      setEditLessonForm(null);
      fetchCourseAndLessons(); // Re-busca
    } catch (err) {
      console.error("Erro ao atualizar aula:", err);
      const errorMessage = err instanceof Error ? err.message : "Falha ao atualizar a aula.";
      toast.error("Erro ao atualizar aula", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonIdToDelete: string) => {
    if (!courseId) return;
    if (!window.confirm("Tem certeza que deseja deletar esta aula? Esta ação não pode ser desfeita.")) {
        return;
    }
    setIsSubmitting(true); // Pode usar um loading específico para deleção se quiser
    try {
        await apiDeleteLesson(courseId, lessonIdToDelete);
        toast.success("Aula deletada com sucesso!");
        fetchCourseAndLessons(); // Re-busca
    } catch (err) {
        console.error("Erro ao deletar aula:", err);
        const errorMessage = err instanceof Error ? err.message : "Falha ao deletar a aula.";
        toast.error("Erro ao deletar aula", { description: errorMessage });
    } finally {
        setIsSubmitting(false);
    }
  };
    
  // Renderização de loading/erro principal
  if (loadingCourse && !course) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Carregando...</p></div>;
  }
  if (error && !course) {
    return <div className="flex items-center justify-center min-h-screen text-red-500"><p className="text-xl">Erro: {error}</p></div>;
  }
  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-white"><p className="text-xl">Curso não encontrado.</p></div>;
  }

  // Formulário reutilizável para Adicionar/Editar Aula
  const renderLessonFormFields = (
    formData: Omit<Lesson, 'id' | 'course_id'> & { course_id?: string }, 
    handleChange: (field: keyof typeof formData, value: string | number | LessonModelType) => void,
    formType: 'add' | 'edit'
    ) => (
    <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-title`} className="text-right">Título</Label>
            <Input id={`${formType}-title`} value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-description`} className="text-right">Descrição</Label>
            <Textarea id={`${formType}-description`} value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-order`} className="text-right">Ordem</Label>
            <Input id={`${formType}-order`} type="number" value={formData.order} onChange={(e) => handleChange('order', parseInt(e.target.value, 10) || 0)} className="col-span-3 bg-slate-700 border-slate-600" min="1" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-model`} className="text-right">Modelo</Label>
            <Select value={formData.model} onValueChange={(val: string) => handleChange('model', val as LessonModelType)}>
                <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="ebook">E-book</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {formData.model === 'video' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`${formType}-youtube`} className="text-right">ID Youtube</Label>
                <Input id={`${formType}-youtube`} value={formData.youtube_video_id || ''} onChange={(e) => handleChange('youtube_video_id', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" placeholder="Ex: dQw4w9WgXcQ" />
            </div>
        )}
        {formData.model === 'ebook' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`${formType}-ebook`} className="text-right">URL E-book</Label>
                <Input id={`${formType}-ebook`} value={formData.ebook_url || ''} onChange={(e) => handleChange('ebook_url', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" placeholder="Ex: /markdown/aula.md" />
            </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-duration`} className="text-right">Duração (min)</Label>
            <Input id={`${formType}-duration`} type="number" value={formData.duration_minutes || 0} onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value, 10) || 0)} className="col-span-3 bg-slate-700 border-slate-600" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-instructor`} className="text-right">Instrutor</Label>
            <Input id={`${formType}-instructor`} value={formData.instructor || ''} onChange={(e) => handleChange('instructor', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" placeholder={course?.instructorName || "Nome do Instrutor"}/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${formType}-category`} className="text-right">Categoria</Label>
            <Input id={`${formType}-category`} value={formData.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" placeholder={course?.category || "Categoria da Aula"}/>
        </div>
    </div>
  );

  return (
    <div className="p-6 animate-fade-in text-white">
      <div className="flex items-center justify-between mb-8">
        <div className='flex items-baseline'> {/* Use items-baseline para alinhar texto */}
          <Link to="/admin/cursos" className="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 mr-4">
            <ArrowLeft size={16} className="mr-1" /> Voltar para Cursos
          </Link>
          <h1 className='text-3xl font-bold'>Aulas do Curso: <span className="text-sky-400">{course.title}</span></h1>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
            <Plus size={18}/> Nova aula
        </Button>
      </div>

        <div className="bg-black/20 border border-white/10 rounded-lg shadow-xl p-0 md:p-0">
        {loadingLessons ? (
          <p className='text-white/70 text-center py-8'>Carregando aulas...</p>
        ) : error && lessons.length === 0 ? ( // Mostra erro se não houver aulas e houver erro
          <p className='text-red-500 text-center py-8'>Erro ao carregar aulas: {error}</p>
        ) : lessons.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead className="w-[80px] text-white/80">Ordem</TableHead>
                <TableHead className="text-white/80">Título</TableHead>
                <TableHead className="text-white/80">Modelo</TableHead>
                <TableHead className="text-white/80 w-[120px]">Duração (min)</TableHead>
                <TableHead className="text-right text-white/80 w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id} className="border-b-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">{lesson.order}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell className="capitalize">{lesson.model}</TableCell>
                  <TableCell>{lesson.duration_minutes || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" className="border-sky-500/50 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300" onClick={() => handleOpenEditDialog(lesson)}>
                        <Pencil size={16}/>
                      </Button>
                      <Button variant="outline" size="icon" className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => handleDeleteLesson(lesson.id)}>
                        {isSubmitting && editingLesson?.id === lesson.id ? <Loader2 className="animate-spin" size={16}/> : <Trash size={16}/>}
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-white/70 text-center py-8">Nenhuma aula cadastrada para este curso ainda.</p>
        )}
      </div>

      {/* Dialog para Editar Aula */}
      {editingLesson && editLessonForm && (
        <Dialog open={!!editingLesson} onOpenChange={(isOpen) => !isOpen && setEditingLesson(null)}>
          <DialogContent className="sm:max-w-2xl bg-slate-900 text-white border-slate-700 shadow-2xl">
            <form onSubmit={handleUpdateLessonSubmit}>
                <DialogHeader>
                <DialogTitle className="text-2xl">Editar Aula: <span className="font-normal">{editingLesson.title}</span></DialogTitle>
                <DialogDescription className="text-slate-400">
                    Faça alterações na sua aula abaixo.
                </DialogDescription>
                </DialogHeader>
                {renderLessonFormFields(editLessonForm, handleEditFormChange, 'edit')}
                <DialogFooter className="mt-6">
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="hover:bg-slate-700">Cancelar</Button>
                </DialogClose>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Salvar Alterações
                </Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para Adicionar Nova Aula */}
      <Dialog open={isAddLessonDialogOpen} onOpenChange={setIsAddLessonDialogOpen}>
            <DialogContent className="sm:max-w-2xl bg-slate-900 text-white border-slate-700 shadow-2xl">
            <form onSubmit={handleCreateLessonSubmit}>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Adicionar Nova Aula</DialogTitle>
                    <DialogDescription className="text-slate-400">
                    Preencha os detalhes da nova aula.
                    </DialogDescription>
                </DialogHeader>
                {renderLessonFormFields(newLessonForm, handleAddFormChange, 'add')}
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="hover:bg-slate-700" onClick={() => setIsAddLessonDialogOpen(false)}>Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Criar Aula
                    </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default AdminLesson;