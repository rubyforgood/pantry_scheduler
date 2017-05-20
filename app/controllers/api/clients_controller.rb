class API::ClientsController < ApplicationController
  respond_to :json
  def create
    client = Client.create!(create_params)

    render json: client.as_json
  end

  private

  def create_params
    params
      .require(:client)
      .permit(
        :first_name,
        :last_name,
        :address,
        :county,
        :zip,
        :num_adults,
        :num_children,
        :usda_qualifier,
      )
  end
end
