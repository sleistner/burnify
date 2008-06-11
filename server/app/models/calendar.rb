# == Schema Information
# Schema version: 20080611171750
#
# Table name: calendars
#
#  id         :integer(11)     not null, primary key
#  name       :string(255)     
#  ics        :text            
#  created_at :datetime        
#  updated_at :datetime        
#

class Calendar < ActiveRecord::Base
end
