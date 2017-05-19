Rails.application.routes.draw do
  namespace :api do
    resource :session
    resources :appointments do
      collection do
        get :today
      end
    end
  end

  devise_for :users
  resources :users, only: [:create]

  root to: 'home#index'
  get '*all' => 'home#index'

  namespace :api do
    resources :clients
  end
end
