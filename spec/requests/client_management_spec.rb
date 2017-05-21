require "rails_helper"

RSpec.describe "Client Managment", type: :request do
  describe "create" do
    let(:client_params) do
      {
        first_name: "Sally",
        last_name: "Smith",
        address: "123 Main St",
        county: 'Baltimore',
        zip: '21201',
        num_adults: 12,
        num_children: 15,
        usda_qualifier: false,
      }
    end
    it "Creates a Client" do
      expect {
        post "/api/clients.json", params: { client: client_params }
      }.to change(Client, :count).by(1)
    end

    it "Returns Json for the new client" do
      post "/api/clients.json", params: { client: client_params }

      expect(JSON.parse(response.body).fetch("client")).to include("first_name" => "Sally", "last_name" => "Smith")
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
      expect(JSON.parse(response.body).fetch("clients").count).to equal(2)
    end

    it "returns nested notes" do
      expect(JSON.parse(response.body).fetch("clients").first).to include("notes" => [])
      expect(JSON.parse(response.body).fetch("clients").last).to include("notes" => [{"id"=>2, "body"=>"some text", "memoable_type"=>"Client", "memoable_id"=>22, "author_id" => note.author_id}])
    end
  end
end
