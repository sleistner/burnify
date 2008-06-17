class IterationsController < ApplicationController

  acts_as_resource_controller :belongs_to => :project, :order => 'created_at DESC'

  def chart_data
    render_formats Iteration.find(params[:id]).chart_data
  end

end
