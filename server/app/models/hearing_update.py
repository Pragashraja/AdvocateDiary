from app.extensions import db
from datetime import datetime

class HearingUpdate(db.Model):
    __tablename__ = 'hearing_updates'

    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Hearing details
    hearing_date = db.Column(db.Date, nullable=False)
    action_taken = db.Column(db.Text)
    court_order = db.Column(db.Text)
    next_hearing_date = db.Column(db.Date)
    action_to_be_taken = db.Column(db.Text)

    # Link to auto-created calendar event
    calendar_event_id = db.Column(db.Integer, db.ForeignKey('calendar_events.id', ondelete='SET NULL'))

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to calendar event
    calendar_event = db.relationship('CalendarEvent', backref='hearing_update', foreign_keys=[calendar_event_id])

    def __repr__(self):
        return f'<HearingUpdate {self.id} - Case {self.case_id} - {self.hearing_date}>'

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'user_id': self.user_id,
            'hearing_date': self.hearing_date.isoformat() if self.hearing_date else None,
            'action_taken': self.action_taken,
            'court_order': self.court_order,
            'next_hearing_date': self.next_hearing_date.isoformat() if self.next_hearing_date else None,
            'action_to_be_taken': self.action_to_be_taken,
            'calendar_event_id': self.calendar_event_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
