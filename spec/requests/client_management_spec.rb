require "rails_helper"

RSpec.describe "Client Managment", type: :request do
  it "Creates a Client" do 
    expect {
      post "/clients.json", params: { client: {first_name: "Sally", last_name: "Smith"} }
    }.to change(Client, :count).by(1)
  end

  it "Returns Json for the new client" do
    post "/clients.json", params: { client: {first_name: "Sally", last_name: "Smith"} }

    expect(JSON.parse(response.body).fetch("client")).to include("first_name" => "Sally", "last_name" => "Smith")
  end
end