# == Schema Information
# Schema version: 20080611171750
#
# Table name: projects
#
#  id         :integer(11)     not null, primary key
#  name       :string(255)     
#  created_at :datetime        
#  updated_at :datetime        
#

class Project < ActiveRecord::Base
end
