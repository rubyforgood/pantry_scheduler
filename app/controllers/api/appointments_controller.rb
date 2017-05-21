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
      render_not_found
    end
  end

  def today
    appointments = Appointment.for_day(Date.today)

    render json: {
      appointments: appointments.as_json,
      clients: appointments.map(&:client).as_json,
      notes: serialized_notes(appointments.flat_map(&:notes)),
    }
  end

  def create
    appt = Appointment.new(appointment_params)
    if appt.save
      render json: appt
    else
      render_errors(appt)
    end
  end

  def update
    appt = Appointment.find(params[:id])
    if appt.update(appointment_params)
      render json: appt
    else
      render_errors(appt)
    end
  end

  def destroy
    appt = Appointment.find_by(id: params[:id])
    appt ? appt.destroy! : render_not_found
  end

  private

  def render_errors(appt)
    render json: {
      errors: {
        message: appt.errors.full_messages.first
      }
    }, status: 400
  end

  def render_not_found
    render json: {
      errors: {
        message: 'Not found'
      }
    }, status: 404
  end

  def appointment_params
    params.require(:appointment).permit(:time, :client_id, :family_size, :usda_qualifier, :checked_in_at, appointment_type: [])
  end

  def serialized_notes(notes)
    notes.map { |note|
      note.as_json.merge(author: note.author && note.author.email)
    }
  end
end
