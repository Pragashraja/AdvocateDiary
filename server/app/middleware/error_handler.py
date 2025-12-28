from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(HTTPException)
    def handle_exception(error):
        import traceback
        app.logger.error(f'HTTPException {error.code}: {error.description}')
        app.logger.error(f'Traceback: {traceback.format_exc()}')
        return jsonify({
            'error': error.description,
            'message': str(error),
            'code': error.code
        }), error.code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f'Unexpected error: {str(error)}')
        return jsonify({'error': 'An unexpected error occurred'}), 500
