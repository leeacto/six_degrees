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
    render json: @actor
  end

  def filmography
    @films = Tmdb::People.credits(params[:id].to_i)['cast']
    @films.map! {|film| [film["id"], film["title"]]}
    render json: @films
  end

  def cast
    @cast = Tmdb::Movie.casts(params[:id].to_i)
    @film = Tmdb::Movie.detail(params[:id].to_i).poster_path
    @cast.map! {|actor| [actor["id"], actor["name"]]}
    render json: [@cast, @film]
  end

  def persist
    @actors = params[:actors]
    game_attrs = {
      actor_start_id: params[:actors][0],
      actor_end_id: params[:actors][-1],
      steps: params[:movies].count
    }
    @game = Game.create(game_attrs)
    params[:movies].each_with_index do |movie, index|
      guess_attrs = {
        film_id: movie,
        from_actor_id: @actors[index],
        to_actor_id: @actors[index + 1],
      }
      new_guess = @game.guesses.build(guess_attrs)
      new_guess.save
    end

    redirect_to 'results'
  end

  def results

  end

  private
end