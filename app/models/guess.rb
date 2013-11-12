class Guess < ActiveRecord::Base
  belongs_to :game
  belongs_to :from_actor, class_name: 'Actor', primary_key: 'tmdb'
  belongs_to :to_actor, class_name: 'Actor', primary_key: 'tmdb'
  belongs_to :film, primary_key: 'tmdb'
end
