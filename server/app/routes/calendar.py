from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.extensions import db
from app.models.calendar_event import CalendarEvent
from app.models.case import Case

calendar_bp = Blueprint('calendar', __name__)

@calendar_bp.route('/', methods=['GET'])
@jwt_required()
def get_events():
    user_id = int(get_jwt_identity())
    events = CalendarEvent.query.filter_by(user_id=user_id).order_by(CalendarEvent.event_date).all()

    return jsonify([{
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'event_type': event.event_type,
        'event_date': event.event_date.isoformat(),
        'location': event.location,
        'is_completed': event.is_completed,
        'case': {
            'id': event.case.id,
            'case_number': event.case.case_number,
            'title': event.case.title
        } if event.case else None
    } for event in events]), 200

@calendar_bp.route('/<int:event_id>', methods=['GET'])
@jwt_required()
def get_event(event_id):
    user_id = int(get_jwt_identity())
    event = CalendarEvent.query.filter_by(id=event_id, user_id=user_id).first()

    if not event:
        return jsonify({'error': 'Event not found'}), 404

    return jsonify({
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'event_type': event.event_type,
        'event_date': event.event_date.isoformat(),
        'location': event.location,
        'reminder_time': event.reminder_time,
        'is_completed': event.is_completed,
        'case_id': event.case_id
    }), 200

@calendar_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or not data.get('title') or not data.get('event_date'):
        return jsonify({'error': 'Title and event_date are required'}), 400

    # Verify case belongs to user if case_id provided
    if data.get('case_id'):
        case = Case.query.filter_by(id=data['case_id'], user_id=user_id).first()
        if not case:
            return jsonify({'error': 'Case not found'}), 404

    try:
        event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    new_event = CalendarEvent(
        user_id=user_id,
        case_id=data.get('case_id'),
        title=data['title'],
        description=data.get('description'),
        event_type=data.get('event_type'),
        event_date=event_date,
        location=data.get('location'),
        reminder_time=data.get('reminder_time')
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        'message': 'Event created successfully',
        'event': {
            'id': new_event.id,
            'title': new_event.title,
            'event_date': new_event.event_date.isoformat()
        }
    }), 201

@calendar_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    user_id = int(get_jwt_identity())
    event = CalendarEvent.query.filter_by(id=event_id, user_id=user_id).first()

    if not event:
        return jsonify({'error': 'Event not found'}), 404

    data = request.get_json()

    if data.get('title'):
        event.title = data['title']
    if data.get('description'):
        event.description = data['description']
    if data.get('event_type'):
        event.event_type = data['event_type']
    if data.get('event_date'):
        try:
            event.event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    if data.get('location'):
        event.location = data['location']
    if 'is_completed' in data:
        event.is_completed = data['is_completed']

    db.session.commit()

    return jsonify({'message': 'Event updated successfully'}), 200

@calendar_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    user_id = int(get_jwt_identity())
    event = CalendarEvent.query.filter_by(id=event_id, user_id=user_id).first()

    if not event:
        return jsonify({'error': 'Event not found'}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({'message': 'Event deleted successfully'}), 200
