class API::NotesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def update
    note = Note.find_by(id: params["id"])

    # FIXME JSON-ify this later
    # flash[:alert] = "Note not found."; redirect_back(fallback_location: root_path); return if note.nil?
    # flash[:alert] = "Please enter your note."; redirect_back(fallback_location: root_path); return if params["note"].try(:[],"body").blank?

    note.update(note_params)

    render json: note.as_json
  end

  def create
    note = find_memoable.notes.create(note_params)
    render json: note.as_json
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
