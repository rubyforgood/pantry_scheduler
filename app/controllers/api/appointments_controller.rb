class API::AppointmentsController < ApplicationController
  respond_to :json

  def index
    appointments = Appointment.includes(:client)

    render json: {
      appointments: appointments.as_json,
      clients: appointments.map(&:client).as_json,
    }
  end

  def show
    appt = Appointment.includes(:client).find_by(id: params[:id])
    if appt
      render json: {
        appointment: appt.as_json,
        client: appt.client.as_json,
      }
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
      appointments: appointments.as_json,
      clients: appointments.map(&:client).as_json,
      notes: appointments.flat_map(&:notes).as_json,
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
    params.require(:appointment).permit(:time, :client_id, :family_size, :usda_qualifier)
  end
end
