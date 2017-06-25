class Client < ApplicationRecord
  has_many :appointments
  has_many :notes, as: :memoable

  def update(attributes)
    sync_appt_adults(attributes[:num_adults]) if attributes[:num_adults].present?
    sync_appt_children(attributes[:num_children]) if attributes[:num_children].present?
    super(attributes)
  end

  def sync_appt_adults(num_adults)
    future_appointments.each { |a| a.update(num_adults: num_adults) }
  end

  def sync_appt_children(num_children)
    future_appointments.each { |a| a.update(num_children: num_children) }
  end

  def future_appointments
    appointments.select { |a| a.time >= DateTime.now.beginning_of_day }
  end
end
