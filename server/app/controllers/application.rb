# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time

  rescue_from ActiveRecord::RecordInvalid,  :with => :render_invalid_record
  rescue_from ActiveRecord::RecordNotFound, :with => :render_record_not_found
  before_filter :authenticate
  
  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  # protect_from_forgery # :secret => 'ada3775ac9022d57789fc84b249bb686'
  
  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password").
  # filter_parameter_logging :password

  private
  
  def authenticate
    # authenticate_or_request_with_http_basic do |user, password|
    #   user == 'wunderloop' && password == 'oxymoron!'
    # end
  end
  
  def render_invalid_record exception
    record = exception.record
    respond_to do |format|
      format.json { render :json => record.errors.full_messages, :status => :unprocessable_entity }
      format.js   { render :json => record.errors.full_messages, :status => :unprocessable_entity, :content_type => 'application/json' }
      format.xml  { render :xml => record.errors.full_messages,  :status => :unprocessable_entity }
    end
  end

  def render_record_not_found exception
    respond_to do |format|
      format.json { render :json => exception.to_s, :status => :unprocessable_entity }
      format.js   { render :json => exception.to_s, :status => :unprocessable_entity, :content_type => 'application/json' }
      format.xml  { render :xml  => "<error>#{exception}</error>", :status => :unprocessable_entity }
    end
  end
end
