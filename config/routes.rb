SixDegrees::Application.routes.draw do
  resources :games do
    resources :guesses
  end
  
  root 'games#new'
  
  post '/games/find_actor', to: 'games#find_actor'
  post '/games/find_actor_by_id', to: 'games#find_actor_by_id'
  post '/games/find_film_by_id', to: 'games#find_film_by_id'
  post '/games/filmography', to: 'games#filmography'
  post '/games/cast', to: 'games#cast'
  get '/games/results', to: 'games#results'
  post '/games/persist', to: 'games#persist'
  post '/games/popular', to: 'games#popular'
  get '/pages/how', to: 'pages#how'
end
