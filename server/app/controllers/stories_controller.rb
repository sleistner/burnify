class StoriesController < ApplicationController

  acts_as_resource_controller :belongs_to => :iteration

  layout false

  def working_days
    render_formats Story.find(params[:id]).chart_data
  end

  def set_hours_left
    Story.find(params[:id]).set_hours_left(params[:day], params[:hours_left])
    head :ok
  end

end
