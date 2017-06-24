FactoryGirl.define do
  factory :appointment do
    association :client
    time Time.now
    num_children 12
    num_adults 15
    usda_qualifier false
    appointment_type %w(food)
  end
end
