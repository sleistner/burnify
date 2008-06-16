# == Schema Information
# Schema version: 20080616190553
#
# Table name: projects
#
#  id         :integer(11)     not null, primary key
#  name       :string(255)     
#  created_at :datetime        
#  updated_at :datetime        
#

class Project < ActiveRecord::Base

  has_many :iterations

  validates_presence_of :name
  validates_uniqueness_of :name

end
