from app.extensions import db
from datetime import datetime

class Case(db.Model):
    __tablename__ = 'cases'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)

    # Case Details
    case_number = db.Column(db.String(100), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    case_type = db.Column(db.String(50))  # Civil, Criminal, Family, etc.
    court_name = db.Column(db.String(200))
    filing_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='Active')  # Active, Pending, Closed, Won, Lost

    # Client Details (inline)
    client_name = db.Column(db.String(200))
    client_address = db.Column(db.Text)
    client_phone = db.Column(db.String(20))

    # Opposite Party Details
    opposite_party = db.Column(db.String(200))
    otherside_counsel = db.Column(db.String(200))

    # Party Type
    party_type = db.Column(db.String(50))  # Plaintiff/Respondent/Petitioner/Defendant

    # Additional Information
    description = db.Column(db.Text)
    remarks = db.Column(db.Text)
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = db.relationship('Document', backref='case', lazy='dynamic', cascade='all, delete-orphan')
    calendar_events = db.relationship('CalendarEvent', backref='case', lazy='dynamic', cascade='all, delete-orphan')
    hearing_updates = db.relationship('HearingUpdate', backref='case', lazy='dynamic', cascade='all, delete-orphan', order_by='HearingUpdate.hearing_date.desc()')

    def __repr__(self):
        return f'<Case {self.case_number}>'
