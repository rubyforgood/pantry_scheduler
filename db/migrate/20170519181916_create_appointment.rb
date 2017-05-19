class CreateAppointment < ActiveRecord::Migration[5.1]
  def change
    create_table :appointments do |t|
        t.datetime :time, null:false
        t.references :client
        t.integer :family_size, null:false
        t.boolean :usda_qualifier, null:false
    end
  end
end
