class ProjectsController < ApplicationController

  acts_as_resource_controller :order => 'name ASC'

  def new
    render :action => :new, :layout => false
  end

end
