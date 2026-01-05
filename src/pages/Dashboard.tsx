import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, DoorOpen, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { courses, instructors, rooms, scheduleEntries, sections } = useSchedule();

  const stats = [
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'bg-chart-1' },
    { label: 'Instructors', value: instructors.length, icon: Users, color: 'bg-chart-2' },
    { label: 'Rooms', value: rooms.length, icon: DoorOpen, color: 'bg-chart-3' },
    { label: 'Scheduled Classes', value: scheduleEntries.length, icon: Calendar, color: 'bg-chart-4' },
  ];

  const theoryCourses = courses.filter(c => c.type === 'THEORY').length;
  const labCourses = courses.filter(c => c.type === 'LAB').length;
  const theoryRooms = rooms.filter(r => r.type === 'THEORY').length;
  const labRooms = rooms.filter(r => r.type === 'LAB').length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your class schedule management system
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Theory Courses</span>
                <span className="text-2xl font-bold">{theoryCourses}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Lab Courses</span>
                <span className="text-2xl font-bold">{labCourses}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Total Sections</span>
                <span className="text-2xl font-bold">{sections.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5" />
              Room Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Theory Rooms</span>
                <span className="text-2xl font-bold">{theoryRooms}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Lab Rooms</span>
                <span className="text-2xl font-bold">{labRooms}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary border-2 border-border">
                <span className="font-medium">Total Capacity</span>
                <span className="text-2xl font-bold">
                  {rooms.reduce((sum, r) => sum + r.capacity, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-border shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link to="/schedule">
              <Button className="shadow-xs hover:shadow-sm transition-shadow">
                <Calendar className="w-4 h-4 mr-2" />
                Create Schedule
              </Button>
            </Link>
            <Link to="/timetable">
              <Button variant="outline" className="shadow-xs hover:shadow-sm transition-shadow">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Timetable
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" className="shadow-xs hover:shadow-sm transition-shadow">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
