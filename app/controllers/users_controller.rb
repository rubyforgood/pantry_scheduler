class UsersController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.create(params["user"])
    user.send_reset_password_instructions_notification

    head :ok
  end
end
