import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Instructor, Room, Section, Timeslot, ScheduleEntry, Conflict } from '@/types/schedule';
import {
  initialCourses,
  initialInstructors,
  initialRooms,
  initialSections,
  initialTimeslots,
  initialScheduleEntries,
} from '@/data/initialData';

interface ScheduleContextType {
  courses: Course[];
  instructors: Instructor[];
  rooms: Room[];
  sections: Section[];
  timeslots: Timeslot[];
  scheduleEntries: ScheduleEntry[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, instructor: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addSection: (section: Omit<Section, 'id'>) => void;
  deleteSection: (id: string) => void;
  addScheduleEntry: (entry: Omit<ScheduleEntry, 'id'>) => Conflict[];
  deleteScheduleEntry: (id: string) => void;
  validateScheduleEntry: (entry: Omit<ScheduleEntry, 'id'>, excludeId?: string) => Conflict[];
  getCourseById: (id: string) => Course | undefined;
  getInstructorById: (id: string) => Instructor | undefined;
  getRoomById: (id: string) => Room | undefined;
  getSectionById: (id: string) => Section | undefined;
  getTimeslotById: (id: string) => Timeslot | undefined;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage or fallback to initialData
  const loadState = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [courses, setCourses] = useState<Course[]>(() => loadState('courses', initialCourses));
  const [instructors, setInstructors] = useState<Instructor[]>(() => loadState('instructors', initialInstructors));
  const [rooms, setRooms] = useState<Room[]>(() => loadState('rooms', initialRooms));
  const [sections, setSections] = useState<Section[]>(() => loadState('sections', initialSections));
  const [timeslots] = useState<Timeslot[]>(initialTimeslots); // Timeslots are static for now, derived from initialData
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(() => loadState('scheduleEntries', initialScheduleEntries));

  // Persist state to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  React.useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);

  React.useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  React.useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);

  React.useEffect(() => {
    localStorage.setItem('scheduleEntries', JSON.stringify(scheduleEntries));
  }, [scheduleEntries]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addCourse = (course: Omit<Course, 'id'>) => {
    setCourses([...courses, { ...course, id: generateId() }]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    setSections(sections.filter(s => s.courseId !== id));
  };

  const addInstructor = (instructor: Omit<Instructor, 'id'>) => {
    setInstructors([...instructors, { ...instructor, id: generateId() }]);
  };

  const updateInstructor = (id: string, updates: Partial<Instructor>) => {
    setInstructors(instructors.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteInstructor = (id: string) => {
    setInstructors(instructors.filter(i => i.id !== id));
  };

  const addRoom = (room: Omit<Room, 'id'>) => {
    setRooms([...rooms, { ...room, id: generateId() }]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const addSection = (section: Omit<Section, 'id'>) => {
    setSections([...sections, { ...section, id: generateId() }]);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const validateScheduleEntry = (entry: Omit<ScheduleEntry, 'id'>, excludeId?: string): Conflict[] => {
    const conflicts: Conflict[] = [];
    const course = courses.find(c => c.id === entry.courseId);
    const room = rooms.find(r => r.id === entry.roomId);
    const existingEntries = scheduleEntries.filter(e => e.id !== excludeId);

    // Room type mismatch
    if (course && room && course.type !== room.type) {
      conflicts.push({
        type: 'ROOM_TYPE_MISMATCH',
        message: `${course.type} course cannot be scheduled in ${room.type} room`,
        severity: 'error',
      });
    }

    // Check for instructor conflict
    const instructorConflict = existingEntries.find(
      e => e.instructorId === entry.instructorId && e.timeslotId === entry.timeslotId
    );
    if (instructorConflict) {
      const conflictingCourse = courses.find(c => c.id === instructorConflict.courseId);
      conflicts.push({
        type: 'INSTRUCTOR_CONFLICT',
        message: `Instructor already assigned to ${conflictingCourse?.code || 'another course'} at this timeslot`,
        severity: 'error',
      });
    }

    // Check for room conflict
    const roomConflict = existingEntries.find(
      e => e.roomId === entry.roomId && e.timeslotId === entry.timeslotId
    );
    if (roomConflict) {
      conflicts.push({
        type: 'ROOM_CONFLICT',
        message: `Room already booked at this timeslot`,
        severity: 'error',
      });
    }

    // Check for duplicate entry
    const duplicate = existingEntries.find(
      e => e.courseId === entry.courseId && e.sectionId === entry.sectionId && e.timeslotId === entry.timeslotId
    );
    if (duplicate) {
      conflicts.push({
        type: 'DUPLICATE_ENTRY',
        message: `This section is already scheduled at this timeslot`,
        severity: 'error',
      });
    }

    return conflicts;
  };

  const addScheduleEntry = (entry: Omit<ScheduleEntry, 'id'>): Conflict[] => {
    const conflicts = validateScheduleEntry(entry);
    if (conflicts.length === 0) {
      setScheduleEntries([...scheduleEntries, { ...entry, id: generateId() }]);
    }
    return conflicts;
  };

  const deleteScheduleEntry = (id: string) => {
    setScheduleEntries(scheduleEntries.filter(e => e.id !== id));
  };

  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getInstructorById = (id: string) => instructors.find(i => i.id === id);
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  const getTimeslotById = (id: string) => timeslots.find(t => t.id === id);

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        instructors,
        rooms,
        sections,
        timeslots,
        scheduleEntries,
        addCourse,
        updateCourse,
        deleteCourse,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        addRoom,
        updateRoom,
        deleteRoom,
        addSection,
        deleteSection,
        addScheduleEntry,
        deleteScheduleEntry,
        validateScheduleEntry,
        getCourseById,
        getInstructorById,
        getRoomById,
        getSectionById,
        getTimeslotById,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
