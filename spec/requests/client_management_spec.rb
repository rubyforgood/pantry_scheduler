require "rails_helper"

RSpec.describe "Client Managment", type: :request do
  let (:response_json) { JSON.parse(response.body, symbolize_names: true) }
  let(:client_params) do
    {
      first_name: "Sally",
      last_name: "Smith",
      address: "123 Main St",
      county: 'AA',
      zip: '21201',
      num_adults: 12,
      num_children: 15,
      usda_qualifier: false,
    }
  end

  describe "create" do
    it "creates a Client" do
      expect {
        post "/api/clients.json", params: { client: client_params }
      }.to change(Client, :count).by(1)
    end

    it "returns Json for the new client" do
      post "/api/clients.json", params: { client: client_params }

      expect(response_json.fetch(:client)).to include(first_name: "Sally", last_name: "Smith")
    end

    it 'returns a 400 when errors occur' do
      incomplete_params = client_params.merge(first_name: nil)

      expect(
        post "/api/clients.json", params: { client: incomplete_params }
      ).to equal(400)
    end

    it 'handles errors' do
      incomplete_params = client_params.merge(first_name: nil)

      post "/api/clients.json", params: { client: incomplete_params }

      expect(response_json).to have_key(:errors)
    end
  end

  describe 'update' do
    let!(:client) { FactoryGirl.create(:client) }

    it 'successfully updates client' do
      put "/api/clients/#{client.id}.json", params: { client: {first_name: 'Update'} }

      expect(client.reload.first_name).to eql('Update')
    end

    it 'returns a 400 when errors occur' do
      incomplete_params = client_params.merge(first_name: nil)

      expect(
        put "/api/clients/#{client.id}.json", params: { client: incomplete_params }
      ).to equal(400)
    end

    it 'handles errors' do
      incomplete_params = client_params.merge(first_name: nil)

      put "/api/clients/#{client.id}.json", params: { client: incomplete_params }

      expect(response_json).to have_key(:errors)
    end
  end

  describe "index" do
    let!(:client) { FactoryGirl.create(:client) }
    let!(:client_with_notes) { FactoryGirl.create(:client) }
    let!(:note) { FactoryGirl.create(:note, memoable: client_with_notes) }

    before do
      get "/api/clients.json"
    end

    it "retrieves all clients" do
      expect(response_json.fetch(:clients).count).to equal(2)
    end

    it "returns nested notes" do
      expect(response_json.fetch(:clients).first).to include(notes: [])
      expect(response_json.fetch(:clients).last).to include(notes: [{id: note.id, body: "some text", memoable_type: "Client", memoable_id: client_with_notes.id, author_id: note.author_id}])
    end
  end

  describe 'autocomplete_name' do
    let (:query_name) {'Name'}

    it 'returns clients with matching first names' do
      client = FactoryGirl.create(:client, first_name: query_name)
      get "/api/clients/autocomplete_name/#{query_name}.json"

      expect(response_json).to include(clients: [client.as_json.symbolize_keys])
    end

    it 'returns clients with matching last names' do
      client = FactoryGirl.create(:client, last_name: query_name)
      get "/api/clients/autocomplete_name/#{query_name}.json"

      expect(response_json).to include(clients: [client.as_json.symbolize_keys])
    end
  end
end
