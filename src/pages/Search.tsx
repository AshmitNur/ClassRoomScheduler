import { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search as SearchIcon, Users, DoorOpen, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Search() {
  const {
    instructors,
    rooms,
    timeslots,
    scheduleEntries,
    getCourseById,
    getSectionById,
    getInstructorById,
    getRoomById,
    getTimeslotById,
  } = useSchedule();

  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedTimeslot, setSelectedTimeslot] = useState('');

  const getInstructorSchedule = () => {
    if (!selectedInstructor) return [];
    return scheduleEntries.filter((e) => e.instructorId === selectedInstructor);
  };

  const getRoomSchedule = () => {
    if (!selectedRoom) return [];
    return scheduleEntries.filter((e) => e.roomId === selectedRoom);
  };

  const getTimeslotSchedule = () => {
    if (!selectedTimeslot) return [];
    return scheduleEntries.filter((e) => e.timeslotId === selectedTimeslot);
  };

  const renderScheduleTable = (entries: typeof scheduleEntries) => {
    if (entries.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No schedule entries found
        </p>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead>Course</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Timeslot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const course = getCourseById(entry.courseId);
            const section = getSectionById(entry.sectionId);
            const instructor = getInstructorById(entry.instructorId);
            const room = getRoomById(entry.roomId);
            const timeslot = getTimeslotById(entry.timeslotId);

            return (
              <TableRow key={entry.id} className="border-b">
                <TableCell>
                  <span className="font-mono font-bold">{course?.code}</span>
                  <br />
                  <span className="text-sm text-muted-foreground">{course?.title}</span>
                </TableCell>
                <TableCell className="font-bold">Section {section?.name}</TableCell>
                <TableCell>{instructor?.name}</TableCell>
                <TableCell className="font-mono">{room?.code}</TableCell>
                <TableCell>
                  <span className="font-mono font-bold">{timeslot?.code}</span>
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {timeslot?.days.join(', ')} ({timeslot?.startTime} - {timeslot?.endTime})
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Search Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Find schedule entries by instructor, room, or timeslot
        </p>
      </header>

      <Tabs defaultValue="instructor" className="space-y-6">
        <TabsList className="border-2 border-border p-1 bg-secondary">
          <TabsTrigger
            value="instructor"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 mr-2" />
            By Instructor
          </TabsTrigger>
          <TabsTrigger
            value="room"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <DoorOpen className="w-4 h-4 mr-2" />
            By Room
          </TabsTrigger>
          <TabsTrigger
            value="timeslot"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar className="w-4 h-4 mr-2" />
            By Timeslot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instructor">
          <Card className="border-2 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5" />
                Search by Instructor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md">
                <Label>Select Instructor</Label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger className="border-2 mt-2">
                    <SelectValue placeholder="Choose an instructor" />
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
              {selectedInstructor && (
                <div className="p-4 bg-secondary border-2 border-border">
                  <p className="font-bold text-lg">
                    {getInstructorById(selectedInstructor)?.name}
                  </p>
                  <p className="text-muted-foreground">
                    {getInstructorSchedule().length} classes assigned
                  </p>
                </div>
              )}
              {renderScheduleTable(getInstructorSchedule())}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room">
          <Card className="border-2 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5" />
                Search by Room
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md">
                <Label>Select Room</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="border-2 mt-2">
                    <SelectValue placeholder="Choose a room" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-2 border-border">
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.code} - {room.building} ({room.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedRoom && (
                <div className="p-4 bg-secondary border-2 border-border">
                  <p className="font-bold text-lg font-mono">
                    {getRoomById(selectedRoom)?.code}
                  </p>
                  <p className="text-muted-foreground">
                    {getRoomById(selectedRoom)?.building} • Capacity: {getRoomById(selectedRoom)?.capacity} • {getRoomById(selectedRoom)?.type}
                  </p>
                  <p className="text-muted-foreground">
                    {getRoomSchedule().length} classes scheduled
                  </p>
                </div>
              )}
              {renderScheduleTable(getRoomSchedule())}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeslot">
          <Card className="border-2 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5" />
                Search by Timeslot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md">
                <Label>Select Timeslot</Label>
                <Select value={selectedTimeslot} onValueChange={setSelectedTimeslot}>
                  <SelectTrigger className="border-2 mt-2">
                    <SelectValue placeholder="Choose a timeslot" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-2 border-border">
                    {timeslots.map((ts) => (
                      <SelectItem key={ts.id} value={ts.id}>
                        {ts.code} - {ts.days.join(', ')} ({ts.startTime} - {ts.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTimeslot && (
                <div className="p-4 bg-secondary border-2 border-border">
                  <p className="font-bold text-lg font-mono">
                    {getTimeslotById(selectedTimeslot)?.code}
                  </p>
                  <p className="text-muted-foreground">
                    {getTimeslotById(selectedTimeslot)?.days.join(', ')} ({getTimeslotById(selectedTimeslot)?.startTime} - {getTimeslotById(selectedTimeslot)?.endTime})
                  </p>
                  <p className="text-muted-foreground">
                    {getTimeslotSchedule().length} classes in this slot
                  </p>
                </div>
              )}
              {renderScheduleTable(getTimeslotSchedule())}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
