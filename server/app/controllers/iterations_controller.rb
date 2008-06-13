class IterationsController < ApplicationController

  acts_as_resource_controller :belongs_to => :project

end
