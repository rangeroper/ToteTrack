# Inventory Management Suite

A full-stack inventory management application built with FastAPI (backend) and React (frontend). It offers efficient storage control with powerful tagging, filtering, and fast item manipulation. Each tote is assigned a unique QR code for instant tracking (point your camera at the QR code and be redirected to the totes page), content visibility, and precise location identification at a glance.

Add photos of your tote contents to never forget what you’ve stored inside. Say goodbye to guessing where your totes are, what’s inside them, or worrying about perishables and electronics being misplaced or forgotten.

---

**Demo:** [https://qr-storage.onrender.com/](https://qr-storage.onrender.com/)

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

📦 Create, edit, and delete inventory totes

🏷️ Assign and manage tags for easier classification

🔍 Sort and filter totes by name, tags, and last updated

🧾 View contents of individual totes

📍 Track tote location (aisle, row, shelf, etc.)

⚡ Generate and scan QR codes for each tote to instantly locate and identify them

💻 Responsive, modern UI built with React

---

## 📦 API Endpoints

### Tote Routes

* `GET /totes` - Get all totes
* `GET /totes/{id}` - Get a tote by ID
* `POST /totes` - Create a new tote
* `PATCH /totes/{id}` - Edit tote (partial)
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
