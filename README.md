# 🛡️ SAFENET – AI-Powered Real-Time Safety Analytics Platform

SAFENET is a full-stack AI-powered public safety ecosystem designed to detect threats, monitor incidents, and provide real-time emergency response capabilities. The platform combines computer vision, audio analysis, live location tracking, emergency alerts, and analytics dashboards to enhance public and personal safety.

## 🚀 Features

* Real-time GPS tracking and live location monitoring
* SOS alerts and emergency notification system
* Crowd density monitoring and anomaly detection
* Fire detection using computer vision
* Violence detection using AI models
* Scream detection using audio analysis
* Analytics dashboard for incident monitoring
* Automated alert generation and management
* Real-time communication using WebSockets
* Mobile and Web application support
* Automated CI/CD deployment pipeline

## 🛠️ Tech Stack

### Frontend

* React.js
* React Native
* JavaScript
* HTML/CSS

### Backend

* FastAPI
* Python
* WebSockets
* SQLAlchemy

### Database

* PostgreSQL

### AI / ML

* TensorFlow
* OpenCV
* MediaPipe

### Cloud & DevOps

* Docker
* AWS EC2
* GitHub Actions
* CI/CD Pipeline

### Communication

* Twilio
* WebSockets

## 📦 Deployment

The application is containerized using Docker and deployed on AWS EC2.

### CI/CD Workflow

1. Developer pushes code to GitHub.
2. GitHub Actions workflow is triggered.
3. Workflow connects to AWS EC2 using SSH.
4. Latest code is pulled automatically.
5. Docker containers are rebuilt and restarted.
6. Updated application is deployed without manual intervention.

## 🔒 Safety Modules

### Violence Detection

Detects violent activities using computer vision models.

### Fire Detection

Identifies fire-related incidents from live video streams.

### Crowd Monitoring

Analyzes crowd density and detects potentially unsafe situations.

### Scream Detection

Processes audio streams to identify distress signals and screams.

## 📈 Key Highlights

* 45+ implemented features
* 10+ FastAPI endpoints
* Real-time WebSocket communication
* AI-powered threat detection
* Dockerized microservice architecture
* AWS cloud deployment
* Automated GitHub Actions CI/CD pipeline
