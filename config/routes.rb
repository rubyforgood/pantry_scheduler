Rails.application.routes.draw do
  namespace :api do
    resource :session
    resources :appointments do
      collection do
        get :today
      end
    end
  end

  root to: 'home#index'
  get '*all' => 'home#index'
end
