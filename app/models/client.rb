class Client < ApplicationRecord
  has_many :appointments
  has_many :notes, as: :memoable
end
