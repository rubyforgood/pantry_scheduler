require 'faker'
Faker::Config.locale = 'en-US'

require 'discrete_distribution'

# Login user
existing_user = User.find_by(email: 'admin@example.com')
login_user = if existing_user
  existing_user
else
  User.create!(
    email: 'admin@example.com',
    password: 'abc123',
    password_confirmation: 'abc123',
  )
end

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
  usda_cert_date = ((Faker::Date.between(Date.today - 11.months, Date.today + 1.month) if county == 'PG') if rand < 0.9)
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
    usda_cert_date: usda_cert_date,
    usda_qualifier: !usda_cert_date.nil?,
  )
end

appointments = Array.new(500) do
  client = clients.sample
  date = Faker::Date.between(Date.today - 1.year, Date.today + 2.months)
  time = Faker::Time.between(date, date, :morning) if date <= Date.today && rand < 0.9
  putc '.'

  Appointment.create!(
    time: date,
    appointment_type: Appointment::APPOINTMENT_TYPES.sample([1, 2].sample),
    checked_in_at: time,
    client_id: client.id,
    num_adults: client.num_adults,
    num_children: client.num_children,
    usda_qualifier: client.usda_qualifier
  )
end


# For reviewing the directory, it's helpful to have at least one appointment
# for today for a client in PG county who doesn't qualify for USDA.
pg_non_usda_client = Client.where(county: 'PG', usda_qualifier: false).first
Appointment.create!(
  time: Date.today,
  # We'll have them be all appointment types
  appointment_type: Appointment::APPOINTMENT_TYPES,
  checked_in_at: (Faker::Time.between(Date.today, Date.today, :morning) if rand < 0.5),
  client_id: pg_non_usda_client.id,
  num_adults: pg_non_usda_client.num_adults,
  num_children: pg_non_usda_client.num_children,
  usda_qualifier: pg_non_usda_client.usda_qualifier
)

# For reviewing the directory, it's helpful to have at least one appointment
# for today for a client in PG county who does qualify for USDA.
pg_usda_client = Client.where(county: 'PG', usda_qualifier: true).first
Appointment.create!(
  time: Date.today,
  # We'll have them be all appointment types
  appointment_type: Appointment::APPOINTMENT_TYPES,
  checked_in_at: (Faker::Time.between(Date.today, Date.today, :morning) if rand < 0.5),
  client_id: pg_usda_client.id,
  num_adults: pg_usda_client.num_adults,
  num_children: pg_usda_client.num_children,
  usda_qualifier: pg_usda_client.usda_qualifier
)

# For reviewing the directory, it's helpful to have at least one appointment
# for today for a client in PG county who doesn't qualify for USDA.
aa_client = Client.where(county: 'AA').first
Appointment.create!(
  time: Date.today,
  # We'll have them be all appointment types
  appointment_type: Appointment::APPOINTMENT_TYPES,
  checked_in_at: (Faker::Time.between(Date.today, Date.today, :morning) if rand < 0.5),
  client_id: aa_client.id,
  num_adults: aa_client.num_adults,
  num_children: aa_client.num_children,
  usda_qualifier: aa_client.usda_qualifier
)


100.times do
  memoable = rand < 0.75 ? appointments.sample : clients.sample

  memoable.notes.create!(
    body: Faker::Lorem.sentence,
    author: login_user,
  )
  putc '.'
end
