class AddActorStartNameToGames < ActiveRecord::Migration
  def change
    add_column :games, :actor_start_name, :string
  end
end
