class Api::AppointmentsController < ApplicationController
  respond_to :json

  def index
    render json: Appointment.all.as_json
  end

  def show
    appt = Appointment.includes(:client).find_by(id: params[:id])
    if appt
      client_json = appt.client.as_json
      render json: appt.as_json.merge(client_json)
    else
      render json: {
        errors: {
          message: 'Not found'
        }
      }, status: 404
    end
  end

  private

  def appointment_params
    params.require(:appointment).expect(:time, :client_id, :family_size, :usda_qualifier)
  end
end
