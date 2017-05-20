class Api::NotesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def update
    note = Note.find_by_id params["id"]

    # FIXME JSON-ify this later
    # flash[:alert] = "Note not found."; redirect_back(fallback_location: root_path); return if note.nil?
    # flash[:alert] = "Please enter your note."; redirect_back(fallback_location: root_path); return if params["note"].try(:[],"body").blank?

    note.body = params["note"]["body"]
    note.save

    render json: note.as_json
  end

  def create
    client = Client.find(params["client_id"])
    note = client.notes.create!(create_params)
    render json: note.as_json
  end

  private

  def create_params
    params.require(:note).permit(:body)
  end
end
