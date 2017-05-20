class Appointment < ApplicationRecord
  belongs_to :client
  has_many :notes, as: :memoable


  APPOINTMENT_TYPES = %w(food utilities).freeze

  validate do |model|
    if appointment_type.empty? 
      errors.add :appointment_type, "must have at least one of #{APPOINTMENT_TYPES}"
    else
      model.appointment_type.each do |type|
        unless APPOINTMENT_TYPES.include? type
          errors.add :appointment_type, "must be one of #{APPOINTMENT_TYPES}"
      end
    end
  end

  def self.for_day(date)
    includes(:client, :notes)
      .where(time: date.beginning_of_day..date.end_of_day)
  end
end
