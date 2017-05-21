FactoryGirl.define do
  factory :appointment do
    association :client
    time Time.now
    family_size 3
    usda_qualifier false
    appointment_type %w(food)
  end
end
