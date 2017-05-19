class AddClientDetails < ActiveRecord::Migration[5.1]
  def change
    add_column :clients, :address, :string, null:false
    add_column :clients, :phone_number, :string
    add_column :clients, :cell_number, :string
    add_column :clients, :email, :string
    add_column :clients, :county, :string, null:false
    add_column :clients, :zip, :string, null:false
    add_column :clients, :num_adults, :integer, null:false
    add_column :clients, :num_children, :integer, null:false
    add_column :clients, :usda_cert_date, :date
    add_column :clients, :usda_qualifier, :boolean, null:false

    change_column :clients, :first_name, :string, null:false
    change_column :clients, :last_name, :string, null:false
  end
end
