from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.hearing_update import HearingUpdate
from app.models.case import Case
from app.models.calendar_event import CalendarEvent
from datetime import datetime

hearing_updates_bp = Blueprint('hearing_updates', __name__)

@hearing_updates_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_hearing_updates():
    """Get all hearing updates across all cases for the authenticated user"""
    user_id = int(get_jwt_identity())

    # Query with join to get case details
    hearing_updates = db.session.query(HearingUpdate, Case).join(
        Case, HearingUpdate.case_id == Case.id
    ).filter(
        HearingUpdate.user_id == user_id
    ).order_by(HearingUpdate.hearing_date.desc()).all()

    # Transform to include case details
    result = []
    for hearing, case in hearing_updates:
        hearing_dict = hearing.to_dict()
        hearing_dict['case_number'] = case.case_number
        hearing_dict['case_title'] = case.title
        hearing_dict['client_name'] = case.client_name
        hearing_dict['court_name'] = case.court_name
        result.append(hearing_dict)

    return jsonify(result), 200


@hearing_updates_bp.route('/', methods=['GET'])
@jwt_required()
def get_hearing_updates():
    """Get all hearing updates for a specific case"""
    user_id = int(get_jwt_identity())
    case_id = request.args.get('case_id')

    if not case_id:
        return jsonify({'error': 'case_id parameter is required'}), 400

    # Verify case ownership
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()
    if not case:
        return jsonify({'error': 'Case not found or access denied'}), 404

    # Get all hearing updates for this case, ordered by hearing_date DESC
    hearing_updates = HearingUpdate.query.filter_by(
        case_id=case_id,
        user_id=user_id
    ).order_by(HearingUpdate.hearing_date.desc()).all()

    return jsonify([update.to_dict() for update in hearing_updates]), 200


@hearing_updates_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_hearing_update(id):
    """Get a single hearing update"""
    user_id = int(get_jwt_identity())

    hearing_update = HearingUpdate.query.filter_by(id=id, user_id=user_id).first()
    if not hearing_update:
        return jsonify({'error': 'Hearing update not found'}), 404

    return jsonify(hearing_update.to_dict()), 200


@hearing_updates_bp.route('/', methods=['POST'])
@jwt_required()
def create_hearing_update():
    """Create a new hearing update and auto-create calendar event if next_hearing_date provided"""
    user_id = int(get_jwt_identity())
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('case_id') or not data.get('hearing_date'):
        return jsonify({'error': 'case_id and hearing_date are required'}), 400

    # Verify case ownership
    case = Case.query.filter_by(id=data['case_id'], user_id=user_id).first()
    if not case:
        return jsonify({'error': 'Case not found or access denied'}), 404

    # Parse hearing_date
    try:
        hearing_date = datetime.strptime(data['hearing_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid hearing_date format. Use YYYY-MM-DD'}), 400

    # Parse next_hearing_date if provided
    next_hearing_date = None
    if data.get('next_hearing_date'):
        try:
            next_hearing_date = datetime.strptime(data['next_hearing_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid next_hearing_date format. Use YYYY-MM-DD'}), 400

    # Create hearing update
    hearing_update = HearingUpdate(
        case_id=data['case_id'],
        user_id=user_id,
        hearing_date=hearing_date,
        action_taken=data.get('action_taken'),
        court_order=data.get('court_order'),
        next_hearing_date=next_hearing_date,
        action_to_be_taken=data.get('action_to_be_taken')
    )

    db.session.add(hearing_update)
    db.session.flush()  # Get the hearing_update.id

    # Auto-create calendar event if next_hearing_date is provided
    if next_hearing_date:
        calendar_event = CalendarEvent(
            user_id=user_id,
            case_id=data['case_id'],
            title=f"Hearing: {case.title}",
            description=f"Next hearing for case {case.case_number}\n\nAction to be taken: {data.get('action_to_be_taken', 'N/A')}",
            event_type='Hearing',
            event_date=datetime.combine(next_hearing_date, datetime.min.time()),
            location=case.court_name
        )
        db.session.add(calendar_event)
        db.session.flush()  # Get the calendar_event.id

        # Link the calendar event to the hearing update
        hearing_update.calendar_event_id = calendar_event.id

    db.session.commit()

    return jsonify({
        'message': 'Hearing update created successfully',
        'hearing_update': hearing_update.to_dict()
    }), 201


@hearing_updates_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_hearing_update(id):
    """Update a hearing update and sync calendar event"""
    user_id = int(get_jwt_identity())
    data = request.get_json()

    hearing_update = HearingUpdate.query.filter_by(id=id, user_id=user_id).first()
    if not hearing_update:
        return jsonify({'error': 'Hearing update not found'}), 404

    # Get the associated case
    case = Case.query.get(hearing_update.case_id)

    # Update hearing_date if provided
    if data.get('hearing_date'):
        try:
            hearing_update.hearing_date = datetime.strptime(data['hearing_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid hearing_date format. Use YYYY-MM-DD'}), 400

    # Update text fields
    if 'action_taken' in data:
        hearing_update.action_taken = data['action_taken']
    if 'court_order' in data:
        hearing_update.court_order = data['court_order']
    if 'action_to_be_taken' in data:
        hearing_update.action_to_be_taken = data['action_to_be_taken']

    # Handle next_hearing_date changes
    if 'next_hearing_date' in data:
        if data['next_hearing_date']:
            # Parse new next_hearing_date
            try:
                next_hearing_date = datetime.strptime(data['next_hearing_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid next_hearing_date format. Use YYYY-MM-DD'}), 400

            hearing_update.next_hearing_date = next_hearing_date

            # Update or create calendar event
            if hearing_update.calendar_event_id:
                # Update existing calendar event
                calendar_event = CalendarEvent.query.get(hearing_update.calendar_event_id)
                if calendar_event:
                    calendar_event.title = f"Hearing: {case.title}"
                    calendar_event.description = f"Next hearing for case {case.case_number}\n\nAction to be taken: {hearing_update.action_to_be_taken or 'N/A'}"
                    calendar_event.event_date = datetime.combine(next_hearing_date, datetime.min.time())
                    calendar_event.location = case.court_name
            else:
                # Create new calendar event
                calendar_event = CalendarEvent(
                    user_id=user_id,
                    case_id=hearing_update.case_id,
                    title=f"Hearing: {case.title}",
                    description=f"Next hearing for case {case.case_number}\n\nAction to be taken: {hearing_update.action_to_be_taken or 'N/A'}",
                    event_type='Hearing',
                    event_date=datetime.combine(next_hearing_date, datetime.min.time()),
                    location=case.court_name
                )
                db.session.add(calendar_event)
                db.session.flush()
                hearing_update.calendar_event_id = calendar_event.id
        else:
            # next_hearing_date was removed, delete calendar event
            hearing_update.next_hearing_date = None
            if hearing_update.calendar_event_id:
                calendar_event = CalendarEvent.query.get(hearing_update.calendar_event_id)
                if calendar_event:
                    db.session.delete(calendar_event)
                hearing_update.calendar_event_id = None

    db.session.commit()

    return jsonify({
        'message': 'Hearing update updated successfully',
        'hearing_update': hearing_update.to_dict()
    }), 200


@hearing_updates_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_hearing_update(id):
    """Delete a hearing update and its associated calendar event"""
    user_id = int(get_jwt_identity())

    hearing_update = HearingUpdate.query.filter_by(id=id, user_id=user_id).first()
    if not hearing_update:
        return jsonify({'error': 'Hearing update not found'}), 404

    # Delete associated calendar event if exists
    if hearing_update.calendar_event_id:
        calendar_event = CalendarEvent.query.get(hearing_update.calendar_event_id)
        if calendar_event:
            db.session.delete(calendar_event)

    db.session.delete(hearing_update)
    db.session.commit()

    return jsonify({'message': 'Hearing update deleted successfully'}), 200
