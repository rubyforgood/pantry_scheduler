class API::AppointmentsController < ApplicationController
  respond_to :json

  def index
    appointments = Appointment.includes(:client)

    render json: {
      appointments: appointments.map(&:attributes),
      clients: appointments.map(&:client).map(&:attributes),
    }
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

  def today
    appointments = Appointment.for_day(Date.today)

    render json: {
      appointments: appointments.map(&:attributes),
      clients: appointments.map(&:client).map(&:attributes),
      notes: appointments.flat_map(&:notes).map(&:attributes),
    }
  end

  def create
    appt = Appointment.new(appointment_params)
    if appt.save
      render json: appt
    else
      appt.valid?
      render json: {
        errors: {
          message: appt.errors.full_messages.first
        }
      }, status: 400
    end
  end

  private

  def appointment_params
    params.require(:appointment).permit(:time, :client_id, :family_size, :usda_qualifier, appointment_type: [])
  end
end
