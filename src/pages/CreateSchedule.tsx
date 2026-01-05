import { useState, useEffect } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, AlertTriangle, CheckCircle, Trash2, Clock } from 'lucide-react';
import { Conflict } from '@/types/schedule';
import { toast } from 'sonner';

export default function CreateSchedule() {
  const {
    courses,
    sections,
    instructors,
    rooms,
    timeslots,
    scheduleEntries,
    addScheduleEntry,
    deleteScheduleEntry,
    validateScheduleEntry,
    getCourseById,
    getInstructorById,
    getRoomById,
    getSectionById,
    getTimeslotById,
  } = useSchedule();

  const [formData, setFormData] = useState({
    courseId: '',
    sectionId: '',
    instructorId: '',
    roomId: '',
    timeslotId: '',
  });

  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [availableSections, setAvailableSections] = useState(sections);
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  useEffect(() => {
    if (formData.courseId) {
      setAvailableSections(sections.filter(s => s.courseId === formData.courseId));
      const course = getCourseById(formData.courseId);
      if (course) {
        setFilteredRooms(rooms.filter(r => r.type === course.type));
      }
    } else {
      setAvailableSections(sections);
      setFilteredRooms(rooms);
    }
  }, [formData.courseId, sections, rooms]);

  const handleCheckConflicts = () => {
    if (!formData.courseId || !formData.sectionId || !formData.instructorId || !formData.roomId || !formData.timeslotId) {
      toast.error('Please fill all fields');
      return;
    }
    const foundConflicts = validateScheduleEntry(formData);
    setConflicts(foundConflicts);
    if (foundConflicts.length === 0) {
      toast.success('No conflicts found!');
    }
  };

  const handleSubmit = () => {
    if (!formData.courseId || !formData.sectionId || !formData.instructorId || !formData.roomId || !formData.timeslotId) {
      toast.error('Please fill all fields');
      return;
    }
    const resultConflicts = addScheduleEntry(formData);
    if (resultConflicts.length === 0) {
      toast.success('Schedule entry created successfully');
      setFormData({ courseId: '', sectionId: '', instructorId: '', roomId: '', timeslotId: '' });
      setConflicts([]);
    } else {
      setConflicts(resultConflicts);
      toast.error('Cannot create entry due to conflicts');
    }
  };

  const handleDelete = (id: string) => {
    deleteScheduleEntry(id);
    toast.success('Schedule entry deleted');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Create Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Assign courses to instructors, rooms, and timeslots
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              New Schedule Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData({ ...formData, courseId: value, sectionId: '', roomId: '' })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <span className="font-mono">{course.code}</span> - {course.title}
                      <span className={`ml-2 px-1 text-xs border border-border ${course.type === 'LAB' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                        {course.type}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={formData.sectionId}
                onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                disabled={!formData.courseId}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  {availableSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      Section {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select
                value={formData.instructorId}
                onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room {formData.courseId && `(${getCourseById(formData.courseId)?.type} rooms only)`}</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => setFormData({ ...formData, roomId: value })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <span className="font-mono">{room.code}</span> - {room.building} (Cap: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeslot</Label>
              <Select
                value={formData.timeslotId}
                onValueChange={(value) => setFormData({ ...formData, timeslotId: value })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select timeslot" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  {timeslots.map((ts) => (
                    <SelectItem key={ts.id} value={ts.id}>
                      <span className="font-mono font-bold">{ts.code}</span> - {ts.days.join(', ')} ({ts.startTime} - {ts.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {conflicts.length > 0 && (
              <div className="space-y-2">
                {conflicts.map((conflict, i) => (
                  <Alert key={i} variant="destructive" className="border-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{conflict.type.replace(/_/g, ' ')}</AlertTitle>
                    <AlertDescription>{conflict.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleCheckConflicts}
                className="flex-1"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Check Conflicts
              </Button>
              <Button onClick={handleSubmit} className="flex-1 shadow-xs">
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Schedule Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleEntries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No schedule entries yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-auto">
                {scheduleEntries.map((entry) => {
                  const course = getCourseById(entry.courseId);
                  const section = getSectionById(entry.sectionId);
                  const instructor = getInstructorById(entry.instructorId);
                  const room = getRoomById(entry.roomId);
                  const timeslot = getTimeslotById(entry.timeslotId);

                  return (
                    <div
                      key={entry.id}
                      className="p-4 bg-secondary border-2 border-border flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">
                          {course?.code} - Section {section?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {instructor?.name}
                        </div>
                        <div className="text-sm font-mono">
                          {room?.code} | {timeslot?.code} ({timeslot?.days.join(', ')})
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
