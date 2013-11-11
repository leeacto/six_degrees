class CreateGuesses < ActiveRecord::Migration
  def change
    create_table :guesses do |t|
      t.integer :film_id
      t.integer :from_actor_id
      t.integer :to_actor_id
      t.integer :game_id
      t.timestamps
    end
  end
end
