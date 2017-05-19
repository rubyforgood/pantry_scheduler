module API
  class ClientsController < ApplicationController
    respond_to :json
    def create
      client = Client.create!(create_params)

      respond_with client
    end


    private

    def create_params
      params.require(:client).permit(:first_name, :last_name)
    end
  end
end
