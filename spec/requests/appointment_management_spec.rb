require "rails_helper"

 RSpec.describe "Appointment Managment", type: :request do
   it 'Retrieves all appointments' do
     client = create_client
     appt = create_appt(client)

     get "/api/appointments.json"

     expect(
      JSON.parse(response.body)
     ).to include(appt.as_json)
   end

   it 'Retrieves an appointment' do
     client = create_client
     appt = create_appt(client)

     get "/api/appointments/1.json"

     expect(
      JSON.parse(response.body)
     ).to include(appt.as_json,
                  client.as_json)
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

   def create_appt(client)
     Appointment.create!(id: 1, client: client, time: DateTime.new(2017, 5, 5), usda_qualifier: false, family_size: 27)
   end
 end
