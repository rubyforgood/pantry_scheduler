class API::AppointmentsController < APIController
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
      render json: { appointment: appt }
    else
      render_errors(appt)
    end
  end

  def destroy
    appt = Appointment.find_by(id: params[:id])
    appt ? appt.destroy! : render_not_found
  end

  private

  def appointment_params
    params.require(:appointment).permit(:time, :client_id, :num_adults, :num_children, :usda_qualifier, :checked_in_at, appointment_type: [])
  end

  def serialized_notes(notes)
    notes.map { |note|
      note.as_json(include: :author)
    }
  end
end
