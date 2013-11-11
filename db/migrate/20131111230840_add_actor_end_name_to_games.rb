class AddActorEndNameToGames < ActiveRecord::Migration
  def change
    add_column :games, :actor_end_name, :string
  end
end
