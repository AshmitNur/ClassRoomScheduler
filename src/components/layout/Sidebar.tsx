import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DoorOpen, 
  Calendar, 
  CalendarDays,
  Search,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/instructors', icon: Users, label: 'Instructors' },
  { to: '/rooms', icon: DoorOpen, label: 'Rooms' },
  { to: '/schedule', icon: Calendar, label: 'Create Schedule' },
  { to: '/timetable', icon: CalendarDays, label: 'Weekly Timetable' },
  { to: '/search', icon: Search, label: 'Search' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-card border-r-2 border-border flex flex-col">
      <div className="p-6 border-b-2 border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">CSMS</h1>
            <p className="text-xs text-muted-foreground">Schedule Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-2 border-transparent',
                    isActive
                      ? 'bg-primary text-primary-foreground border-border shadow-xs'
                      : 'hover:bg-accent hover:border-border'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t-2 border-border">
        <p className="text-xs text-muted-foreground text-center">
          Class Schedule Management System
        </p>
      </div>
    </aside>
  );
}
