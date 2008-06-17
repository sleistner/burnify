class ProjectsController < ApplicationController

  acts_as_resource_controller :order => 'name ASC'

end
