import { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { CourseType } from '@/types/schedule';
import { toast } from 'sonner';

export default function Courses() {
  const { courses, sections, addCourse, updateCourse, deleteCourse, addSection, deleteSection } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    type: 'THEORY' as CourseType,
    creditHours: 3,
  });

  // Section Dialog State
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCourse(editingId, formData);
      toast.success('Course updated successfully');
    } else {
      addCourse(formData);
      toast.success('Course added successfully');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ code: '', title: '', type: 'THEORY', creditHours: 3 });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (course: typeof courses[0]) => {
    setFormData({
      code: course.code,
      title: course.title,
      type: course.type,
      creditHours: course.creditHours,
    });
    setEditingId(course.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
    toast.success('Course deleted successfully');
  };

  const handleOpenSectionDialog = (courseId: string) => {
    setCurrentCourseId(courseId);
    const courseSections = sections.filter(s => s.courseId === courseId);
    // Suggest next letter but allow override
    const nextLetter = String.fromCharCode(65 + courseSections.length);
    setSectionName(nextLetter);
    setIsSectionDialogOpen(true);
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCourseId && sectionName.trim()) {
      addSection({ courseId: currentCourseId, name: sectionName.trim() });
      toast.success(`Section ${sectionName} added`);
      setIsSectionDialogOpen(false);
      setSectionName('');
      setCurrentCourseId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-2">Manage courses and sections</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-xs" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-2 border-border">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="CS101"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to Programming"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Course Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: CourseType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-2 border-border">
                    <SelectItem value="THEORY">Theory</SelectItem>
                    <SelectItem value="LAB">Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input
                  id="creditHours"
                  type="number"
                  min={1}
                  max={6}
                  value={formData.creditHours}
                  onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                  className="border-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Course</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
          <DialogContent className="bg-card border-2 border-border">
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomSection} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sectionName">Section Name</Label>
                <Input
                  id="sectionName"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. A, B, 101, Alpha..."
                  required
                  className="border-2"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Section</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="border-2 border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            All Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const courseSections = sections.filter(s => s.courseId === course.id);
                return (
                  <TableRow key={course.id} className="border-b">
                    <TableCell className="font-mono font-bold">{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-bold border-2 border-border ${course.type === 'LAB' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                        {course.type}
                      </span>
                    </TableCell>
                    <TableCell>{course.creditHours}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {courseSections.map(s => s.name).join(', ') || '-'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => handleOpenSectionDialog(course.id)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
