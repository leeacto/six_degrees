class GamesController < ApplicationController
  include RottenTomatoes

  def index
    @games = Game.all
  end
  
  def new
    @end_actor = Tmdb::People.detail(4724)
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

    @actors.each do |actor|
      a = Actor.find_or_initialize_by(tmdb: actor[2].to_i)
      a.name = actor[0]
      a.profile_url = actor[1]
      a.save
    end

    game_attrs = {
      actor_start_id: params[:actors][0][2].to_i,
      actor_start_name: Actor.find_by_tmdb(params[:actors][0][2].to_i).name,
      actor_end_id: params[:actors][-1][2].to_i,
      actor_end_name: Actor.find_by_tmdb(params[:actors][-1][2].to_i).name,
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
    render json: {:location => url_for(:controller => 'games', :action => 'index')}
  end
end