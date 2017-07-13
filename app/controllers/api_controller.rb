class APIController < ActionController::Base
  respond_to :json

  def handle_unverified_request
    # Do nothing. API requests don't need CSRF verification.
  end

  def render_errors(object)
    render json: {
      errors: {
        message: object.errors.full_messages.first
      }
    }, status: 400
  end

  def render_not_found
    render json: {
      errors: {
        message: 'Not found'
      }
    }, status: 404
  end
end
