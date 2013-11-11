class CreateActors < ActiveRecord::Migration
  def change
    create_table :actors do |t|
      t.string :name
      t.string :profile_url
      t.integer :tmdb

      t.timestamps
    end
  end
end
