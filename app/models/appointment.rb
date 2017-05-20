class Appointment < ApplicationRecord
  belongs_to :client
  has_many :notes, as: :memoable

  def self.for_day(date)
    includes(:client, :notes)
      .where(time: date.beginning_of_day..date.end_of_day)
  end
end
