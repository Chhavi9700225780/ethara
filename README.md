# 🚀 Ethara – Team Task Manager Dashboard

A full-stack **Team Task Management System** built with modern web technologies.
This platform allows teams to **manage projects, assign tasks, track progress, and collaborate efficiently** with a powerful admin panel.

---

# 🌐 Live Demo

👉 Frontend: https://ethara-sigma.vercel.app

👉 Backend: https://ethara-tbkz.onrender.com

---
# 🔑 Demo Credentials

You can use the following credentials to explore the application:

## 👑 Admin Access

* **Email:** [admin@gmail.com](mailto:admin@gmail.com)
* **Password:** Chhavi@123

👉 Full access to:

* User Management Panel
* Task creation & assignment
* Project control
* Analytics dashboard

---

## 👤 User Access

* **Email:** [user741@gmail.com](mailto:user741@gmail.com)
* **Password:** User@741

👉 Access to:

* View assigned tasks
* Update task status
* Track progress

---

⚠️ **Note:** These are demo accounts for testing purposes only.


---

# 📸 Screenshots

**Sign In**

<img width="1919" height="902" alt="image" src="https://github.com/user-attachments/assets/fa8075ad-6d01-4c9c-9c78-7cf11fa294fc" />

---

**Sign UP**

<img width="1919" height="896" alt="image" src="https://github.com/user-attachments/assets/12406fef-d943-4926-a73a-5a61b24367fc" />



## 🏠 Dashboard

<!-- Add Screenshot Here -->
**Admin**

<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/f72c76ab-10f9-452c-a5ca-e08e2c5b4f1b" />

---

**User**

<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/90b65ded-6f5c-46a7-bee5-21c5d38d884d" />

---

## 📋 Tasks Management

<!-- Add Screenshot Here -->
**Admin**

<img width="1919" height="902" alt="image" src="https://github.com/user-attachments/assets/1f2c30f5-a8a5-49d9-a671-0a6159a0de0c" />

<img width="867" height="706" alt="image" src="https://github.com/user-attachments/assets/7459b294-5e10-48a8-8ef6-504cb6bab560" />

---

**User**

<img width="1919" height="889" alt="image" src="https://github.com/user-attachments/assets/00d211f8-6ce6-41b2-a6db-d858b092aeda" />

---

## 👥 User Management (Admin Panel)

<!-- Add Screenshot Here -->

<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/d6139b03-e0c1-46e0-a711-f7c1b3730e28" />

---

## 📊 Project , Analytics & Charts

<!-- Add Screenshot Here -->
**Admin**

<img width="1919" height="894" alt="image" src="https://github.com/user-attachments/assets/a69582b9-e03d-40c6-89a5-5e4696497c1f" />

---

**User**

<img width="1916" height="902" alt="image" src="https://github.com/user-attachments/assets/39c42b49-9648-493c-8727-89814a456513" />

---

<img width="1508" height="694" alt="image" src="https://github.com/user-attachments/assets/77ecadfc-a1b2-4e12-bdef-be77a3007c81" />



---

# ✨ Features

## 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login & registration
* Role-based access (Admin / Member)

---

## 📊 Dashboard

* Total tasks
* Completed tasks
* Pending tasks
* Overdue tasks
* Charts (Pie + Bar)

---

## 📋 Task Management

* Create, update, delete tasks
* Multi-user assignment
* Task status tracking:

  * Pending
  * In Progress
  * Completed
* Priority levels:

  * Low / Medium / High / Urgent
* Due dates with overdue highlighting

---

## 🧠 Smart Filters (Pro Feature)

* Filter by:

  * Status
  * Project
  * User
  * Priority
* Search functionality

---

## 👥 Admin Panel

* Create users
* Delete users
* Assign roles (Admin / Member)
* Full control over system

---

## 📁 Project Management

* Create projects
* Assign tasks to projects
* Track project-wise task distribution

---

# 🏗️ Tech Stack

## Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

## Deployment

* Frontend → Vercel
* Backend → Render

---

# ⚙️ Project Structure

```
ETHARA/
│
├── server/                 # Backend (Node + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── Team Task Manager Dashboard UI/   # Frontend (React)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
```

---

# 🔄 Workflow (How the System Works)

1. User registers or logs in
2. JWT token is generated and stored
3. Frontend sends authenticated requests to backend
4. Backend verifies token and processes request
5. MongoDB stores and retrieves data
6. UI updates dynamically based on responses

---

# 🔗 API Architecture

Base URL:

```
https://ethara-tbkz.onrender.com/api
```

## Example Endpoints

### Auth

```
POST /auth/login
POST /auth/register
```

### Tasks

```
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

### Users (Admin)

```
GET /users
POST /users
DELETE /users/:id
```

---

# 🔐 Environment Variables

## Frontend (.env)

```
VITE_API_URL=https://ethara-tbkz.onrender.com/api
```

## Backend (.env)

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

---

# 🚀 Getting Started Locally

## 1️⃣ Clone the repository

```
git clone https://github.com/your-username/ethara.git
```

---

## 2️⃣ Backend Setup

```
cd server
npm install
npm run dev
```

---

## 3️⃣ Frontend Setup

```
cd Team Task Manager Dashboard UI
npm install
npm run dev
```

---

# 🧪 Future Improvements

* Real-time updates (Socket.io)
* Notifications system
* Drag & drop task board (Kanban)
* File attachments
* Activity logs

---

# 🎯 Why This Project Stands Out

* Full-stack architecture
* Admin-level control system
* Real-world SaaS-like dashboard
* Clean UI + analytics
* Production deployment

---

# 👩‍💻 Author

**Chhavi**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
