class CreateFilms < ActiveRecord::Migration
  def change
    create_table :films do |t|
      t.string :title
      t.string :profile_url
      t.integer :tmdb

      t.timestamps
    end
  end
end
