from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.client import Client

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/', methods=['GET'])
@jwt_required()
def get_clients():
    user_id = int(get_jwt_identity())
    clients = Client.query.filter_by(user_id=user_id).all()

    return jsonify([{
        'id': client.id,
        'name': client.name,
        'email': client.email,
        'phone': client.phone,
        'created_at': client.created_at.isoformat()
    } for client in clients]), 200

@clients_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    user_id = int(get_jwt_identity())
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()

    if not client:
        return jsonify({'error': 'Client not found'}), 404

    return jsonify({
        'id': client.id,
        'name': client.name,
        'email': client.email,
        'phone': client.phone,
        'address': client.address,
        'notes': client.notes,
        'created_at': client.created_at.isoformat(),
        'updated_at': client.updated_at.isoformat()
    }), 200

@clients_bp.route('/', methods=['POST'])
@jwt_required()
def create_client():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Client name is required'}), 400

    new_client = Client(
        user_id=user_id,
        name=data['name'],
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address'),
        notes=data.get('notes')
    )

    db.session.add(new_client)
    db.session.commit()

    return jsonify({
        'message': 'Client created successfully',
        'client': {
            'id': new_client.id,
            'name': new_client.name,
            'email': new_client.email
        }
    }), 201

@clients_bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    user_id = int(get_jwt_identity())
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()

    if not client:
        return jsonify({'error': 'Client not found'}), 404

    data = request.get_json()

    if data.get('name'):
        client.name = data['name']
    if 'email' in data:
        client.email = data['email']
    if 'phone' in data:
        client.phone = data['phone']
    if 'address' in data:
        client.address = data['address']
    if 'notes' in data:
        client.notes = data['notes']

    db.session.commit()

    return jsonify({'message': 'Client updated successfully'}), 200

@clients_bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    user_id = int(get_jwt_identity())
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()

    if not client:
        return jsonify({'error': 'Client not found'}), 404

    db.session.delete(client)
    db.session.commit()

    return jsonify({'message': 'Client deleted successfully'}), 200
