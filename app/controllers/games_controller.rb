class GamesController < ApplicationController
  include RottenTomatoes

  def index
    @games = Game.all.order('actor_end_name ASC').order('actor_start_name').order('steps ASC')
  end
  
  def show
    @game = Game.find(params[:id])
    @guesses = @game.guesses.order('id ASC')
  end

  def new
  end

  def how
  end
  
  def find_actor
    @actor_array = Tmdb::People.search(params[:search])
    render json: @actor_array
  end

  def find_actor_by_id
    @actor = Tmdb::People.detail(params[:id].to_i)
    render json: @actor
  end

  def find_film_by_id
    @film = Tmdb::Movie.detail(params[:id].to_i)
    render json: @film
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
    @actors = params[:actors].values
    @films = params[:films].values

    @actors.each_with_index do |actor, index|
      a = Actor.find_or_initialize_by(tmdb: actor[2].to_i)
      a.name = actor[0]
      a.profile_url = actor[1]
      a.save
    end

    @films.each_with_index do |film, index|
      f = Film.find_or_initialize_by(tmdb: film[2].to_i)
      f.title = film[0]
      f.profile_url = film[1]
      f.save
    end

    game_attrs = {
      actor_start_id: @actors[0][2].to_i,
      actor_start_name: Actor.find_by_tmdb(@actors[0][2].to_i).name,
      actor_end_id: @actors[-1][2].to_i,
      actor_end_name: Actor.find_by_tmdb(@actors[-1][2].to_i).name,
      steps: @films.count
    }
    @game = Game.create(game_attrs)
    @films.each_with_index do |film, index|
      guess_attrs = {
        film_id: film[2].to_i,
        from_actor_id: @actors[index][2].to_i,
        to_actor_id: @actors[index + 1][2].to_i,
      }
      new_guess = @game.guesses.build(guess_attrs)
      new_guess.save
    end
    render json: {:location => url_for(:controller => 'games', :action => 'index')}
  end
end