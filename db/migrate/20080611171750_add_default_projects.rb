class AddDefaultProjects < ActiveRecord::Migration
  def self.up
    with_projects { |name| Project.create! :name => name }
  end

  def self.down
    with_projects { |name| Project.find_by_name(name).destroy }
  end
  
  def self.with_projects
    %w{Custom Connect}.each { |name| yield name }
  end
end
