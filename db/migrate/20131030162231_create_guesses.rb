class CreateGuesses < ActiveRecord::Migration
  def change
    create_table :guesses do |t|
      t.string :film_id
      t.string :from_actor_id
      t.string :to_actor_id

      t.timestamps
    end
  end
end
