module Chartify

  def chart_data
    returning Hash.new do |h|
      h[:type]            = self.class.name
      h[:title]           = name
      h[:estimated_hours] = estimated_hours
      h[:start_at]        = start_at
      h[:deadline]        = deadline
      h[:color]           = color
      h[:id]              = id
      working_days.each do |day| 
        (h[:days] ||= []) << { :day => day.strftime('%Y-%m-%d'), :hours_left => hours_left_on(day) }
      end
    end
  end

  def working_days
    events = Icalendar.parse(Calendar.find_by_name('Berlin').ics).first.events.map {|ev| ev.dtstart }
    (start_at.to_datetime..deadline.to_datetime).reject {|day| events.include?(day) || [0, 6].include?(day.wday) }
  end

end
