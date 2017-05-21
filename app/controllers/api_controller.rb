class APIController < ActionController::Base
  respond_to :json

  def handle_unverified_request
    # Do nothing. API requests don't need CSRF verification.
  end
end
