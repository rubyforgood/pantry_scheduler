FactoryGirl.define do
  factory :client do
    first_name     "Sally"
    last_name      "Smith"
    address        "123 Main St"
    county         'AA'
    zip            '21201'
    num_adults     12
    num_children   15
    usda_qualifier false
  end
end
