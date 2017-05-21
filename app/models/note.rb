class Note < ApplicationRecord
  belongs_to :memoable, polymorphic: true
  belongs_to :author, class_name: 'User'
end
