from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from backend.extensions import db

# ----------------- USER MODEL -----------------
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="user", nullable=False)
    alerts_enabled = db.Column(db.Boolean, default=True, nullable=False)

    # Relationships
    emergency_contacts = db.relationship('EmergencyContact', backref='user', lazy=True, cascade="all, delete-orphan")
    alerts = db.relationship('AlertLog', backref='user', lazy=True, cascade="all, delete-orphan")

    # Password methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"


# ----------------- EMERGENCY CONTACT MODEL -----------------
class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contact'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<EmergencyContact {self.name} for User {self.user_id}>"


# ----------------- ALERT LOG MODEL -----------------
class AlertLog(db.Model):
    __tablename__ = 'alert_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Nullable if system alert
    alert_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=True)
    source = db.Column(db.String(50), default="system", nullable=False)
    message = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<AlertLog {self.alert_type} by User {self.user_id} at {self.timestamp}>"
