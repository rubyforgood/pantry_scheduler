class Client < ApplicationRecord
  has_many :appointments
  has_many :notes, as: :memoable

  def num_adults=(value)
    sync_future_appointments('num_adults', value)
    super(value)
  end

  def num_children=(value)
    sync_future_appointments('num_children', value)
    super(value)
  end

  def sync_future_appointments(attr, value)
    future_appointments.each do |a|
      next if a.send(attr) == value
      a.send("#{attr}=", value)
      a.save
    end
  end

  def future_appointments
    appointments.select { |a| a.time >= Date.today.beginning_of_day }
  end
end
