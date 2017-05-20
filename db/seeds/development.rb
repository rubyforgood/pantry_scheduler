require 'faker'
Faker::Config.locale = 'en-US'

require 'discrete_distribution'

# Login user
User.create!(
  email: 'admin@example.com',
  password: 'abc123',
  password_confirmation: 'abc123',
)

possible_num_children = DiscreteDistribution.new(
  0 => 3,
  1 => 6,
  2 => 6,
  3 => 5,
  4 => 4,
  5 => 3,
  6 => 2,
  20 => 1,
)

possible_num_adults = DiscreteDistribution.new(
  1 => 9,
  2 => 9,
  3 => 6,
  4 => 3,
  5 => 1,
)

possible_counties = DiscreteDistribution.new(
  'PG' => 20,
  'AA' => 5,
  'HO' => 3,
)

clients = Array.new(100) do
  county = possible_counties.sample
  putc '.'

  Client.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    address: "#{Faker::Address.street_address}#{', ' + Faker::Address.secondary_address if rand < 0.2}",
    phone_number: (Faker::PhoneNumber.phone_number if rand < 0.9),
    cell_number: (Faker::PhoneNumber.cell_phone if rand < 0.9),
    email: (Faker::Internet.email if rand < 0.9),
    county: county,
    zip: Faker::Address.zip,
    num_adults: possible_num_adults.sample,
    num_children: possible_num_children.sample,
    usda_cert_date: ((Faker::Date.between(11.months.ago, Date.today + 1.month) if county == 'PG') if rand < 0.9),
    usda_qualifier: county == 'PG',
  )
end


appointments = Array.new(500) do
  client = clients.sample
  putc '.'

  Appointment.create!(
    time: Faker::Date.between(1.year.ago, Date.today + 2.months),
    appointment_type: Appointment::APPOINTMENT_TYPES.sample,
    client_id: client.id,
    family_size: client.num_adults + client.num_children,
    usda_qualifier: client.usda_qualifier
  )
end


100.times do
  memoable = rand < 0.75 ? appointments.sample : clients.sample

  memoable.notes.create!(
    body: Faker::Lorem.sentence,
  )
  putc '.'
end
