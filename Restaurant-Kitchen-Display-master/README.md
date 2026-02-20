# AI-Powered Restaurant Kitchen Display System (KDS)

---

## Project Overview

The **AI-Powered Restaurant Kitchen Display System (KDS)** is a real-time web-based solution designed to optimize restaurant kitchen operations.

It replaces traditional paper-based order management with a dynamic, intelligent digital dashboard that:

- Improves kitchen efficiency
- Reduces preparation time
- Enhances order tracking accuracy

This system simulates real-time incoming orders and provides live kitchen status updates.

---

## Key Features

### Real-Time Order Simulation

- Orders automatically appear every **5–10 seconds**
- Mimics real restaurant order flow
- Supports dynamic order queue management

---

### Smart Order Prioritization

Orders are categorized based on:

- Preparation time
- Order size
- Priority level

Urgent orders are visually highlighted for quick action.

---

### Live Timer Tracking

Each order includes an active preparation timer.

Order statuses:

- **Pending**
- **Preparing**
- **Ready**
- **Delayed**

---

### Sound & Alert System

- Audio notification for new orders
- Visual alerts for delayed orders

---

### Theme Support

- Light mode
- Dark mode
- Responsive UI design

---

### Dashboard Analytics

Displays real-time kitchen metrics:

- Total orders processed
- Active orders
- Completed orders
- Average preparation time

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript / React
- **State Management:** React Hooks
- **UI Icons:** Lucide React
- **Real-Time Simulation:** JavaScript `setInterval()`
- **Version Control:** Git & GitHub

---

## System Architecture

Core modules:

1. Order Generator Module
2. Order Queue Manager
3. Timer & Status Engine
4. Notification System
5. Analytics Dashboard

> The system currently runs fully client-side and simulates backend behavior for demonstration purposes.

---

## Project Structure

```
restaurant-kitchen-display/
│
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   └── App.js
│
├── package.json
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/restaurant-kitchen-display.git
```

### Navigate to Project Folder

```bash
cd restaurant-kitchen-display
```

### Install Dependencies

```bash
npm install
```

### Run Project

```bash
npm start
```

The application runs at:

```
http://localhost:3000
```

---

## Author

**Jebarson P**  
B.Tech Computer Science Engineering  
Karunya University

---

