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
    resources :clients do
      resources :notes, only: [:update, :create], memoable_type: "Client"
    end
    resources :appointments do
      resources :notes, only: [:update, :create, :destroy], memoable_type: "Appointment"
    end
  end

  root to: 'home#index'
  get '*all' => 'home#index'
end
