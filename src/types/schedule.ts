export type CourseType = 'THEORY' | 'LAB';
export type RoomType = 'THEORY' | 'LAB';
export type DayPattern = 'ST' | 'MW' | 'RA';

export interface Course {
  id: string;
  code: string;
  title: string;
  type: CourseType;
  creditHours: number;
}

export interface Section {
  id: string;
  courseId: string;
  name: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Room {
  id: string;
  code: string;
  capacity: number;
  type: RoomType;
  building: string;
}

export interface Timeslot {
  id: string;
  code: string;
  pattern: DayPattern;
  startTime: string;
  endTime: string;
  days: string[];
}

export interface ScheduleEntry {
  id: string;
  courseId: string;
  sectionId: string;
  instructorId: string;
  roomId: string;
  timeslotId: string;
}

export interface Conflict {
  type: 'INSTRUCTOR_CONFLICT' | 'ROOM_CONFLICT' | 'ROOM_TYPE_MISMATCH' | 'DUPLICATE_ENTRY';
  message: string;
  severity: 'error' | 'warning';
}
