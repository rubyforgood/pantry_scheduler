require 'faker'
require 'discrete_distribution'

User.create!(
  email: 'admin@example.com',
  password: 'abc123',
  password_confirmation: 'abc123',
)
