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
#

class Story < ActiveRecord::Base
  belongs_to :iteration
  has_many :story_histories
  
  # named_scope :hours_left
  
  # TODO: fetch the story_history data for the given day or return nil if no story_history exists
  def hours_left_on day
    rand 100
  end
end
