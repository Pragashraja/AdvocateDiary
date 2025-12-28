from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.case import Case
from app.models.client import Client
from datetime import datetime

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/', methods=['GET'])
@jwt_required()
def get_cases():
    user_id = int(get_jwt_identity())
    cases = Case.query.filter_by(user_id=user_id).all()

    return jsonify([{
        'id': case.id,
        'case_number': case.case_number,
        'title': case.title,
        'case_type': case.case_type,
        'court_name': case.court_name,
        'status': case.status,
        'filing_date': case.filing_date.isoformat() if case.filing_date else None,
        'client_name': case.client_name,
        'client_address': case.client_address,
        'client_phone': case.client_phone,
        'opposite_party': case.opposite_party,
        'otherside_counsel': case.otherside_counsel,
        'party_type': case.party_type,
        'description': case.description,
        'remarks': case.remarks,
        'notes': case.notes,
        'created_at': case.created_at.isoformat()
    } for case in cases]), 200

@cases_bp.route('/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case(case_id):
    user_id = int(get_jwt_identity())
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()

    if not case:
        return jsonify({'error': 'Case not found'}), 404

    return jsonify({
        'id': case.id,
        'case_number': case.case_number,
        'title': case.title,
        'case_type': case.case_type,
        'court_name': case.court_name,
        'filing_date': case.filing_date.isoformat() if case.filing_date else None,
        'status': case.status,
        'client_name': case.client_name,
        'client_address': case.client_address,
        'client_phone': case.client_phone,
        'opposite_party': case.opposite_party,
        'otherside_counsel': case.otherside_counsel,
        'party_type': case.party_type,
        'description': case.description,
        'remarks': case.remarks,
        'notes': case.notes,
        'created_at': case.created_at.isoformat(),
        'updated_at': case.updated_at.isoformat()
    }), 200

@cases_bp.route('/', methods=['POST'])
@jwt_required()
def create_case():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({'error': 'No data received'}), 400

        if not data.get('case_number') or not data.get('case_number').strip():
            return jsonify({'error': 'Case number is required'}), 400

        if not data.get('title') or not data.get('title').strip():
            return jsonify({'error': 'Case title is required'}), 400

        # Check if case number already exists
        existing_case = Case.query.filter_by(case_number=data['case_number'].strip()).first()
        if existing_case:
            return jsonify({'error': 'Case number already exists'}), 400

        # Helper function to convert empty strings to None
        def clean_value(value):
            if isinstance(value, str):
                return value.strip() if value.strip() else None
            return value

        # Convert filing_date string to date object if provided
        filing_date = None
        if data.get('filing_date') and data['filing_date'].strip():
            try:
                filing_date = datetime.strptime(data['filing_date'], '%Y-%m-%d').date()
            except ValueError as e:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Create case with cleaned data
        new_case = Case(
            user_id=user_id,
            case_number=data['case_number'].strip(),
            title=data['title'].strip(),
            case_type=clean_value(data.get('case_type')),
            court_name=clean_value(data.get('court_name')),
            filing_date=filing_date,
            status=data.get('status', 'Active') or 'Active',
            # Client details (inline)
            client_name=clean_value(data.get('client_name')),
            client_address=clean_value(data.get('client_address')),
            client_phone=clean_value(data.get('client_phone')),
            # Opposite party details
            opposite_party=clean_value(data.get('opposite_party')),
            otherside_counsel=clean_value(data.get('otherside_counsel')),
            party_type=clean_value(data.get('party_type')),
            # Additional information
            description=clean_value(data.get('description')),
            remarks=clean_value(data.get('remarks')),
            notes=clean_value(data.get('notes'))
        )

        db.session.add(new_case)
        db.session.commit()

        return jsonify({
            'message': 'Case created successfully',
            'case': {
                'id': new_case.id,
                'case_number': new_case.case_number,
                'title': new_case.title
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create case: {str(e)}'}), 500

@cases_bp.route('/<int:case_id>', methods=['PUT'])
@jwt_required()
def update_case(case_id):
    user_id = int(get_jwt_identity())
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()

    if not case:
        return jsonify({'error': 'Case not found'}), 404

    data = request.get_json()

    if data.get('title'):
        case.title = data['title']
    if data.get('case_type'):
        case.case_type = data['case_type']
    if data.get('court_name'):
        case.court_name = data['court_name']
    if data.get('status'):
        case.status = data['status']
    if data.get('description'):
        case.description = data['description']
    if data.get('notes'):
        case.notes = data['notes']
    if data.get('filing_date'):
        case.filing_date = data['filing_date']

    db.session.commit()

    return jsonify({'message': 'Case updated successfully'}), 200

@cases_bp.route('/<int:case_id>', methods=['DELETE'])
@jwt_required()
def delete_case(case_id):
    user_id = int(get_jwt_identity())
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()

    if not case:
        return jsonify({'error': 'Case not found'}), 404

    db.session.delete(case)
    db.session.commit()

    return jsonify({'message': 'Case deleted successfully'}), 200
