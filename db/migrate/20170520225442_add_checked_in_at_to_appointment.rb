class AddCheckedInAtToAppointment < ActiveRecord::Migration[5.1]
  def change
    add_column :appointments, :checked_in_at, :datetime
  end
end
