Rails.application.routes.draw do
  devise_for :users
  resources :users, only: [:create]

  namespace :api do
    resources :clients
    resources :appointments do
      collection do
        get :today
      end
    end
  end

  root to: 'home#index'
  get '*all' => 'home#index'
end
