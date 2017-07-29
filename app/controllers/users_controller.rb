class UsersController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.create(params["user"])
    user.send_reset_password_instructions_notification

    head :ok
  end

  def update
    user = User.find_by(email: params.fetch("user").fetch("email"))
    if user.update(user_params)
      head :ok
    end
  end

  private
  
  def user_params
    params.require(:user).permit(:password)
  end
end
