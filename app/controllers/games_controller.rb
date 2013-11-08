class GamesController < ApplicationController
  include RottenTomatoes
  
  def new
    @end_actor = Tmdb::People.detail(4724)
    @movie = RottenMovie.find(:imdb => 137523)
  end

  def find_actor
    @actor_array = Tmdb::People.search(params[:search])
    render json: @actor_array
  end
end