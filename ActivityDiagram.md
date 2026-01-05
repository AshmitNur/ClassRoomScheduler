# Activity Diagram - Class Scheduler Pro

```mermaid
graph TD
    Start((Start)) --> Dashboard[View Dashboard]
    Dashboard --> Choice{User Action}

    %% Manage Data Path
    Choice -->|Manage Data| ManageData[Manage Resources]
    ManageData --> ManageCourses[Manage Courses]
    ManageData --> ManageInstructors[Manage Instructors]
    ManageData --> ManageRooms[Manage Rooms]
    ManageCourses --> AddEditDeleteCourses[Add/Edit/Delete Courses]
    ManageInstructors --> AddEditDeleteInstructors[Add/Edit/Delete Instructors]
    ManageRooms --> AddEditDeleteRooms[Add/Edit/Delete Rooms]
    AddEditDeleteCourses --> Choice
    AddEditDeleteInstructors --> Choice
    AddEditDeleteRooms --> Choice

    %% Create Schedule Path
    Choice -->|Create Schedule| CreateSchedule[Create Schedule Entry]
    CreateSchedule --> SelectCourse[Select Course]
    SelectCourse --> SelectSection[Select Section]
    SelectSection --> SelectInstructor[Select Instructor]
    SelectInstructor --> SelectRoom[Select Room]
    SelectRoom --> SelectTimeslot[Select Timeslot]
    
    SelectTimeslot --> CheckConflicts{Check/Submit?}
    
    %% Conflict Checking Logic
    CheckConflicts -->|Check Conflicts Button| ValidateConflicts[Validate Entry]
    ValidateConflicts --> ConflictsFound?{Conflicts Found?}
    ConflictsFound? -->|Yes| ShowConflicts[Show Conflict Alerts]
    ShowConflicts --> SelectCourse
    ConflictsFound? -->|No| ShowSuccess[Show Success Message]
    ShowSuccess --> CheckConflicts
    
    CheckConflicts -->|Create Entry Button| SubmitEntry[Submit Entry]
    SubmitEntry --> ServerValidate{Internal Validation}
    ServerValidate -->|Conflicts| ShowConflicts
    ServerValidate -->|Success| SaveEntry[Save Schedule Entry]
    SaveEntry --> UpdateList[Update Schedule List]
    UpdateList --> MoreEntries{Create Another?}
    MoreEntries -->|Yes| SelectCourse
    MoreEntries -->|No| Choice

    %% View Schedule Path
    Choice -->|View Schedule| ViewTimetable[View Timetable]
    ViewTimetable --> SearchFilter[Search / Filter Schedule]
    SearchFilter --> ViewDetails[View Class Details]
    ViewDetails --> Choice

    %% End
    Choice -->|Exit| Stop((Stop))
```

## Description
1. **Start**: User lands on the Dashboard.
2. **Navigation**: User chooses between Managing Data, Creating Schedule, or Viewing Schedule.
3. **Manage Data**: User can add, update, or remove Courses, Instructors, and Rooms.
4. **Create Schedule**:
    - The core activity is selecting a tuple of (Course, Section, Instructor, Room, Timeslot).
    - The system filters Sections based on Course.
    - The system filters Rooms based on Course Type (e.g., Lab vs Lecture).
    - User can manually check for conflicts before submitting.
    - Upon submission, the system validates again. If conflicts exist, they are displayed.
    - If valid, the entry is saved.
5. **View Schedule**: User can check the final timetable and search for specific entries.
