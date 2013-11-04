SixDegrees::Application.routes.draw do
  resources :games do
    resources :guesses
  end
  root 'games#new'

end
