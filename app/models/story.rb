# == Schema Information
# Schema version: 20080611171750
#
# Table name: stories
#
#  id              :integer(11)     not null, primary key
#  name            :string(255)     
#  description     :text            
#  iteration_id    :integer(11)     
#  estimated_hours :integer(11)     
#  created_at      :datetime        
#  updated_at      :datetime        
#  start           :date            
#  deadline        :date            
#

class Story < ActiveRecord::Base
end
