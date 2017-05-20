require "rails_helper"

RSpec.describe "Appointment Managment", type: :request do
  describe 'index' do
    it 'Retrieves all appointments' do
      client = create_client
      appt = create_appt(client)


      get "/api/appointments.json"

      expect(response_json[:appointments].first).to include(id: appt.id)
      expect(response_json[:clients].first).to include(id: client.id)
    end
  end

  describe 'show' do
    it 'Retrieves an appointment' do
      client = create_client
      appt = create_appt(client)

      get "/api/appointments/#{appt.id}.json"

      expect(response_json[:appointment]).to include(id: appt.id)
      expect(response_json[:client]).to include(id: client.id)
    end
  end

  describe 'today' do
    it 'fetches appointments for today' do
       client    = create_client
       yesterday = create_appt(client, time: 1.day.ago)
       today     = create_appt(client, time: Time.now)
       tomorrow  = create_appt(client, time: 1.day.from_now)

       get '/api/appointments/today.json'

       expect(response_json[:appointments].count).to eq 1
       expect(response_json[:appointments].first[:id]).to eq today.id
       expect(response_json[:clients].first[:id]).to eq client.id
       expect(response_json[:notes]).to be_empty
    end
  end

  describe 'create' do
    let(:appointment_params) do
      { client_id: 1,
        time: DateTime.new(2017, 5, 5),
        usda_qualifier: false,
        family_size: 27,
        appointment_type: %w(food) }
    end

    it 'Creates a new appointment' do
      client = create_client

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

  def response_json
    JSON.parse(response.body, symbolize_names: true)
  end

  def create_client
    Client.create!(id: 1,
                   first_name: "Sally",
                   last_name: "Smith",
                   address: "123 Main St",
                   county: 'Baltimore',
                   zip: '21201',
                   num_adults: 12,
                   num_children: 15,
                   usda_qualifier: false)
  end

  def create_appt(client, time: DateTime.now)
    Appointment.create!(client: client,
                        time: time,
                        usda_qualifier: false,
                        family_size: 27,
                        appointment_type: %w(food))
  end
end
