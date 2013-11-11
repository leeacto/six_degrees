class AddGamesIdToGuesses < ActiveRecord::Migration
  def change
    add_column :guesses, :game_id, :integer
  end
end
