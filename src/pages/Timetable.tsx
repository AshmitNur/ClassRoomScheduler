import { useSchedule } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const DAYS = ['Sunday', 'Tuesday', 'Monday', 'Wednesday', 'Thursday'];
const TIME_SLOTS = [
  { start: '08:00', end: '09:30', label: '08:00 - 09:30' },
  { start: '09:40', end: '11:10', label: '09:40 - 11:10' },
  { start: '11:20', end: '12:50', label: '11:20 - 12:50' },
  { start: '13:00', end: '14:30', label: '13:00 - 14:30' },
  { start: '14:40', end: '16:10', label: '14:40 - 16:10' },
  { start: '16:20', end: '17:50', label: '16:20 - 17:50' },
];

export default function Timetable() {
  const {
    scheduleEntries,
    getCourseById,
    getSectionById,
    getInstructorById,
    getRoomById,
    getTimeslotById,
  } = useSchedule();

  const getEntriesForDayAndTime = (day: string, timeStart: string) => {
    return scheduleEntries.filter((entry) => {
      const timeslot = getTimeslotById(entry.timeslotId);
      if (!timeslot) return false;
      return timeslot.days.includes(day) && timeslot.startTime === timeStart;
    });
  };

  const getColorForCourse = (index: number) => {
    const colors = [
      'bg-primary text-primary-foreground',
      'bg-secondary text-secondary-foreground',
      'bg-accent text-accent-foreground',
      'bg-muted text-foreground',
      'bg-primary/80 text-primary-foreground',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Weekly Timetable</h1>
        <p className="text-muted-foreground mt-2">
          View the complete class schedule for the week
        </p>
      </header>

      <Card className="border-2 border-border shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Schedule Grid
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="border-2 border-border p-4 text-left w-32">Time</th>
                  {DAYS.map((day) => (
                    <th key={day} className="border-2 border-border p-4 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.start}>
                    <td className="border-2 border-border p-4 bg-secondary font-mono font-bold text-sm">
                      {slot.label}
                    </td>
                    {DAYS.map((day) => {
                      const entries = getEntriesForDayAndTime(day, slot.start);
                      return (
                        <td
                          key={`${day}-${slot.start}`}
                          className="border-2 border-border p-2 align-top min-h-[120px] h-[120px]"
                        >
                          <div className="space-y-2">
                            {entries.map((entry) => {
                              const course = getCourseById(entry.courseId);
                              const section = getSectionById(entry.sectionId);
                              const instructor = getInstructorById(entry.instructorId);
                              const room = getRoomById(entry.roomId);

                              const colorIndex = scheduleEntries.findIndex(e => e.courseId === entry.courseId);
                              return (
                                <div
                                  key={entry.id}
                                  className={`${getColorForCourse(colorIndex)} p-2 border-2 border-border`}
                                >
                                  <div className="font-bold text-sm">
                                    {course?.code}
                                  </div>
                                  <div className="text-xs">
                                    Sec {section?.name}
                                  </div>
                                  <div className="text-xs truncate">
                                    {instructor?.name?.split(' ').slice(-1)[0]}
                                  </div>
                                  <div className="text-xs font-mono mt-1">
                                    {room?.code}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-bold">Legend:</span>
        </div>
        {scheduleEntries.slice(0, 5).map((entry, index) => {
          const course = getCourseById(entry.courseId);
          const colorIndex = scheduleEntries.findIndex(e => e.courseId === entry.courseId);
          return (
            <div key={entry.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${getColorForCourse(colorIndex).split(' ')[0]} border-2 border-border`} />
              <span className="text-sm font-mono">{course?.code}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
