import os
# pyrefly: ignore [missing-import]
from sqlalchemy import text
# pyrefly: ignore [missing-import]
from flask import Flask, send_from_directory
# pyrefly: ignore [missing-import]
from werkzeug.security import generate_password_hash
from Backend.config import Config
from Backend.database import db, User, Profile, Project, Skill, Experience, Education

app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(__file__), 'Frontend', 'templates'),
    static_folder=os.path.join(os.path.dirname(__file__), 'Frontend')
)

app.config.from_object(Config)
db.init_app(app)

# Serve CSS & JS cleanly
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.root_path, 'Frontend', 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(app.root_path, 'Frontend', 'js'), filename)

# Import & Register Blueprints
from Backend.routes.auth import auth_bp
from Backend.routes.dashboard import dashboard_bp
from Backend.routes.profile import profile_bp
from Backend.routes.experience import experience_bp
from Backend.routes.education import education_bp
from Backend.routes.skills import skills_bp
from Backend.routes.projects import projects_bp
from Backend.routes.messages import messages_bp
from Backend.routes.public import public_bp

app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(experience_bp)
app.register_blueprint(education_bp)
app.register_blueprint(skills_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(messages_bp)
app.register_blueprint(public_bp)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
