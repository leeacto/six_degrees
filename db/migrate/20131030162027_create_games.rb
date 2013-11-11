class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :actor_start_id
      t.integer :actor_end_id
      t.integer :steps
      t.timestamps
    end
  end
end
