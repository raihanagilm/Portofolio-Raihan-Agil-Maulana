# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Experience

experience_bp = Blueprint('experience', __name__, url_prefix='/dashboard/experience')

@experience_bp.route('/')
@login_required
def index():
    experiences = Experience.query.order_by(Experience.order_index.asc(), Experience.id.desc()).all()
    return render_template('dashboard/experience.html', experiences=experiences, active_page='pengalaman')

@experience_bp.route('/add', methods=['POST'])
@login_required
def add():
    company = request.form.get('company')
    position = request.form.get('position')
    category = request.form.get('category', 'Kerja')
    period = request.form.get('period')
    description = request.form.get('description')

    if company and position:
        new_exp = Experience(
            company=company,
            position=position,
            category=category,
            period=period,
            description=description,
            is_visible=True
        )
        db.session.add(new_exp)
        db.session.commit()
        flash('Data pengalaman berhasil ditambahkan!', 'success')

    return redirect(url_for('experience.index'))

@experience_bp.route('/edit/<int:exp_id>', methods=['POST'])
@login_required
def edit(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    exp.company = request.form.get('company', exp.company)
    exp.position = request.form.get('position', exp.position)
    exp.category = request.form.get('category', exp.category)
    exp.period = request.form.get('period', exp.period)
    exp.description = request.form.get('description', exp.description)

    db.session.commit()
    flash('Data pengalaman berhasil diperbarui!', 'success')
    return redirect(url_for('experience.index'))

@experience_bp.route('/toggle/<int:exp_id>', methods=['POST'])
@login_required
def toggle_visibility(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    exp.is_visible = not exp.is_visible
    db.session.commit()
    status = "ditampilkan" if exp.is_visible else "disembunyikan"
    flash(f'Pengalaman berhasil {status} di portofolio publik.', 'info')
    return redirect(url_for('experience.index'))

@experience_bp.route('/delete/<int:exp_id>', methods=['POST'])
@login_required
def delete(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    db.session.delete(exp)
    db.session.commit()
    flash('Data pengalaman berhasil dihapus.', 'info')
    return redirect(url_for('experience.index'))
