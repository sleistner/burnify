class GotoController < ApplicationController

  def index
    memo = {}
    %w(project iteration story).each do |model|
      unless (name = params[model]).nil?
        memo[model] = model.camelize.constantize.find_by_name(name.gsub(/-/, '.'), :select => 'id').id
      end
    end
    flash[:replay] = { :goto => memo }.to_json

  rescue => e
    flash[:replay] = { :flash => e.to_s }.to_json

  ensure
    redirect_to root_path
  end
end
