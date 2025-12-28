# Database Schema

## Tables

### users
Stores advocate/lawyer information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key | Unique user identifier |
| email | String(120) | Unique, Not Null, Indexed | User email address |
| password_hash | String(255) | Not Null | Hashed password |
| full_name | String(100) | Not Null | Full name of advocate |
| bar_council_id | String(50) | Unique | Bar Council registration ID |
| phone | String(20) | - | Contact phone number |
| address | Text | - | Physical address |
| is_active | Boolean | Default: True | Account status |
| created_at | DateTime | Default: UTC Now | Account creation timestamp |
| updated_at | DateTime | Default: UTC Now | Last update timestamp |

**Relationships:**
- One-to-Many with `cases`
- One-to-Many with `clients`
- One-to-Many with `calendar_events`

---

### clients
Stores client information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key | Unique client identifier |
| user_id | Integer | Foreign Key (users.id), Not Null | Reference to advocate |
| name | String(100) | Not Null | Client name |
| email | String(120) | - | Client email |
| phone | String(20) | - | Client phone |
| address | Text | - | Client address |
| notes | Text | - | Additional notes about client |
| created_at | DateTime | Default: UTC Now | Record creation timestamp |
| updated_at | DateTime | Default: UTC Now | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- One-to-Many with `cases`

---

### cases
Stores case information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key | Unique case identifier |
| user_id | Integer | Foreign Key (users.id), Not Null | Reference to advocate |
| client_id | Integer | Foreign Key (clients.id), Not Null | Reference to client |
| case_number | String(100) | Unique, Not Null | Unique case number |
| title | String(200) | Not Null | Case title |
| case_type | String(50) | - | Type (Civil, Criminal, Family, etc.) |
| court_name | String(200) | - | Name of court |
| filing_date | Date | - | Date case was filed |
| status | String(50) | Default: 'Active' | Case status |
| description | Text | - | Detailed case description |
| notes | Text | - | Case notes |
| created_at | DateTime | Default: UTC Now | Record creation timestamp |
| updated_at | DateTime | Default: UTC Now | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- Many-to-One with `clients`
- One-to-Many with `documents`
- One-to-Many with `calendar_events`

---

### documents
Stores case document information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key | Unique document identifier |
| case_id | Integer | Foreign Key (cases.id), Not Null | Reference to case |
| title | String(200) | Not Null | Document title |
| file_name | String(255) | Not Null | Original filename |
| file_url | String(500) | Not Null | URL/path to file |
| file_type | String(50) | - | File extension |
| file_size | Integer | - | File size in bytes |
| description | Text | - | Document description |
| uploaded_at | DateTime | Default: UTC Now | Upload timestamp |

**Relationships:**
- Many-to-One with `cases`

---

### calendar_events
Stores calendar events and reminders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key | Unique event identifier |
| user_id | Integer | Foreign Key (users.id), Not Null | Reference to advocate |
| case_id | Integer | Foreign Key (cases.id) | Reference to case (optional) |
| title | String(200) | Not Null | Event title |
| description | Text | - | Event description |
| event_type | String(50) | - | Type (Hearing, Meeting, Deadline) |
| event_date | DateTime | Not Null | Event date and time |
| location | String(200) | - | Event location |
| reminder_time | Integer | - | Reminder minutes before event |
| is_completed | Boolean | Default: False | Completion status |
| created_at | DateTime | Default: UTC Now | Record creation timestamp |
| updated_at | DateTime | Default: UTC Now | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- Many-to-One with `cases` (optional)

---

## Relationships Diagram

```
users (1) ----< (M) clients
  |
  |----< (M) cases
  |
  |----< (M) calendar_events

clients (1) ----< (M) cases

cases (1) ----< (M) documents
  |
  |----< (M) calendar_events
```

---

## Indexes

- `users.email` - Unique index for fast email lookups
- `cases.case_number` - Unique index for case number searches
- Foreign key columns are automatically indexed

---

## Cascading Deletes

- Deleting a user will delete all associated clients, cases, and calendar events
- Deleting a client will delete all associated cases
- Deleting a case will delete all associated documents and calendar events
