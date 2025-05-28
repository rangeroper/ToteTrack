# Inventory Management Suite

A full-stack inventory management application built with **FastAPI** (backend) and **React** (frontend). Designed for efficient storage control with tagging, filtering, and fast item manipulation.

---

## 🚀 Getting Started

### Prerequisites

* Python 3.10.9
* Node.js 20.16.0
* npm 10.8.1
* MongoDB

---

## 🔧 Backend Setup (FastAPI)

Navigate to the backend folder:

```bash
cd backend
```

### Install dependencies:

Create a virtual environment (optional but recommended):

```bash
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate
```

Install packages:

```bash
pip install -r requirements.txt
```

### Start the server:

```bash
uvicorn main:app --reload
```

By default, this runs at `http://127.0.0.1:8000`.

---

## 💻 Frontend Setup (React)

Navigate to the frontend folder:

```bash
cd frontend
```

### Install dependencies:

```bash
npm install
```

### Start the development server:

```bash
npm start
```

This will run the frontend on `http://localhost:3000`.

---

## ✨ Features

* Create, edit, delete inventory totes
* Assign tags to totes
* Sort and filter totes by name, tag, and last updated
* Responsive and modern UI

---

## 📦 API Endpoints

### Tote Routes

* `GET /totes` - Get all totes
* `GET /totes/{id}` - Get a tote by ID
* `POST /totes` - Create a new tote
* `PATCH /totes/{id}` - Edit tote (partial)
* `PUT /totes/{id}` - Full edit/update tote
* `DELETE /totes/{id}` - Delete tote

### Tag Routes

* `GET /tags` - Get all tags
* `POST /tags` - Create a tag
* `DELETE /tags/{id}` - Delete a tag

---

## 🗂 Folder Structure

```
inventory_management/
├── backend/           # FastAPI backend
├── frontend/          # React frontend
├── README.md
```

---

## ✅ Coming Soon

* User authentication
* Role-based access
* Bulk actions

---

## 📄 License

MIT License.
