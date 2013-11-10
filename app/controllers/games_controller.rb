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

  def find_actor_by_id
    @actor = Tmdb::People.detail(params[:id].to_i)
    puts @actor.inspect
    render json: @actor
  end

  def filmography
    @films = Tmdb::People.credits(params[:id].to_i)["cast"]
    @films.map! {|film| [film["id"], film["title"]]}
    render json: @films
  end

  def cast
    @cast = Tmdb::Movie.casts(params[:id].to_i)
    @cast.map! {|actor| [actor["id"], actor["name"]]}
    render json: @cast
  end
end