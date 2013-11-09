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

  def filmography
    puts "Params #{params}"
    @films = Tmdb::People.credits(params[:id].to_i)["cast"]
    @films.map! {|film| [film["id"], film["title"]]}
    render json: @films
  end
end