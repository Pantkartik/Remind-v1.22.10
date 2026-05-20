# RemindKaro — Production Development Guide
## Version 1.0 | Industry Standards & Best Practices

---

## Table of Contents
1. [Code Quality & Clean Code Standards](#1-code-quality--clean-code-standards)
2. [Frontend Development Best Practices](#2-frontend-development-best-practices)
3. [Backend Development Best Practices](#3-backend-development-best-practices)
4. [Database & Data Management](#4-database--data-management)
5. [API Design & Architecture](#5-api-design--architecture)
6. [Voice & NLP Integration](#6-voice--nlp-integration)
7. [Notification & Queue System](#7-notification--queue-system)
8. [Authentication & Security](#8-authentication--security)
9. [UI/UX Aesthetic Design System](#9-uiux-aesthetic-design-system)
10. [Common Pitfalls & How to Avoid Them](#10-common-pitfalls--how-to-avoid-them)
11. [Testing & Quality Assurance](#11-testing--quality-assurance)
12. [Deployment & DevOps](#12-deployment--devops)
13. [Debugging & Troubleshooting Guide](#13-debugging--troubleshooting-guide)
14. [Project Structure & Folder Organization](#14-project-structure--folder-organization)

---

## 1. Code Quality & Clean Code Standards

### 1.1 General Clean Code Principles

#### Variables & Naming
```javascript
// ❌ AVOID
let d = new Date();
let t = 24;
let x = calculateThing(y);

// ✅ DO
let currentDate = new Date();
let taskCountLimit = 24;
let estimatedCompletionTime = calculateEstimatedTime(taskDueDate);
```

**Rules:**
- Use descriptive, searchable names
- Avoid single-letter variables (except loops/indices)
- Use pronounceable names
- Use problem domain terminology
- Avoid misleading names
- One concept per variable name

#### Functions & Methods
```javascript
// ❌ AVOID
const process = (task) => {
  // 50 lines of mixed logic
  // handles validation, transformation, API call, notification
}

// ✅ DO
const validateTaskData = (task) => { /* validation only */ }
const transformTaskForAPI = (task) => { /* transformation only */ }
const sendTaskNotification = (task) => { /* notification only */ }

// Functions should do ONE thing well
```

**Rules:**
- Single Responsibility Principle (SRP)
- Pure functions when possible
- Small functions (max 20-30 lines)
- Descriptive function names that explain intent
- Max 3 parameters (use objects for more)
- No side effects unless documented

#### Comments & Documentation
```javascript
// ❌ AVOID
// increment i
i++;

// Loops through tasks
for (let task of tasks) {
  // do something
}

// ✅ DO
// Move to next iteration for completed tasks
i++;

/**
 * Escalate reminder urgency for ignored high-priority tasks
 * @param {Array} tasks - Array of task objects
 * @param {Number} ignoredCount - Number of ignored reminders
 * @returns {Array} Tasks with updated urgency flags
 */
const escalateTaskUrgency = (tasks, ignoredCount) => {
  // implementation
}

// Process tasks that approach deadline (< 24 hours)
for (let task of tasks) {
  if (isApproachingDeadline(task)) {
    escalateReminder(task);
  }
}
```

**Rules:**
- Comments explain WHY, not WHAT
- Keep comments in sync with code
- Use JSDoc for functions
- Avoid redundant comments
- Code should be self-documenting

### 1.2 File Organization

```
- Max 300-400 lines per file
- Related logic in same module
- Separate concerns: logic, presentation, services
- Use barrel exports (index.js) for modules
```

### 1.3 Code Formatting Standards

Use **Prettier** with consistent config:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

Use **ESLint** rules:
- `eslint:recommended`
- `prettier` integration
- `react-hooks` rules (if using React)

### 1.4 Error Handling

```javascript
// ❌ AVOID
try {
  const response = await fetchTasks();
  return response;
} catch (e) {
  console.log("error");
}

// ✅ DO
try {
  const response = await fetchTasks();
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.data;
} catch (error) {
  logger.error('Task fetch failed', {
    message: error.message,
    stack: error.stack,
    context: 'TaskService.fetchTasks'
  });
  throw new AppError('Unable to load tasks. Please try again.', 'TASK_FETCH_ERROR');
}
```

**Rules:**
- Use try-catch for async operations
- Log errors with context
- Create custom error classes
- Never swallow errors silently
- Provide meaningful error messages to users

---

## 2. Frontend Development Best Practices

### 2.1 React/React Native Standards

#### Component Structure
```javascript
// ✅ CORRECT STRUCTURE

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './TaskCard.module.css';
import { formatDate } from '../utils/dateFormatter';
import { taskAPI } from '../services/api';

/**
 * Displays a single task with priority indicator and quick actions
 * @component
 */
const TaskCard = ({ taskId, onStatusChange, onDelete }) => {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch task data
  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true);
        const data = await taskAPI.fetchTask(taskId);
        setTask(data);
      } catch (error) {
        logger.error('Failed to load task', { taskId, error });
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // Memoize expensive calculations
  const daysUntilDeadline = useMemo(() => {
    if (!task) return null;
    return Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  }, [task]);

  const handleStatusToggle = async (newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      setTask({ ...task, status: newStatus });
      onStatusChange?.(taskId, newStatus);
    } catch (error) {
      logger.error('Status update failed', { taskId, newStatus });
    }
  };

  if (isLoading) return <TaskCardSkeleton />;
  if (!task) return null;

  return (
    <div className={`${styles.card} ${styles[task.priority]}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.priority}>{task.priority}</span>
      </div>
      <p className={styles.description}>{task.description}</p>
      <div className={styles.meta}>
        <span className={styles.deadline}>{formatDate(task.deadline)}</span>
        <span className={styles.urgency}>
          {daysUntilDeadline === 0 && '🔴 Today'}
          {daysUntilDeadline === 1 && '🟠 Tomorrow'}
          {daysUntilDeadline > 1 && `📅 ${daysUntilDeadline}d`}
        </span>
      </div>
      <div className={styles.actions}>
        <button onClick={() => handleStatusToggle('completed')}>Complete</button>
        <button onClick={() => onDelete?.(taskId)}>Delete</button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
  onDelete: PropTypes.func,
};

TaskCard.defaultProps = {
  onStatusChange: null,
  onDelete: null,
};

export default TaskCard;
```

**Component Best Practices:**
- Use functional components with hooks
- Define PropTypes for all props
- Set defaultProps for optional props
- Separate styles into modules
- Use custom hooks for reusable logic
- Keep components small and focused

#### State Management
```javascript
// ✅ USE CONTEXT API for shared state

import { createContext, useContext, useReducer } from 'react';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};
```

**For complex state, consider:**
- Redux Toolkit (if app grows)
- Zustand (lightweight alternative)
- Jotai (modern atoms approach)

#### Custom Hooks
```javascript
// ✅ GOOD CUSTOM HOOK PATTERN

export const useTaskFetch = (taskId) => {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const controller = new AbortController();
    const loadTask = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await taskAPI.fetchTask(taskId, {
          signal: controller.signal,
        });
        setTask(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();

    return () => controller.abort();
  }, [taskId]);

  return { task, isLoading, error, refetch: () => loadTask() };
};
```

### 2.2 Mobile Optimization (React Native)

```javascript
// ✅ PERFORMANCE: Memoize expensive components

import { memo } from 'react';

const TaskList = memo(({ tasks, onTaskPress }) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard task={item} onPress={() => onTaskPress(item.id)} />
      )}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
});

export default TaskList;
```

**Mobile Optimization:**
- Use FlatList for large lists (not ScrollView)
- Memoize heavy components
- Lazy load images
- Optimize re-renders with useMemo/useCallback
- Use native modules for performance-critical tasks

### 2.3 State Updates Best Practices

```javascript
// ❌ AVOID: Direct state mutation
state.task.status = 'completed'; // Wrong!

// ✅ DO: Create new object
const updatedTask = { ...state.task, status: 'completed' };
setState(updatedTask);

// ✅ DO: For nested updates, use spread operator
const updatedState = {
  ...state,
  tasks: state.tasks.map(t =>
    t.id === taskId ? { ...t, status: 'completed' } : t
  ),
};
setState(updatedState);
```

---

## 3. Backend Development Best Practices

### 3.1 Node.js/Express Architecture

#### Layered Architecture
```
src/
├── controllers/     # Request handling
├── services/        # Business logic
├── repositories/    # Database access
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── models/          # Data models/schemas
├── utils/           # Helper functions
├── config/          # Configuration
└── validators/      # Input validation
```

#### Service Layer Pattern
```javascript
// ✅ CORRECT: Separation of concerns

// controller/taskController.js
export const createTask = async (req, res, next) => {
  try {
    const { error, value } = validateCreateTaskRequest(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const task = await taskService.createTask(value, req.user.id);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error); // Pass to error middleware
  }
};

// services/taskService.js
export const createTask = async (taskData, userId) => {
  // Business logic
  const task = {
    ...taskData,
    userId,
    createdAt: new Date(),
    status: 'pending',
  };

  // Calculate reminder schedule
  task.reminders = generateReminderSchedule(task.priority, task.deadline);

  // Save to database
  const savedTask = await taskRepository.create(task);

  // Queue reminder jobs
  await reminderQueue.schedule(savedTask);

  return savedTask;
};

// repositories/taskRepository.js
export const create = async (taskData) => {
  const result = await db.query(
    `INSERT INTO tasks (user_id, title, description, deadline, priority, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      taskData.userId,
      taskData.title,
      taskData.description,
      taskData.deadline,
      taskData.priority,
      taskData.status,
      taskData.createdAt,
    ]
  );
  return result.rows[0];
};
```

**Benefits:**
- Easy to test (mock services/repositories)
- Clear separation of concerns
- Reusable business logic
- Easy to refactor

### 3.2 Error Handling

```javascript
// ✅ GLOBAL ERROR HANDLER

// utils/errors.js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  logger.error('Request error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err.details }),
    },
  });
};

// routes/tasks.js
app.post('/tasks', async (req, res, next) => {
  try {
    // ... logic
  } catch (error) {
    if (error instanceof ValidationError) {
      next(error);
    } else {
      next(new AppError('Failed to create task'));
    }
  }
});
```

### 3.3 Input Validation

```javascript
// ✅ USE JOI for schema validation

import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().max(1000),
  deadline: Joi.date().required().min('now'),
  priority: Joi.string().valid('high', 'medium', 'low').required(),
  category: Joi.string().valid('hackathon', 'assignment', 'coding-test', 'interview', 'work', 'personal').required(),
  recurring: Joi.string().valid('daily', 'weekly', 'monthly', null),
});

export const validateCreateTaskRequest = (data) => {
  return createTaskSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
};

// In controller
const { error, value } = validateCreateTaskRequest(req.body);
if (error) {
  throw new ValidationError('Invalid task data', error.details);
}
```

### 3.4 Logging Standards

```javascript
// ✅ STRUCTURED LOGGING

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Usage
logger.info('Task created', {
  taskId: task.id,
  userId: user.id,
  priority: task.priority,
});

logger.error('Reminder failed', {
  taskId: task.id,
  reminderTime: reminder.scheduledTime,
  error: error.message,
});
```

---

## 4. Database & Data Management

### 4.1 PostgreSQL Schema Design

```sql
-- ✅ PRODUCTION-READY SCHEMA

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Tasks Table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline TIMESTAMP NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'missed', 'archived')),
  category VARCHAR(50),
  recurring VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_user_deadline ON tasks(user_id, deadline);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  notification_time TIMESTAMP NOT NULL,
  notification_type VARCHAR(50),
  sent_status VARCHAR(20) CHECK (sent_status IN ('pending', 'sent', 'failed')),
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_task_id ON notifications(task_id);
CREATE INDEX idx_notifications_sent_status ON notifications(sent_status);
CREATE INDEX idx_notifications_notification_time ON notifications(notification_time);

-- Reminder Rules Table
CREATE TABLE reminder_rules (
  id SERIAL PRIMARY KEY,
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  reminder_offsets INTEGER[] NOT NULL,  -- Array of hours before deadline
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  table_name VARCHAR(100),
  operation VARCHAR(10),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 4.2 Query Optimization

```javascript
// ❌ AVOID: N+1 Query Problem
const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
for (let task of tasks) {
  task.notifications = await db.query('SELECT * FROM notifications WHERE task_id = $1', [task.id]);
}

// ✅ DO: Use JOIN
const tasksWithNotifications = await db.query(`
  SELECT t.*, json_agg(n.*) as notifications
  FROM tasks t
  LEFT JOIN notifications n ON t.id = n.task_id
  WHERE t.user_id = $1
  GROUP BY t.id
`, [userId]);

// ✅ DO: Use connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 4.3 Data Consistency

```javascript
// ✅ USE TRANSACTIONS for related updates

const client = await pool.connect();
try {
  await client.query('BEGIN');

  const result = await client.query(
    'INSERT INTO tasks (...) VALUES (...) RETURNING id',
    [...]
  );
  const taskId = result.rows[0].id;

  await client.query(
    'INSERT INTO notifications (...) VALUES (...)',
    [taskId, ...]
  );

  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

---

## 5. API Design & Architecture

### 5.1 RESTful Standards

```javascript
// ✅ CORRECT REST CONVENTIONS

// Resource endpoints
GET    /api/v1/tasks              // List all tasks
POST   /api/v1/tasks              // Create task
GET    /api/v1/tasks/:id          // Get specific task
PUT    /api/v1/tasks/:id          // Update task
DELETE /api/v1/tasks/:id          // Delete task

// Filtered endpoints
GET    /api/v1/tasks?status=pending&priority=high
GET    /api/v1/tasks?deadline=2024-01-15

// Sub-resources
GET    /api/v1/tasks/:id/notifications
POST   /api/v1/tasks/:id/complete  // Custom action on sub-resource

// Versioning in URL
/api/v1/tasks
/api/v2/tasks
```

### 5.2 Response Format

```javascript
// ✅ CONSISTENT RESPONSE FORMAT

// Success Response
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Amazon OA",
    "deadline": "2024-01-20T11:00:00Z",
    "priority": "high",
    "status": "pending"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid task data",
    "details": [
      { "field": "deadline", "message": "Must be in future" }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

// List Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 5.3 Rate Limiting

```javascript
// ✅ IMPLEMENT RATE LIMITING

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.post('/auth/login', authLimiter, loginController);
```

---

## 6. Voice & NLP Integration

### 6.1 Voice Capture (React Native)

```javascript
// ✅ PROPER VOICE IMPLEMENTATION

import Voice from '@react-native-voice/voice';

export const useVoiceTask = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (result) => {
      setTranscript(result.value[0]);
    };
    Voice.onSpeechError = (error) => {
      setError(error);
    };

    return () => {
      Voice.destroy().remove();
    };
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      await Voice.start('en-US');
    } catch (err) {
      setError(err);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      setError(err);
    }
  };

  return { isListening, transcript, error, startListening, stopListening };
};
```

### 6.2 NLP Parsing Backend

```javascript
// ✅ PRODUCTION NLP PARSING

import chrono from 'chrono-node';
import nlp from 'compromise';

export const parseVoiceCommand = (text) => {
  try {
    // Extract date/time
    const chronoResults = chrono.parse(text);
    let deadline = null;

    if (chronoResults.length > 0) {
      deadline = new Date(chronoResults[0].start.date());
    }

    // Extract task meaning and priority
    const doc = nlp(text);
    const taskTitle = extractTaskTitle(doc);
    const priority = extractPriority(doc);
    const category = extractCategory(doc);

    // Validation
    if (!taskTitle || taskTitle.length < 3) {
      throw new Error('Could not extract task from voice input');
    }

    if (!deadline) {
      throw new Error('Could not extract deadline from voice input');
    }

    return {
      title: taskTitle,
      deadline,
      priority,
      category,
      raw: text,
    };
  } catch (error) {
    throw new Error(`Voice parsing failed: ${error.message}`);
  }
};

const extractTaskTitle = (doc) => {
  // Remove time-related words and extract core task
  const cleaned = doc
    .remove('(tomorrow|today|tonight|next week|in [0-9]+ (hours|days|weeks))')
    .text()
    .trim();
  return cleaned;
};

const extractPriority = (doc) => {
  if (doc.has('(urgent|asap|immediately|high)')) return 'high';
  if (doc.has('(low|whenever)')) return 'low';
  return 'medium';
};

const extractCategory = (doc) => {
  if (doc.has('(hackathon|competition)')) return 'hackathon';
  if (doc.has('(assignment|homework)')) return 'assignment';
  if (doc.has('(coding|oa|assessment)')) return 'coding-test';
  if (doc.has('(interview)')) return 'interview';
  return 'work';
};
```

---

## 7. Notification & Queue System

### 7.1 Redis Queue Setup (BullMQ)

```javascript
// ✅ PRODUCTION-GRADE QUEUE SYSTEM

import Queue from 'bull';
import Redis from 'ioredis';

// Initialize connection
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// Create reminder queue
export const reminderQueue = new Queue('reminders', { redis });

// Process reminder jobs
reminderQueue.process(async (job) => {
  const { taskId, notificationId } = job.data;

  try {
    const notification = await notificationService.getNotification(notificationId);
    
    // Send notification
    await fcmService.sendNotification({
      userId: notification.userId,
      taskId,
      message: generateNotificationMessage(notification),
    });

    // Mark as sent
    await notificationService.markAsSent(notificationId);

  } catch (error) {
    logger.error('Reminder job failed', { taskId, notificationId, error });
    
    // Retry with exponential backoff
    throw error;
  }
});

// Handle job failures
reminderQueue.on('failed', async (job, err) => {
  logger.error('Job failed after retries', { jobId: job.id, error: err.message });
  
  // Send alert to developer
  await alertService.notifyFailedJob(job, err);
});

// Export queue API
export const scheduleReminder = async (task, notificationTime) => {
  const delayMs = notificationTime - Date.now();
  
  if (delayMs < 0) {
    throw new Error('Notification time is in the past');
  }

  const job = await reminderQueue.add(
    {
      taskId: task.id,
      notificationId: task.nextNotification.id,
    },
    {
      delay: delayMs,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    }
  );

  return job;
};
```

### 7.2 Firebase Cloud Messaging

```javascript
// ✅ FCM SETUP

import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export const fcmService = {
  async sendNotification({ userId, taskId, message }) {
    try {
      // Get user's FCM tokens
      const tokens = await userService.getUserFCMTokens(userId);

      if (tokens.length === 0) {
        logger.warn('No FCM tokens for user', { userId });
        return;
      }

      const payload = {
        notification: {
          title: 'RemindKaro',
          body: message,
        },
        data: {
          taskId: taskId.toString(),
          type: 'task_reminder',
        },
      };

      // Send to all tokens
      const results = await admin.messaging().sendMulticast({
        tokens,
        ...payload,
      });

      // Clean up invalid tokens
      const tokensToDelete = [];
      results.responses.forEach((response, index) => {
        if (!response.success) {
          const errorCode = response.error.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToDelete.push(tokens[index]);
          }
        }
      });

      if (tokensToDelete.length > 0) {
        await userService.removeFCMTokens(userId, tokensToDelete);
      }

      return results;
    } catch (error) {
      logger.error('FCM send failed', { userId, taskId, error });
      throw error;
    }
  },
};
```

---

## 8. Authentication & Security

### 8.1 Firebase Authentication Setup

```javascript
// ✅ SECURE AUTH IMPLEMENTATION

import admin from 'firebase-admin';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'MISSING_AUTH_TOKEN' },
    });
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    logger.error('Token verification failed', { error });
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_AUTH_TOKEN' },
    });
  }
};

// Sign up endpoint
export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    const { error, value } = signupSchema.validate({ email, password, name });
    if (error) throw new ValidationError('Invalid signup data', error.details);

    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create user in database
    const user = await userService.createUser({
      firebaseId: userRecord.uid,
      email,
      name,
    });

    res.status(201).json({
      success: true,
      data: { userId: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // Revoke user session
    await admin.auth().revokeRefreshTokens(req.user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
```

### 8.2 Security Best Practices

```javascript
// ✅ SECURITY HEADERS

import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ ENVIRONMENT VARIABLES
// Never commit .env files
require('dotenv').config();

// ✅ RATE LIMITING
// Already covered in section 5.3

// ✅ INPUT SANITIZATION
import mongoSanitize from 'mongo-sanitize';
import xss from 'xss-clean';

app.use(mongoSanitize());
app.use(xss());

// ✅ HTTPS ONLY
const sslRedirect = () => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure) {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  };
};

app.use(sslRedirect());

// ✅ PASSWORD HASHING
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
```

---

## 9. UI/UX Aesthetic Design System

### 9.1 Design Philosophy

RemindKaro's UI should communicate:
- **Urgency** through color and typography
- **Clarity** through minimal, focused layouts
- **Trustworthiness** through consistent patterns
- **Engagement** through delightful micro-interactions

**Aesthetic Direction:** Modern, purposeful productivity design with subtle urgency cues.

### 9.2 Color System

```css
/* ✅ PRIMARY COLORS */
--color-primary-urgent: #E63946;    /* Red for high priority */
--color-primary-medium: #F77F00;    /* Orange for medium priority */
--color-primary-low: #06A77D;       /* Green for low priority */

/* ✅ NEUTRAL PALETTE */
--color-background: #0F0E17;        /* Deep charcoal */
--color-surface: #1A1927;           /* Slightly lighter surface */
--color-surface-hover: #2A2935;     /* Interactive state */
--color-border: #3A3847;            /* Subtle dividers */

/* ✅ TEXT COLORS */
--color-text-primary: #F5F5F5;      /* Main text */
--color-text-secondary: #B8B8C8;    /* Secondary text */
--color-text-tertiary: #8A8A9E;    /* Disabled/hint text */

/* ✅ SEMANTIC COLORS */
--color-success: #06A77D;
--color-warning: #FFB703;
--color-error: #E63946;
--color-info: #4F46E5;
```

### 9.3 Typography System

```css
/* ✅ FONT STACK */
font-family: 'Inter', 'Segoe UI', sans-serif;

/* ✅ HEADING HIERARCHY */
--font-size-h1: 32px;      /* 2rem | Titles */
--font-size-h2: 24px;      /* 1.5rem | Section headers */
--font-size-h3: 18px;      /* 1.125rem | Subsections */
--font-size-body: 14px;    /* Base body text */
--font-size-sm: 12px;      /* Captions, labels */

--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* ✅ LINE HEIGHTS */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* ✅ LETTER SPACING */
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-loose: 0.05em;
```

### 9.4 Component Design Patterns

```jsx
// ✅ TASK CARD WITH URGENCY INDICATORS

const TaskCard = ({ task, onComplete, onDelete }) => {
  const getUrgencyBadge = () => {
    const hoursUntilDeadline = getHoursUntilDeadline(task.deadline);
    
    if (hoursUntilDeadline < 1) {
      return <div className="badge badge-urgent">Due NOW</div>;
    } else if (hoursUntilDeadline < 6) {
      return <div className="badge badge-urgent">{Math.round(hoursUntilDeadline)}h left</div>;
    } else if (hoursUntilDeadline < 24) {
      return <div className="badge badge-warning">Today</div>;
    }
    return null;
  };

  return (
    <div className={`task-card task-card--${task.priority}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        {getUrgencyBadge()}
      </div>
      
      <p className="task-card__description">{task.description}</p>
      
      <div className="task-card__footer">
        <span className="task-card__deadline">
          📅 {formatDeadline(task.deadline)}
        </span>
        <div className="task-card__actions">
          <button className="btn btn-complete" onClick={onComplete}>
            ✓ Complete
          </button>
          <button className="btn btn-delete" onClick={onDelete}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};
```

```css
/* ✅ TASK CARD STYLES */

.task-card {
  padding: 16px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

/* Priority-based styling */
.task-card--high {
  border-left: 4px solid var(--color-primary-urgent);
}

.task-card--medium {
  border-left: 4px solid var(--color-primary-medium);
}

.task-card--low {
  border-left: 4px solid var(--color-primary-low);
}

/* Hover state */
.task-card:hover {
  background: var(--color-surface-hover);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-card__title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-tight);
}

.badge-urgent {
  background: var(--color-primary-urgent);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.task-card__description {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  line-height: var(--line-height-normal);
}

.task-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.task-card__actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.btn-complete {
  background: var(--color-primary-low);
  color: white;
}

.btn-complete:hover {
  background: #05916A;
  transform: scale(1.05);
}

.btn-delete {
  background: transparent;
  color: var(--color-text-tertiary);
}

.btn-delete:hover {
  color: var(--color-primary-urgent);
}
```

### 9.5 Animation & Micro-interactions

```css
/* ✅ ENTRANCE ANIMATIONS */

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-card {
  animation: slideIn 0.3s ease-out;
  animation-delay: var(--animation-delay, 0);
}

/* Stagger animation for list items */
.task-card:nth-child(1) { --animation-delay: 0ms; }
.task-card:nth-child(2) { --animation-delay: 50ms; }
.task-card:nth-child(3) { --animation-delay: 100ms; }
.task-card:nth-child(n+4) { --animation-delay: 150ms; }

/* ✅ LOADING SKELETON */

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-hover) 50%,
    var(--color-surface) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

/* ✅ FORM VALIDATION */

.input {
  border: 2px solid var(--color-border);
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--color-primary-info);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: 4px;
  animation: slideIn 0.2s ease-out;
}
```

---

## 10. Common Pitfalls & How to Avoid Them

### 10.1 Backend Pitfalls

| Pitfall | Impact | Solution |
|---------|--------|----------|
| No pagination on list endpoints | Crashes with 1M+ records | Implement cursor-based or offset pagination |
| Storing passwords in plain text | Security breach | Always use bcrypt/Argon2 hashing |
| No retry logic for notifications | Missed notifications | Use queues with exponential backoff |
| Hard-coded configuration | Environment leaks | Use .env files for all secrets |
| No database indices | Queries timeout | Index on frequently queried columns (user_id, deadline) |
| Synchronous heavy operations | Blocks event loop | Use async/await and offload to queues |
| Missing error logging | Can't debug production | Implement structured logging everywhere |
| No database backups | Data loss | Set up automated backups with encryption |

### 10.2 Frontend Pitfalls

| Pitfall | Impact | Solution |
|---------|--------|----------|
| Direct DOM manipulation in React | Memory leaks, bugs | Always use state/hooks |
| No error boundaries | White screen of death | Wrap components in error boundaries |
| Storing auth tokens in localStorage | XSS vulnerability | Use httpOnly cookies or memory storage |
| Not unsubscribing from listeners | Memory leaks | Clean up subscriptions in useEffect return |
| Rendering large lists without virtualization | Jank, crashes | Use react-window or similar |
| No loading states | Poor UX | Always show skeleton/loading indicator |
| API key in frontend code | Security issue | Never expose API keys, use backend proxy |
| No debouncing for search inputs | Sends 100 requests/sec | Use debounce/throttle utilities |

### 10.3 Voice Integration Pitfalls

| Pitfall | Impact | Solution |
|---------|--------|----------|
| No timeout for voice capture | Users stuck on mic | Set 30-60s timeout |
| Not handling mic permission denial | Crash or unclear error | Check permissions before starting |
| Parsing accent variations | Fails to recognize task | Use ML-based NLP, not regex |
| No fallback to manual entry | User frustrated | Always allow manual task creation |
| Not testing with real audio | Fails in production | Test with actual user voice samples |

### 10.4 Notification Pitfalls

| Pitfall | Impact | Solution |
|---------|--------|----------|
| No retry logic | Missed notifications | Implement exponential backoff (3-5 retries) |
| All reminders send at same time | Server overload | Use jitter to spread notifications |
| Storing invalid FCM tokens | Silent failures | Validate and remove bad tokens |
| No opt-out mechanism | Spam complaints | Provide notification preference settings |
| Not testing notification delivery | Works in dev, fails in prod | Test with real devices/tokens |

---

## 11. Testing & Quality Assurance

### 11.1 Unit Testing

```javascript
// ✅ JEST UNIT TESTS

import { parseVoiceCommand } from '../services/voiceParser';

describe('Voice Command Parser', () => {
  describe('parseVoiceCommand', () => {
    it('should parse basic task with deadline', () => {
      const result = parseVoiceCommand('Remind me to submit project tomorrow at 11 PM');
      
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('deadline');
      expect(result.title).toContain('submit');
      expect(result.priority).toBe('medium');
    });

    it('should detect high priority tasks', () => {
      const result = parseVoiceCommand('Urgent: Amazon OA ASAP');
      expect(result.priority).toBe('high');
    });

    it('should extract category from keywords', () => {
      const result = parseVoiceCommand('Hackathon submission due next Friday');
      expect(result.category).toBe('hackathon');
    });

    it('should throw error if no deadline found', () => {
      expect(() => {
        parseVoiceCommand('Remember this thing');
      }).toThrow();
    });

    it('should handle recurring tasks', () => {
      const result = parseVoiceCommand('Remind me every day at 7 PM to code');
      expect(result.recurring).toBe('daily');
    });
  });
});
```

### 11.2 Integration Testing

```javascript
// ✅ SUPERTEST API INTEGRATION TESTS

import request from 'supertest';
import app from '../app';

describe('Task API', () => {
  const authToken = 'valid-firebase-token';

  describe('POST /api/v1/tasks', () => {
    it('should create task with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Amazon OA',
          deadline: '2024-01-20T11:00:00Z',
          priority: 'high',
          category: 'coding-test',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Amazon OA');
    });

    it('should reject invalid deadline', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task',
          deadline: '2020-01-01T00:00:00Z', // Past
          priority: 'medium',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should schedule reminders on task creation', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
        });

      expect(response.status).toBe(201);
      // Verify reminders were queued
      const reminders = await reminderQueue.getJobs(['scheduled']);
      expect(reminders.length).toBeGreaterThan(0);
    });
  });
});
```

### 11.3 E2E Testing (Detox/Cypress)

```javascript
// ✅ DETOX E2E TEST (React Native)

describe('Task Creation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create task via voice', async () => {
    // Navigate to add task screen
    await element(by.id('btn-add-task')).tap();

    // Tap microphone button
    await element(by.id('btn-mic')).tap();

    // Simulate voice input
    // (In real test, this would integrate with device microphone)
    await element(by.id('voice-input')).multiTap(1);

    // Wait for parsing
    await waitFor(element(by.text('Confirm Task')))
      .toBeVisible()
      .withTimeout(5000);

    // Confirm
    await element(by.id('btn-confirm')).tap();

    // Verify task appears in list
    await waitFor(element(by.text('Amazon OA')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
```

### 11.4 Performance Testing

```javascript
// ✅ LIGHTHOUSE & PERFORMANCE METRICS

// Use these metrics to monitor
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms
- Time to Interactive (TTI): < 3.5s

// Test with Lighthouse CI
npm install -g @lhci/cli@latest
lhci autorun

// Monitor in production
import { web_vitals } from './utils/webVitals';
web_vitals(onMetric);
```

---

## 12. Deployment & DevOps

### 12.1 Deployment Checklist

```markdown
## Pre-Deployment

- [ ] All tests passing (unit, integration, E2E)
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Error logging verified

## Deployment Steps

1. Build artifacts
   ```bash
   npm run build
   ```

2. Run database migrations
   ```bash
   npm run migrate:prod
   ```

3. Deploy to production
   ```bash
   npm run deploy
   ```

4. Smoke tests
   ```bash
   npm run smoke-tests
   ```

5. Monitor error rates
   - Check Sentry for errors
   - Monitor database query times
   - Check API response times

## Rollback Plan

If critical issue found:
```bash
npm run rollback:previous-version
```
```

### 12.2 Docker Setup

```dockerfile
# ✅ PRODUCTION DOCKERFILE

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

ENV NODE_ENV=production
EXPOSE 3000

USER nodejs

CMD ["node", "src/server.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

### 12.3 Environment Configuration

```bash
# ✅ .env.production

# Database
DATABASE_URL=postgresql://user:pass@db.example.com:5432/remindkaro_prod

# Redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# Firebase
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}

# API
NODE_ENV=production
API_URL=https://api.remindkaro.com
FRONTEND_URL=https://remindkaro.com
PORT=3000

# Logging
LOG_LEVEL=info
SENTRY_DSN=${SENTRY_DSN}

# Security
JWT_SECRET=${JWT_SECRET}
```

---

## 13. Debugging & Troubleshooting Guide

### 13.1 Common Issues & Solutions

#### Issue: Reminders Not Sending

```javascript
// 1. Check Redis queue
redis-cli
> LLEN bull:reminders:inprogress
> LLEN bull:reminders:failed

// 2. Check Firebase tokens
const tokens = await userService.getUserFCMTokens(userId);
console.log('User tokens:', tokens);

// 3. Check queue processing
reminderQueue.on('process', (job) => {
  console.log('Processing reminder:', job.id, job.data);
});

reminderQueue.on('failed', (job, err) => {
  console.error('Job failed:', job.id, err.message);
});

// 4. Manual test
const result = await fcmService.sendNotification({
  userId: 'test-user',
  taskId: 'test-task',
  message: 'Test reminder'
});
console.log('FCM result:', result);
```

#### Issue: Voice Parsing Not Recognizing Tasks

```javascript
// 1. Debug speech-to-text
Voice.onSpeechResults = (result) => {
  console.log('Raw transcript:', result.value);
};

// 2. Debug NLP parsing
const parsed = parseVoiceCommand('Remind me about Amazon OA tomorrow');
console.log('Parsed:', parsed);

// 3. Test chrono date parsing
const results = chrono.parse('tomorrow at 8 PM');
console.log('Chrono results:', results);

// 4. Check NLP doc extraction
const doc = nlp('Submit Amazon OA ASAP');
console.log('Has urgency keywords:', doc.has('(urgent|asap)'));
```

#### Issue: High Database Query Times

```javascript
// 1. Check query plan
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = $1;

// 2. Verify indices
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

// 3. Add missing indices
CREATE INDEX idx_tasks_user_deadline ON tasks(user_id, deadline);

// 4. Monitor query performance
const start = Date.now();
const result = await db.query(query);
const duration = Date.now() - start;
if (duration > 1000) {
  logger.warn('Slow query', { query: query.text, duration });
}
```

### 13.2 Debugging Tools

```javascript
// ✅ DEBUGGING UTILITIES

// Add to development environment
import logger from './utils/logger';

export const debugLog = (feature, data) => {
  if (process.env.DEBUG === feature || process.env.DEBUG === '*') {
    console.log(`[${feature}]`, data);
  }
};

// Usage
debugLog('voice-parser', { transcript, parsed });
debugLog('notification', { taskId, tokenCount, status });

// Run with debug
DEBUG=voice-parser npm run dev
DEBUG=* npm run dev  // Everything
```

---

## 14. Project Structure & Folder Organization

### 14.1 Frontend Structure (React Native + Next.js)

```
remindkaro/
├── packages/
│   ├── mobile/                 # React Native App
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── DashboardScreen.js
│   │   │   │   ├── AddTaskScreen.js
│   │   │   │   ├── VoiceTaskScreen.js
│   │   │   │   ├── CalendarScreen.js
│   │   │   │   └── SettingsScreen.js
│   │   │   ├── components/
│   │   │   │   ├── TaskCard/
│   │   │   │   │   ├── TaskCard.js
│   │   │   │   │   ├── TaskCard.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── TaskList/
│   │   │   │   ├── VoiceMic/
│   │   │   │   ├── NotificationCenter/
│   │   │   │   └── common/
│   │   │   │       ├── Button.js
│   │   │   │       ├── Input.js
│   │   │   │       └── Modal.js
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   ├── voice.js
│   │   │   │   ├── notifications.js
│   │   │   │   └── storage.js
│   │   │   ├── hooks/
│   │   │   │   ├── useTask.js
│   │   │   │   ├── useVoice.js
│   │   │   │   ├── useFetch.js
│   │   │   │   └── useLocalStorage.js
│   │   │   ├── context/
│   │   │   │   ├── TaskContext.js
│   │   │   │   ├── AuthContext.js
│   │   │   │   └── ThemeContext.js
│   │   │   ├── utils/
│   │   │   │   ├── dateFormatter.js
│   │   │   │   ├── logger.js
│   │   │   │   └── validators.js
│   │   │   ├── navigation/
│   │   │   │   └── RootNavigator.js
│   │   │   ├── assets/
│   │   │   │   ├── icons/
│   │   │   │   ├── images/
│   │   │   │   └── fonts/
│   │   │   ├── styles/
│   │   │   │   ├── theme.js
│   │   │   │   ├── colors.js
│   │   │   │   └── typography.js
│   │   │   └── App.js
│   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── web/                    # Next.js Web Dashboard
│       ├── pages/
│       │   ├── index.js
│       │   ├── dashboard.js
│       │   ├── tasks/
│       │   ├── calendar.js
│       │   ├── settings.js
│       │   └── _app.js
│       ├── components/
│       │   └── (same structure as mobile)
│       ├── styles/
│       │   ├── globals.css
│       │   └── Home.module.css
│       ├── public/
│       ├── next.config.js
│       └── package.json
│
├── packages/
│   └── backend/                # Node.js Backend
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── authController.js
│       │   │   ├── taskController.js
│       │   │   ├── voiceController.js
│       │   │   └── notificationController.js
│       │   ├── services/
│       │   │   ├── taskService.js
│       │   │   ├── voiceService.js
│       │   │   ├── reminderService.js
│       │   │   ├── notificationService.js
│       │   │   └── authService.js
│       │   ├── repositories/
│       │   │   ├── taskRepository.js
│       │   │   ├── userRepository.js
│       │   │   ├── notificationRepository.js
│       │   │   └── auditRepository.js
│       │   ├── middleware/
│       │   │   ├── authMiddleware.js
│       │   │   ├── errorHandler.js
│       │   │   ├── requestLogger.js
│       │   │   └── validation.js
│       │   ├── routes/
│       │   │   ├── auth.js
│       │   │   ├── tasks.js
│       │   │   ├── voice.js
│       │   │   └── notifications.js
│       │   ├── validators/
│       │   │   ├── taskValidators.js
│       │   │   ├── authValidators.js
│       │   │   └── voiceValidators.js
│       │   ├── jobs/
│       │   │   ├── reminderJob.js
│       │   │   ├── escalationJob.js
│       │   │   └── cleanupJob.js
│       │   ├── queues/
│       │   │   ├── reminderQueue.js
│       │   │   └── notificationQueue.js
│       │   ├── config/
│       │   │   ├── database.js
│       │   │   ├── redis.js
│       │   │   └── firebase.js
│       │   ├── models/
│       │   │   ├── Task.js
│       │   │   ├── User.js
│       │   │   └── Notification.js
│       │   ├── utils/
│       │   │   ├── logger.js
│       │   │   ├── errors.js
│       │   │   ├── dateHelpers.js
│       │   │   └── voiceParser.js
│       │   └── server.js
│       ├── tests/
│       │   ├── unit/
│       │   │   ├── services/
│       │   │   ├── repositories/
│       │   │   └── utils/
│       │   ├── integration/
│       │   │   └── api/
│       │   └── fixtures/
│       ├── migrations/
│       │   ├── 001_create_users_table.js
│       │   ├── 002_create_tasks_table.js
│       │   └── 003_create_notifications_table.js
│       ├── .env.example
│       ├── docker-compose.yml
│       └── package.json
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
└── README.md
```

### 14.2 Naming Conventions

```javascript
// ✅ FILE & FOLDER NAMING

// Components: PascalCase
TaskCard.js
DashboardScreen.js

// Services, utilities: camelCase
taskService.js
dateFormatter.js

// Constants: UPPER_SNAKE_CASE
PRIORITY_HIGH = 'high'
NOTIFICATION_TYPES = { PUSH, EMAIL, SMS }

// Tests: *.test.js or *.spec.js
TaskService.test.js
voiceParser.spec.js

// Folders: kebab-case
user-management/
task-creation/
voice-integration/
```

---

## Final Checklist Before Production

- [ ] All secrets in .env (never in code)
- [ ] Database backups configured
- [ ] Monitoring/alerting set up (Sentry, DataDog)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Database indices optimized
- [ ] Logging configured for production
- [ ] Error handling on all async operations
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] Team trained on deployment process

---

## Resources & References

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Web Accessibility (a11y)](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Author:** RemindKaro Development Team  
**Status:** Production Ready
