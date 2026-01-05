# Use Case Diagram - Class Scheduler Pro

```mermaid
usecaseDiagram
    actor "Scheduler / Admin" as User
    
    usecase "Manage Courses" as UC1
    usecase "Manage Instructors" as UC2
    usecase "Manage Rooms" as UC3
    usecase "Create Schedule Entry" as UC4
    usecase "Validate Schedule\n(Check Conflicts)" as UC5
    usecase "View Timetable" as UC6
    usecase "Search Schedule" as UC7
    usecase "Delete Schedule Entry" as UC8

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC6
    User --> UC7
    User --> UC8

    %% Relationships
    UC4 ..> UC5 : <<include>>
    
    note right of UC5
        Checks for:
        - Room double booking
        - Instructor double booking
        - Section overlaps
        - Capacity constraints
    end note
```

## Description
This diagram illustrates the primary interactions between the **User** (Scheduler/Admin) and the **Class Scheduler Pro System**.

### Actors
- **Scheduler / Admin**: The person responsible for setting up the academic data and generating the class schedule.

### Use Cases
1.  **Manage Resources** (UC1, UC2, UC3): The user maintains the database of Courses, Instructors, and Rooms.
2.  **Create Schedule Entry** (UC4): The core function where the user assigns a specific Course Section to an Instructor and a Room at a specific Time.
3.  **Validate Schedule** (UC5): deeply integrated into creation. Every time a schedule entry is proposed, the system validates constraints (time conflicts, room capacity, instructor availability).
4.  **Manage Schedule**: Users can View (UC6), Search (UC7), and Delete (UC8) entries to refine the final timetable.
