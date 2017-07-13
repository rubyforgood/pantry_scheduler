class Client < ApplicationRecord
  has_many :appointments
  has_many :notes, as: :memoable

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :address, presence: true
  validates_inclusion_of :county, in: ['PG', 'AA', 'HO']
  validates :zip, presence: true
  validates :num_adults, presence: true
  validates :num_children, presence: true
  validates_inclusion_of :usda_qualifier, in: [true, false]

  def num_adults=(value, appointment_sync_occurred: false)
    super(value)
    sync_future_appointments('num_adults', value) unless appointment_sync_occurred
  end

  def num_children=(value, appointment_sync_occurred: false)
    super(value)
    sync_future_appointments('num_children', value) unless appointment_sync_occurred
  end

  def sync_future_appointments(attr, value)
    future_appointments.each do |a|
      a.send("#{attr}=", value, client_sync_occurred: true)
      a.save
    end
  end

  def future_appointments
    appointments.select { |a| a.time >= Date.today.beginning_of_day }
  end
end
