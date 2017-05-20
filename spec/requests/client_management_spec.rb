require "rails_helper"

RSpec.describe "Client Managment", type: :request do
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
