class AddStepsToGames < ActiveRecord::Migration
  def change
    add_column :games, :steps, :integer
  end
end
