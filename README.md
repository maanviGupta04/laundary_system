# laundary_system

##  Overview
This is a lightweight Laundry Order Management System built to help a dry cleaning store manage daily operations such as order creation, tracking, billing, and analytics.

The project was developed using an **AI-first approach**, leveraging tools like ChatGPT to accelerate development, debug issues, and improve UI/UX.

---

##  Features Implemented

###  1. Create Order
- Enter customer name & phone number
- Add multiple garments dynamically
- Select garment type (Shirt, Pants, Saree)
- Enter quantity
- Auto-calculates total bill
- Generates unique Order ID

---

###  2. Order Status Management
Each order supports:
- RECEIVED
- PROCESSING
- READY
- DELIVERED

Status can be updated directly from UI

---

###  3. View Orders
- View all orders in a table
- Displays:
  - Customer details
  - Total bill
  - Status
- Actions:
  - View order details (slide panel UI)
  - Update status
  - Download invoice

---

###  4. Dashboard
- Total Orders
- Total Revenue
- Orders grouped by status
- Displayed using modern card UI

---

###  5. Invoice Generation
- Download invoice as PDF
- Includes:
  - Order ID
  - Customer details
  - Item breakdown
  - Total amount

---

###  6. UI/UX Enhancements
- Responsive design (mobile-friendly)
- Card-based layout
- Smooth transitions & hover effects
- Sliding panel for order details
- Clean and modern interface

---

##  Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python (Flask)

### Libraries
- jsPDF (for invoice generation)

---

##  Setup Instructions

1. Run backend using: python app.py
2. Open index.html in browser

