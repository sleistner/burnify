class ReformatDefautCalendar < ActiveRecord::Migration
  def self.up
    Calendar.destroy_all
    Calendar.create! :name => 'Berlin', :ics => File.read(File.join(RAILS_ROOT, 'config', 'berlin.ics'))
  end

  def self.down
  end
end
