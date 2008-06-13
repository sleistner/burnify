ActionController::Routing::Routes.draw do |map|

  map.root :controller => 'dashboard'

  map.resources :projects, :has_many => :iterations
  map.resources :iterations, :member => { :chart_data => :get }, :has_many => :stories

  # Install the default routes as the lowest priority.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
