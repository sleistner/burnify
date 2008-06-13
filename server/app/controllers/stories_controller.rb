class StoriesController < ApplicationController

  acts_as_resource_controller :belongs_to => :iteration

end
