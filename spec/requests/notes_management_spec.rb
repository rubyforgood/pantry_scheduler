require "rails_helper"

RSpec.describe "Notes Managment", type: :request do
  let(:user) { FactoryGirl.create(:user) }

  before do
    post "/users/sign_in", params: {user: {email: user.email, password: user.password}}
  end

  context 'when attached to an appointment' do
    let(:client) { FactoryGirl.create(:client) }
    let(:note)   { FactoryGirl.create(:note, memoable: client) }

    it 'Creates a note' do
      expect {
        post "/api/clients/#{client.id}/notes", params: {note: {body: "test"}}
      }.to change(Note, :count).by(1)
    end

    it 'Updates a note' do
      put "/api/clients/#{client.id}/notes/#{note.id}", params: {note: {body: "new text"}}
      expect(note.reload.body).to eql "new text"
    end
  end

  context 'when attached to an appointment' do
    let(:appointment) { FactoryGirl.create(:appointment) }
    let(:note)        { FactoryGirl.create(:note, memoable: appointment) }

    it 'Creates a note correctly attached to the appointment' do
      expect {
        post "/api/appointments/#{appointment.id}/notes", params: {note: {body: "test"}}
      }.to change(Note, :count).by(1)
    end
  end
end
