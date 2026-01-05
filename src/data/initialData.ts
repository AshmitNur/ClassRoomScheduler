import { Course, Instructor, Room, Section, Timeslot, ScheduleEntry } from '@/types/schedule';

export const initialCourses: Course[] = [];

export const initialInstructors: Instructor[] = [];

export const initialRooms: Room[] = [];

export const initialSections: Section[] = [];

export const initialTimeslots: Timeslot[] = [
  // Sunday / Tuesday
  { id: 'ST1', code: 'ST1', pattern: 'ST', startTime: '08:00', endTime: '09:30', days: ['Sunday', 'Tuesday'] },
  { id: 'ST2', code: 'ST2', pattern: 'ST', startTime: '09:40', endTime: '11:10', days: ['Sunday', 'Tuesday'] },
  { id: 'ST3', code: 'ST3', pattern: 'ST', startTime: '11:20', endTime: '12:50', days: ['Sunday', 'Tuesday'] },
  { id: 'ST4', code: 'ST4', pattern: 'ST', startTime: '13:00', endTime: '14:30', days: ['Sunday', 'Tuesday'] },
  { id: 'ST5', code: 'ST5', pattern: 'ST', startTime: '14:40', endTime: '16:10', days: ['Sunday', 'Tuesday'] },
  { id: 'ST6', code: 'ST6', pattern: 'ST', startTime: '16:20', endTime: '17:50', days: ['Sunday', 'Tuesday'] },

  // Monday / Wednesday
  { id: 'MW1', code: 'MW1', pattern: 'MW', startTime: '08:00', endTime: '09:30', days: ['Monday', 'Wednesday'] },
  { id: 'MW2', code: 'MW2', pattern: 'MW', startTime: '09:40', endTime: '11:10', days: ['Monday', 'Wednesday'] },
  { id: 'MW3', code: 'MW3', pattern: 'MW', startTime: '11:20', endTime: '12:50', days: ['Monday', 'Wednesday'] },
  { id: 'MW4', code: 'MW4', pattern: 'MW', startTime: '13:00', endTime: '14:30', days: ['Monday', 'Wednesday'] },
  { id: 'MW5', code: 'MW5', pattern: 'MW', startTime: '14:40', endTime: '16:10', days: ['Monday', 'Wednesday'] },
  { id: 'MW6', code: 'MW6', pattern: 'MW', startTime: '16:20', endTime: '17:50', days: ['Monday', 'Wednesday'] },

  // Thursday
  { id: 'RA1', code: 'RA1', pattern: 'RA', startTime: '08:00', endTime: '09:30', days: ['Thursday'] },
  { id: 'RA2', code: 'RA2', pattern: 'RA', startTime: '09:40', endTime: '11:10', days: ['Thursday'] },
  { id: 'RA3', code: 'RA3', pattern: 'RA', startTime: '11:20', endTime: '12:50', days: ['Thursday'] },
  { id: 'RA4', code: 'RA4', pattern: 'RA', startTime: '13:00', endTime: '14:30', days: ['Thursday'] },
  { id: 'RA5', code: 'RA5', pattern: 'RA', startTime: '14:40', endTime: '16:10', days: ['Thursday'] },
  { id: 'RA6', code: 'RA6', pattern: 'RA', startTime: '16:20', endTime: '17:50', days: ['Thursday'] },
];

export const initialScheduleEntries: ScheduleEntry[] = [];
