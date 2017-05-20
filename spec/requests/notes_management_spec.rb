require "rails_helper"

RSpec.describe "Notes Managment", type: :request do
  before do
    user = create_user
    post "/users/sign_in", params: {user: {email: user.email, password: user.password}}
  end

  it 'Creates a note' do
    client = create_client
    expect {
      post "/api/clients/#{client.id}/notes", params: {note: {body: "test"}}
    }.to change(Note, :count).by(1)
  end

  it 'Updates a note' do
    client = create_client
    note = create_note(client)
    put "/api/clients/#{client.id}/notes/#{note.id}", params: {note: {body: "new text"}}
    expect(note.reload.body).to eql "new text"
  end

  def create_user
    User.create( email: "moo@moo.com", password: "moomoomoo")
  end

  def create_client
    Client.create!(first_name: "Sally",
                   last_name: "Smith",
                   address: "123 Main St",
                   county: 'Baltimore',
                   zip: '21201',
                   num_adults: 12,
                   num_children: 15,
                   usda_qualifier: false)
  end

  def create_note(client)
    Note.create!(memoable: client, body: "test", )
  end
end
