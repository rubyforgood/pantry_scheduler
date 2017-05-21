FactoryGirl.define do
  factory :note do
    association :memoable, factory: :client
    body "some text"
    author { FactoryGirl.create :user }
  end
end
