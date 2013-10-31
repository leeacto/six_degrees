class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :actor_start_id
      t.string :actor_end_id

      t.timestamps
    end
  end
end
