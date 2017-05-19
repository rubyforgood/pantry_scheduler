Rails.application.routes.draw do
  devise_for :users
  resources :users, only: [:create]
  root to: 'home#index'
end
