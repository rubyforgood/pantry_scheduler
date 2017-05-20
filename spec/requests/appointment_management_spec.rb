require "rails_helper"

RSpec.describe "Appointment Managment", type: :request do
  let!(:client) { FactoryGirl.create(:client) }
  let!(:appt)   { FactoryGirl.create(:appointment, client: client, time: Time.now) }

  let (:response_json) { JSON.parse(response.body, symbolize_names: true) }

  describe 'index' do
    it 'Retrieves all appointments' do
      get "/api/appointments.json"

      expect(response_json[:appointments].first).to include(id: appt.id)
      expect(response_json[:clients].first).to include(id: client.id)
    end
  end

  describe 'show' do
    it 'Retrieves an appointment' do
      get "/api/appointments/#{appt.id}.json"

      expect(response_json[:appointment]).to include(id: appt.id)
      expect(response_json[:client]).to include(id: client.id)
    end
  end

  describe 'today' do
    let!(:yesterday) { FactoryGirl.create(:appointment, client: client, time: 1.day.ago) }
    let!(:today)     { appt }
    let!(:tomorrow)  { FactoryGirl.create(:appointment, client: client, time: 1.day.from_now) }

    it 'fetches appointments for today' do
      get '/api/appointments/today.json'

      expect(response_json[:appointments].count).to eq 1
      expect(response_json[:appointments].first[:id]).to eq today.id
      expect(response_json[:clients].first[:id]).to eq client.id
      expect(response_json[:notes]).to be_empty
    end
  end

  describe 'create' do
    let(:appointment_params) {{
      client_id: client.id,
      time: DateTime.new(2017, 5, 5),
      usda_qualifier: false,
      family_size: 27,
      appointment_type: %w(food),
    }}

    it 'Creates a new appointment' do
      expect {
        post "/api/appointments.json", params: { appointment: appointment_params }
      }.to change(Appointment, :count).by(1)
    end

    it 'Returns a 400 when errors occur' do
      incomplete_params = appointment_params.merge(client_id: nil)

      expect(
        post "/api/appointments.json", params: { appointment: incomplete_params }
      ).to equal(400)
    end

    it 'Handles errors' do
      incomplete_params = appointment_params.merge(client_id: nil)

      post "/api/appointments.json", params: { appointment: incomplete_params }

      expect(response_json).to have_key(:errors)
    end
  end
end
