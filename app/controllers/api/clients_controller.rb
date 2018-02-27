class API::ClientsController < APIController
  respond_to :json

  def index
    clients = Client.includes(:notes)

    render json: { clients: clients.as_json(include: :notes) }
  end

  def create
    client = Client.new(client_params)

    if client.save
      render json: { client: client.as_json }
    else
      render_errors(client)
    end
  end

  def update
    client = Client.find(params[:id])

    if client.update(client_params)
      render json: { client: client.as_json }
    else
      render_errors(client)
    end
  end

  def autocomplete_name
    clients = Client.where('first_name ~* :query OR last_name ~* :query', query: params[:name])

    render json: {
      clients: clients.as_json,
    }
  end

  private

  def client_params
    params.require(:client)
          .permit(
            :first_name,
            :last_name,
            :address,
            :county,
            :zip,
            :num_adults,
            :num_children,
            :usda_qualifier,
            :phone_number,
            :cell_number,
            :email
          )
  end
end
