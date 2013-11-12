class Game < ActiveRecord::Base
  has_many :guesses, dependent: :destroy
  belongs_to :actor_start, class_name: 'Actor', primary_key: 'tmdb'
  belongs_to :actor_end, class_name: 'Actor', primary_key: 'tmdb'
end
