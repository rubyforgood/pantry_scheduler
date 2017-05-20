module API
  class AppointmentsController < ApplicationController
    def today
      render json: {
        appointments: [
          {
            id: 1,
            client_id: 1,
            family_size: 8,
            is_usda: true,
            checked_in_at: Time.now,
          },
          {
            id: 4,
            client_id: 11,
            family_size: 3,
            is_usda: true,
            checked_in_at: Time.now,
          },
          {
            id: 32,
            client_id: 12,
            family_size: 4,
            is_usda: false,
            checked_in_at: Time.now,
          }
        ],
        clients: [
          {
            id: 1,
            name: 'Sally Smith',
            county: 'PG',
            adults: 2,
            children: 6,
            certified_on: Date.today,
          },
          {
            id: 11,
            name: 'Ken Tanaka',
            county: 'PG',
            adults: 3,
            children: 0,
            certified_on: Date.today,
          },
          {
            id: 12,
            name: 'Priya Jones',
            county: 'PG',
            adults: 2,
            children: 2,
            certified_on: Date.today,
          }
        ],
        notes: [
          {
            id: 1,
            body: 'I want apples',
            memoable_type: 'Appointment',
            memoable_id: 4,
          },
        ],
      }
    end
  end
end
