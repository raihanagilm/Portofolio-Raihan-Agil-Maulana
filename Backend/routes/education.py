# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Education

education_bp = Blueprint('education', __name__, url_prefix='/dashboard/education')

@education_bp.route('/')
@login_required
def index():
    educations = Education.query.filter_by(type='education').order_by(Education.id.desc()).all()
    certificates = Education.query.filter_by(type='certificate').order_by(Education.id.desc()).all()
    return render_template('dashboard/education.html', educations=educations, certificates=certificates, active_page='pendidikan')

@education_bp.route('/add', methods=['POST'])
@login_required
def add():
    edu_type = request.form.get('type', 'education') # 'education' or 'certificate'
    institution = request.form.get('institution')
    degree = request.form.get('degree')
    major = request.form.get('major', '')
    period = request.form.get('period')
    description = request.form.get('description', '')
    credential_url = request.form.get('credential_url', '')

    if institution and degree:
        item = Education(
            type=edu_type,
            institution=institution,
            degree=degree,
            major=major,
            period=period,
            description=description,
            credential_url=credential_url,
            is_visible=True
        )
        db.session.add(item)
        db.session.commit()
        label = "Pendidikan" if edu_type == 'education' else "Sertifikat"
        flash(f'Data {label} berhasil ditambahkan!', 'success')

    return redirect(url_for('education.index'))

@education_bp.route('/edit/<int:edu_id>', methods=['POST'])
@login_required
def edit(edu_id):
    item = Education.query.get_or_404(edu_id)
    item.institution = request.form.get('institution', item.institution)
    item.degree = request.form.get('degree', item.degree)
    item.major = request.form.get('major', item.major)
    item.period = request.form.get('period', item.period)
    item.description = request.form.get('description', item.description)
    item.credential_url = request.form.get('credential_url', item.credential_url)

    db.session.commit()
    flash('Data berhasil diperbarui!', 'success')
    return redirect(url_for('education.index'))

@education_bp.route('/toggle/<int:edu_id>', methods=['POST'])
@login_required
def toggle_visibility(edu_id):
    item = Education.query.get_or_404(edu_id)
    item.is_visible = not item.is_visible
    db.session.commit()
    status = "ditampilkan" if item.is_visible else "disembunyikan"
    flash(f'Item berhasil {status} di portofolio publik.', 'info')
    return redirect(url_for('education.index'))

@education_bp.route('/delete/<int:edu_id>', methods=['POST'])
@login_required
def delete(edu_id):
    item = Education.query.get_or_404(edu_id)
    db.session.delete(item)
    db.session.commit()
    flash('Data berhasil dihapus.', 'info')
    return redirect(url_for('education.index'))
