FactoryGirl.define do
  factory :user do
    email    { "user#{SecureRandom.hex}@example.com" }
    password "moomoomoo"
  end
end
