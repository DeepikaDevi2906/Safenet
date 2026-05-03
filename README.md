# 🚨 SAFENET – AI-Based Women Safety System

SAFENET is an AI-powered safety system designed to detect potentially unsafe situations in real-time using computer vision and intelligent analytics. The system focuses on enhancing women's safety by identifying risk scenarios and triggering alerts through an integrated monitoring platform.

---

## Key Features

* **Real-Time Person Detection** using YOLO
* **Gender Classification Model** to analyze crowd composition
* **Anomaly Detection** (e.g., lone woman at night, surrounded scenarios)
* **Automated Alert System** for suspicious activity
* **Admin Dashboard** for live monitoring and analytics
* **User Mobile App** for alerts and safety interaction

---

## ⚙️ Tech Stack

### Frontend

* React.js (Admin Dashboard)
* React Native (Mobile App)

### Backend

* Flask (Python)
* REST API architecture

### AI / ML

* YOLO (Object Detection)
* OpenCV
* PyTorch (Gender Classification Model)

### Database (if used, update if needed)

* SQLite / MongoDB (mention what you used)

---

## WORKING

1. Live video feed is processed using YOLO to detect people
2. Each detected person is analyzed using a gender classification model
3. System evaluates scenarios (e.g., unsafe patterns or anomalies)
4. Alerts are triggered if risk conditions are detected
5. Admin dashboard displays real-time data and alerts
6. User app receives notifications for safety awareness
