import { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Instructors() {
  const { instructors, addInstructor, updateInstructor, deleteInstructor, scheduleEntries } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateInstructor(editingId, formData);
      toast.success('Instructor updated successfully');
    } else {
      addInstructor(formData);
      toast.success('Instructor added successfully');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '' });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (instructor: typeof instructors[0]) => {
    setFormData({
      name: instructor.name,
      email: instructor.email,
      department: instructor.department,
    });
    setEditingId(instructor.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteInstructor(id);
    toast.success('Instructor deleted successfully');
  };

  const getClassCount = (instructorId: string) => {
    return scheduleEntries.filter(e => e.instructorId === instructorId).length;
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground mt-2">Manage faculty and instructors</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-xs" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-2 border-border">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. John Doe"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@university.edu"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science"
                  required
                  className="border-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Instructor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="border-2 border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Instructors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((instructor) => (
                <TableRow key={instructor.id} className="border-b">
                  <TableCell className="font-bold">{instructor.name}</TableCell>
                  <TableCell className="font-mono text-sm">{instructor.email}</TableCell>
                  <TableCell>{instructor.department}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-secondary border-2 border-border font-bold">
                      {getClassCount(instructor.id)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(instructor)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(instructor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
