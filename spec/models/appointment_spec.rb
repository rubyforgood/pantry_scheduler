require "rails_helper"

RSpec.describe Appointment, :type => :model do
  context "Client is created" do
    let (:client) { Client.create(first_name: "Paige", last_name: "Bolduc", address: "123 land", county: "Baltimore", zip: 21210, num_adults: 2, num_children: 3, usda_qualifier: true) }
    let(:default_attrs) {
      {
        time: Date.parse('31-12-2010'),
        num_adults: 2,
        num_children: 3,
        usda_qualifier: true,
        appointment_type: ["food"],
        client_id: client.id,
      }
    }

    it "adds an appointment type successfully" do
      appointment = Appointment.new(default_attrs)
      expect(appointment).to be_valid
    end

    it "fails if using an invalid appointment type" do
      appointment = Appointment.new(default_attrs.merge(appointment_type: ["invalid_appointment_type"]))
      expect(appointment).not_to be_valid
    end

    it "can not have an empty appointment_type array" do
      appointment = Appointment.new(default_attrs.merge(appointment_type: []))
      expect(appointment).not_to be_valid
    end
  end
end
