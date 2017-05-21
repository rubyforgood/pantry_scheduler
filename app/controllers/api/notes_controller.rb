class API::NotesController < APIController
  before_action :authenticate_user!

  def update
    note = Note.find_by(id: params["id"])

    # FIXME JSON-ify this later
    # flash[:alert] = "Note not found."; redirect_back(fallback_location: root_path); return if note.nil?
    # flash[:alert] = "Please enter your note."; redirect_back(fallback_location: root_path); return if params["note"].try(:[],"body").blank?

    note.update(note_params)

    render json: { note: note.as_json }
  end

  def create
    note = find_memoable.notes.create(note_params.merge(author: current_user))
    render json: { note: note.as_json(include: :author) }
  end

  def destroy
    Note.destroy params[:id]
  end

  private

  def find_memoable
    type = params[:memoable_type]
    memoable_class = type.constantize
    memoable_class.find(params["#{type.underscore}_id"])
  end

  def note_params
    params.require(:note).permit(:body)
  end
end
