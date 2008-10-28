ActionController::Routing::Routes.draw do |map|

  map.root :controller => 'dashboard'

  map.with_options :controller => 'goto' do |goto|
    goto.connect 'goto/:project'
    goto.connect 'goto/:project/:iteration'
    goto.connect 'goto/:project/:iteration/:story'
  end

  map.resources :projects,   :has_many => :iterations
  map.resources :iterations, :member => { :chart_data => :get }, :has_many => :stories
  map.resources :stories,    :member => { :working_days => :get, :set_hours_left => :post }

  # Install the default routes as the lowest priority.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
