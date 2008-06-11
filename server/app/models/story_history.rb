# == Schema Information
# Schema version: 20080611171750
#
# Table name: story_histories
#
#  id         :integer(11)     not null, primary key
#  hours_left :integer(11)     
#  story_id   :integer(11)     
#  created_at :datetime        
#  updated_at :datetime        
#

class StoryHistory < ActiveRecord::Base
end
