# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Skill

skills_bp = Blueprint('skills', __name__, url_prefix='/dashboard/skills')

@skills_bp.route('/')
@login_required
def index():
    skills = Skill.query.order_by(Skill.category.asc(), Skill.name.asc()).all()
    return render_template('dashboard/skills.html', skills=skills, active_page='keahlian')

@skills_bp.route('/add', methods=['POST'])
@login_required
def add():
    name = request.form.get('name')
    category = request.form.get('category', 'Technical')
    icon = request.form.get('icon', 'code')

    if name:
        skill = Skill(name=name, category=category, icon=icon, is_visible=True)
        db.session.add(skill)
        db.session.commit()
        flash('Skill/Keahlian berhasil ditambahkan!', 'success')

    return redirect(url_for('skills.index'))

@skills_bp.route('/edit/<int:skill_id>', methods=['POST'])
@login_required
def edit(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    skill.name = request.form.get('name', skill.name)
    skill.category = request.form.get('category', skill.category)
# proficiency removed
    skill.icon = request.form.get('icon', skill.icon)

    db.session.commit()
    flash('Skill berhasil diperbarui!', 'success')
    return redirect(url_for('skills.index'))

@skills_bp.route('/toggle/<int:skill_id>', methods=['POST'])
@login_required
def toggle_visibility(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    skill.is_visible = not skill.is_visible
    db.session.commit()
    status = "ditampilkan" if skill.is_visible else "disembunyikan"
    flash(f'Skill berhasil {status} di portofolio publik.', 'info')
    return redirect(url_for('skills.index'))

@skills_bp.route('/delete/<int:skill_id>', methods=['POST'])
@login_required
def delete(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    db.session.delete(skill)
    db.session.commit()
    flash('Skill berhasil dihapus.', 'info')
    return redirect(url_for('skills.index'))
