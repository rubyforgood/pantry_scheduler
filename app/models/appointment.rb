class Appointment < ApplicationRecord
  belongs_to :client
  has_many :notes, as: :memoable
end
