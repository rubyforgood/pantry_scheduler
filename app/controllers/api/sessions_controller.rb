module API
  class SessionsController < ApplicationController
    def show
      respond_to do |format|
        format.json do
          render json: {
            session: {
              user: {
                id: 1,
                name: 'Jamie Gaskins',
              },
            },
          }
        end
      end
    end
  end
end
