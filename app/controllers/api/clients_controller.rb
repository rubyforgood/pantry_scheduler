class API::ClientsController < APIController
  respond_to :json

  def index
    clients = Client.includes(:notes)

    render json: { clients: clients.as_json(include: :notes) }
  end

  def create
    client = Client.create!(create_params)

    render json: { client: client.as_json }
  end

  def update
    client = Client.find(params[:id])
    client.update(create_params)
    render json: { client: client.as_json }
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
