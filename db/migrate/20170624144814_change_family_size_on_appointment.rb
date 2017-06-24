class ChangeFamilySizeOnAppointment < ActiveRecord::Migration[5.1]
  def change
    remove_column :appointments, :family_size

    add_column :appointments, :num_adults, :integer, null:false
    add_column :appointments, :num_children, :integer, null:false
  end
end
