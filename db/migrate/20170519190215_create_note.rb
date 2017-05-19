class CreateNote < ActiveRecord::Migration[5.1]
  def change
    create_table :notes do |t|
      t.string :body, null: false
      t.references :memoable, polymorphic: true, index: true
    end
  end
end
