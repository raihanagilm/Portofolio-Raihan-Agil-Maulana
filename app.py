import os
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

def init_db_data():
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"[DB CONNECTION ERROR] Fallback to local SQLite: {str(e)}")
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio_kardus.db'
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}
            db.create_all()

        # Ensure new social media columns exist for backward compatibility
        try:
            from sqlalchemy import inspect, text
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('profiles')]
            required_cols = {
                'instagram': 'VARCHAR(150) DEFAULT ""',
                'facebook': 'VARCHAR(150) DEFAULT ""',
                'twitter': 'VARCHAR(150) DEFAULT ""',
                'youtube': 'VARCHAR(150) DEFAULT ""',
                'website': 'VARCHAR(150) DEFAULT ""'
            }
            for col_name, col_def in required_cols.items():
                if col_name not in columns:
                    db.session.execute(text(f'ALTER TABLE profiles ADD COLUMN {col_name} {col_def}'))
            db.session.commit()
        except Exception as mig_err:
            print(f"[DB MIGRATION ERROR] {mig_err}")
            # If migration fails, recreate tables to ensure schema is up‑to‑date
            try:
                db.drop_all()
                db.create_all()
                print("[DB RECREATED] Dropped and recreated all tables after migration failure.")
            except Exception as recreate_err:
                print(f"[DB RECREATE ERROR] {recreate_err}")
        # Seed Initial Admin User (raihanagilm@gmail.com / 123456)
        admin = User.query.filter_by(email="raihanagilm@gmail.com").first()
        if not admin:
            admin = User(
                email="raihanagilm@gmail.com",
                password_hash=generate_password_hash("123456"),
                role="admin"
            )
            db.session.add(admin)

        # Seed Profile
        try:
            profile = Profile.query.first()
        except Exception as e:
            # Attempt to add missing columns and retry
            from sqlalchemy import text
            try:
                db.session.execute(text('ALTER TABLE profiles ADD COLUMN instagram VARCHAR(150) DEFAULT ""'))
                db.session.commit()
            except Exception as mig_err:
                print(f"[DB MIGRATION ERROR] {mig_err}")
            profile = Profile.query.first()
        if not profile:
            profile = Profile(
                full_name="Raihan Agil Maulana",
                title="Full-Stack Developer & Tech Enthusiast",
                bio="Passionate developer creating aesthetic, performant, and cardboard-craft inspired digital experiences.",
                email="raihanagilm@gmail.com",
                phone="+62 812-3456-7890",
                location="Bandung, Indonesia",
                github="https://github.com",
                linkedin="https://linkedin.com"
            )
            db.session.add(profile)

        # Seed Sample Skills if empty
        if Skill.query.count() == 0:
            sample_skills = [
                Skill(name="Python & Flask", category="Backend", proficiency=92, icon="code"),
                Skill(name="Tailwind CSS", category="Frontend", proficiency=95, icon="style"),
                Skill(name="JavaScript (ES6+)", category="Frontend", proficiency=88, icon="javascript"),
                Skill(name="MySQL / TiDB", category="Database", proficiency=85, icon="database"),
                Skill(name="Cloudinary API", category="Media", proficiency=80, icon="cloud_upload"),
                Skill(name="Resend Email API", category="Services", proficiency=85, icon="mail")
            ]
            db.session.add_all(sample_skills)

        # Seed Sample Experience if empty
        if Experience.query.count() == 0:
            exp1 = Experience(
                company="PT. Solusi Digital Kreatif",
                position="Senior Full-Stack Engineer",
                period="2024 - Sekarang",
                description="Mengembangkan aplikasi web bertema custom, arsitektur microservices, dan integrasi API payment & mailing.",
                order_index=1
            )
            exp2 = Experience(
                company="Tech Studio Indonesia",
                position="Frontend Developer",
                period="2022 - 2024",
                description="Membangun UI/UX mobile-first modern berstandar tinggi dengan penekanan pada estetika visual & responsivitas.",
                order_index=2
            )
            db.session.add_all([exp1, exp2])

        # Seed Sample Projects if empty
        if Project.query.count() == 0:
            p1 = Project(
                title="Cardboard Portfolio Manager",
                description="Sistem manajemen portofolio interaktif bertema serat kardus dengan otentikasi OTP darurat dan integrasi Cloudinary.",
                category="Web App",
                tags="Flask, Tailwind, MySQL, Resend",
                demo_url="#",
                github_url="#"
            )
            db.session.add(p1)

        db.session.commit()

init_db_data()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
