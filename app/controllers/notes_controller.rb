class NotesController < ApplicationController
  before_action :authenticate_user!

  def edit
    note = Note.find_by_id params["id"]

    flash[:alert] = "Note not found."; redirect_back(fallback_location: root_path); return if note.nil?
    flash[:alert] = "Please enter your note."; redirect_back(fallback_location: root_path); return if params["note"].try(:[],"body").blank?

    note.body = params["note"]["body"]
    note.save
  end

  def create
    note = Note.create(params["note"])
  end
end
