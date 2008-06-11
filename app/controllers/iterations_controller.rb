class IterationsController < ApplicationController
  
  def create
    Iteration.create! params[:iteration]
    head :ok
  end
  
end
