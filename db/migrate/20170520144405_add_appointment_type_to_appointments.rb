class AddAppointmentTypeToAppointments < ActiveRecord::Migration[5.1]
  def change
    add_column :appointments, :appointment_type, :string, array: true
  end
end
