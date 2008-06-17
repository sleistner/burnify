module Chartify

  def chart_data
    returning Hash.new do |hash|
      hash[:type] = self.class.name
      hash[:title] = name
      hash[:estimated_hours] = estimated_hours
      hash[:start_at] = start_at
      hash[:deadline] = deadline
      hash[:color] = color
      hash[:id] = id
      working_days.each { |day| (hash[:days] ||= []) << { :day => day.strftime('%Y/%m/%d'), :hours_left => hours_left_on(day) } }
    end
  end

  def working_days
    events = Icalendar.parse(Calendar.find_by_name('Berlin').ics).first.events.map { |event| event.dtstart }
    (start_at.to_datetime..deadline.to_datetime).reject { |day| events.include?(day) || [0, 6].include?(day.wday) }
  end

end