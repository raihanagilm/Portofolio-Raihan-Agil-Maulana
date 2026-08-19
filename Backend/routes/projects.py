# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Project, ProjectImage
from Backend.utils.cloudinary_helper import upload_media, delete_media

projects_bp = Blueprint('projects', __name__, url_prefix='/dashboard/projects')

@projects_bp.route('/')
@login_required
def index():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template('dashboard/projects.html', projects=projects, active_page='proyek')

@projects_bp.route('/add', methods=['POST'])
@login_required
def add():
    title = request.form.get('title')
    description = request.form.get('description')
    content = request.form.get('content')
    category = request.form.get('category')
    tags = request.form.get('tags')
    demo_url = request.form.get('demo_url')
    github_url = request.form.get('github_url')
    image_url = None
    if 'image' in request.files and request.files['image'].filename:
        image_url = upload_media(request.files['image'], folder='projects')
    if title:
        proj = Project(
            title=title,
            description=description,
            content=content,
            category=category,
            tags=tags,
            demo_url=demo_url,
            github_url=github_url,
            image_url=image_url,
            is_visible=True
        )
        db.session.add(proj)
        db.session.commit()
        
        # Handle multiple images
        if 'gallery_images' in request.files:
            for file in request.files.getlist('gallery_images'):
                if file.filename:
                    g_url = upload_media(file, folder='projects_gallery')
                    if g_url:
                        new_img = ProjectImage(project_id=proj.id, image_url=g_url)
                        db.session.add(new_img)
            db.session.commit()

        flash('Proyek berhasil ditambahkan!', 'success')
    return redirect(url_for('projects.index'))

@projects_bp.route('/edit/<int:proj_id>', methods=['POST'])
@login_required
def edit(proj_id):
    proj = Project.query.get_or_404(proj_id)
    proj.title = request.form.get('title', proj.title)
    proj.description = request.form.get('description', proj.description)
    proj.content = request.form.get('content', proj.content)
    proj.category = request.form.get('category', proj.category)
    proj.tags = request.form.get('tags', proj.tags)
    proj.demo_url = request.form.get('demo_url', proj.demo_url)
    proj.github_url = request.form.get('github_url', proj.github_url)
    
    if 'image' in request.files and request.files['image'].filename:
        img = upload_media(request.files['image'], folder='projects')
        if img:
            if proj.image_url:
                delete_media(proj.image_url)
            proj.image_url = img
            
    if 'gallery_images' in request.files:
        for file in request.files.getlist('gallery_images'):
            if file.filename:
                g_url = upload_media(file, folder='projects_gallery')
                if g_url:
                    new_img = ProjectImage(project_id=proj.id, image_url=g_url)
                    db.session.add(new_img)

    db.session.commit()
    flash('Proyek berhasil diperbarui!', 'success')
    return redirect(url_for('projects.index'))

@projects_bp.route('/delete_image/<int:img_id>', methods=['POST'])
@login_required
def delete_image(img_id):
    img = ProjectImage.query.get_or_404(img_id)
    if img.image_url:
        delete_media(img.image_url)
    db.session.delete(img)
    db.session.commit()
    flash('Gambar galeri dihapus.', 'info')
    return redirect(url_for('projects.index'))

@projects_bp.route('/delete/<int:proj_id>', methods=['POST'])
@login_required
def delete(proj_id):
    proj = Project.query.get_or_404(proj_id)
    if proj.image_url:
        delete_media(proj.image_url)
    for img in proj.images:
        if img.image_url:
            delete_media(img.image_url)
    db.session.delete(proj)
    db.session.commit()
    flash('Proyek dihapus.', 'info')
    return redirect(url_for('projects.index'))

@projects_bp.route('/toggle/<int:proj_id>', methods=['POST'])
@login_required
def toggle_visibility(proj_id):
    proj = Project.query.get_or_404(proj_id)
    proj.is_visible = not proj.is_visible
    db.session.commit()
    status = 'ditampilkan' if proj.is_visible else 'disembunyikan'
    flash(f'Proyek berhasil {status} di portofolio publik.', 'info')
    return redirect(url_for('projects.index'))
