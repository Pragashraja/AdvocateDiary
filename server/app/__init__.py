from flask import Flask
from app.config import config
from app.extensions import db, migrate, jwt, bcrypt, cors, ma

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.url_map.strict_slashes = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    ma.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.cases import cases_bp
    from app.routes.clients import clients_bp
    from app.routes.documents import documents_bp
    from app.routes.calendar import calendar_bp
    from app.routes.hearing_updates import hearing_updates_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cases_bp, url_prefix='/api/cases')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
    app.register_blueprint(hearing_updates_bp, url_prefix='/api/hearing-updates')

    # Error handlers
    from app.middleware.error_handler import register_error_handlers
    register_error_handlers(app)

    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Advocate Diary API is running'}, 200

    # Handle CORS preflight requests
    @app.before_request
    def handle_preflight():
        from flask import request
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            headers = response.headers
            headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
            headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            headers['Access-Control-Allow-Credentials'] = 'true'
            return response

    return app
