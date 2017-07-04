require "rails_helper"

RSpec.describe Appointment, :type => :model do
  context "Appointment is created" do
    let (:initial_num_adults) { 2 }
    let (:initial_num_children) { 3 }
    let (:client) { Client.create(first_name: "Paige", last_name: "Bolduc", address: "123 land", county: "Baltimore", zip: 21210, num_adults: initial_num_adults, num_children: initial_num_children, usda_qualifier: true) }
    let(:default_attrs) {
      {
        time: Date.parse('31-12-2010'),
        num_adults: initial_num_adults,
        num_children: initial_num_children,
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

    it "updates number of adults on the client" do
      FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults * 2, num_children: initial_num_children)
      expect(client.reload.num_adults).to eql(initial_num_adults * 2)
    end

    it "updates number of children on the client" do
      FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults, num_children: initial_num_children * 2)
      expect(client.reload.num_children).to eql(initial_num_children * 2)
    end
  end
end
