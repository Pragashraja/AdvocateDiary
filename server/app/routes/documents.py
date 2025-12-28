from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from app.extensions import db
from app.models.document import Document
from app.models.case import Case

documents_bp = Blueprint('documents', __name__)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@documents_bp.route('/case/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case_documents(case_id):
    user_id = int(get_jwt_identity())
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()

    if not case:
        return jsonify({'error': 'Case not found'}), 404

    documents = Document.query.filter_by(case_id=case_id).all()

    return jsonify([{
        'id': doc.id,
        'title': doc.title,
        'file_name': doc.file_name,
        'file_url': doc.file_url,
        'file_type': doc.file_type,
        'file_size': doc.file_size,
        'description': doc.description,
        'uploaded_at': doc.uploaded_at.isoformat()
    } for doc in documents]), 200

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    user_id = int(get_jwt_identity())

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    case_id = request.form.get('case_id')
    title = request.form.get('title')
    description = request.form.get('description')

    if not case_id or not title:
        return jsonify({'error': 'case_id and title are required'}), 400

    # Verify case belongs to user
    case = Case.query.filter_by(id=case_id, user_id=user_id).first()
    if not case:
        return jsonify({'error': 'Case not found'}), 404

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    filename = secure_filename(file.filename)
    upload_folder = 'uploads'
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    # In production, upload to Cloudinary or S3
    file_url = f'/uploads/{filename}'  # Temporary local path

    new_document = Document(
        case_id=case_id,
        title=title,
        file_name=filename,
        file_url=file_url,
        file_type=filename.rsplit('.', 1)[1].lower(),
        file_size=os.path.getsize(file_path),
        description=description
    )

    db.session.add(new_document)
    db.session.commit()

    return jsonify({
        'message': 'Document uploaded successfully',
        'document': {
            'id': new_document.id,
            'title': new_document.title,
            'file_name': new_document.file_name,
            'file_url': new_document.file_url
        }
    }), 201

@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    user_id = int(get_jwt_identity())
    document = Document.query.get(document_id)

    if not document:
        return jsonify({'error': 'Document not found'}), 404

    # Verify document belongs to user's case
    case = Case.query.filter_by(id=document.case_id, user_id=user_id).first()
    if not case:
        return jsonify({'error': 'Unauthorized'}), 403

    # Delete file from storage
    # In production, delete from Cloudinary or S3

    db.session.delete(document)
    db.session.commit()

    return jsonify({'message': 'Document deleted successfully'}), 200
