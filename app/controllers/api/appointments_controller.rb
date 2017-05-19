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
          }
        ],
        clients: [
          {
            id: 1,
            name: 'Sally Smith',
            county: 'PG',
            adults: 2,
            children: 12,
            certified_on: Date.today,
          }
        ],
      }
    end
  end
end
