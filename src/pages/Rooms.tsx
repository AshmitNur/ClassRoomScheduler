import { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, DoorOpen } from 'lucide-react';
import { RoomType } from '@/types/schedule';
import { toast } from 'sonner';

export default function Rooms() {
  const { rooms, addRoom, updateRoom, deleteRoom, scheduleEntries } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    capacity: 30,
    type: 'THEORY' as RoomType,
    building: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRoom(editingId, formData);
      toast.success('Room updated successfully');
    } else {
      addRoom(formData);
      toast.success('Room added successfully');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ code: '', capacity: 30, type: 'THEORY', building: '' });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (room: typeof rooms[0]) => {
    setFormData({
      code: room.code,
      capacity: room.capacity,
      type: room.type,
      building: room.building,
    });
    setEditingId(room.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteRoom(id);
    toast.success('Room deleted successfully');
  };

  const getUsageCount = (roomId: string) => {
    return scheduleEntries.filter(e => e.roomId === roomId).length;
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground mt-2">Manage classrooms and labs</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-xs" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-2 border-border">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Room Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="LH-101"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="Main Block"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: RoomType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-2 border-border">
                    <SelectItem value="THEORY">Theory Room</SelectItem>
                    <SelectItem value="LAB">Lab Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="border-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Room</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="border-2 border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5" />
            All Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead>Code</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} className="border-b">
                  <TableCell className="font-mono font-bold">{room.code}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-bold border-2 border-border ${
                      room.type === 'LAB' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {room.type}
                    </span>
                  </TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-secondary border-2 border-border font-bold">
                      {getUsageCount(room.id)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(room)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(room.id)}
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
