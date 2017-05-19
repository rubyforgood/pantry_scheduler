class Note < ApplicationRecord
  belongs_to :memoable, polymorphic: true
end
