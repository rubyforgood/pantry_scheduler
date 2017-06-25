require "rails_helper"
require "pry"

RSpec.describe Client, :type => :model do
  context "Client family size is updated" do
    let(:initial_num_adults) { 2 }
    let(:initial_num_children) { 3 }
    let(:client) { Client.create(first_name: "Paige", last_name: "Bolduc", address: "123 land", county: "Baltimore", zip: 21210, num_adults: initial_num_adults, num_children: initial_num_children, usda_qualifier: true) }
    let!(:today_appt)   { FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults, num_children: initial_num_children, time: DateTime.now) }
    let!(:future_appt)   { FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults, num_children: initial_num_children, time: DateTime.now + 1) }
    let!(:past_appt)   { FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults, num_children: initial_num_children, time: DateTime.now - 1) }

    before do
      client.update(num_adults: initial_num_adults * 2, num_children: initial_num_children * 2)
    end

    it "updates family size for today's appointments" do
      expect(today_appt.reload.num_adults).to eql(initial_num_adults * 2)
      expect(today_appt.reload.num_children).to eql(initial_num_children * 2)
    end

    it "updates family size for future appointments" do
      expect(future_appt.reload.num_adults).to eql(initial_num_adults * 2)
      expect(future_appt.reload.num_children).to eql(initial_num_children * 2)
    end

    it "does not update past appointments" do
      expect(past_appt.reload.num_adults).to eql(initial_num_adults)
      expect(past_appt.reload.num_children).to eql(initial_num_children)
    end
  end

  context "Client family size is not updated" do
    let(:initial_num_adults) { 2 }
    let(:initial_num_children) { 3 }
    let(:client) { Client.create(first_name: "Paige", last_name: "Bolduc", address: "123 land", county: "Baltimore", zip: 21210, num_adults: initial_num_adults, num_children: initial_num_children, usda_qualifier: true) }
    let!(:future_appt)   { FactoryGirl.create(:appointment, client: client, num_adults: initial_num_adults, num_children: initial_num_children, time: DateTime.now + 1) }

    before do
      client.update(first_name: 'New')
    end

    it "does not update appointment family size" do
      expect(future_appt.reload.num_adults).to eql(initial_num_adults)
      expect(future_appt.reload.num_children).to eql(initial_num_children)
    end
  end
end
