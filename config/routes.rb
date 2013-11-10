SixDegrees::Application.routes.draw do
  resources :games do
    resources :guesses
  end
  
  root 'games#new'
  
  post '/games/find_actor', to: 'games#find_actor'
  post '/games/find_actor_by_id', to: 'games#find_actor_by_id'
  post '/games/filmography', to: 'games#filmography'
  post '/games/cast', to: 'games#cast'
end
