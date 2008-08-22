module Chartify

  def init_chart_data
    returning Hash.new do |h|
      h[:type]            = self.class.name
      h[:title]           = name
      #h[:estimated_hours] = estimated_hours
      h[:start_at]        = start_at
      h[:deadline]        = deadline
      h[:color]           = color
      h[:id]              = id
      yield(h)
    end
  end

  def working_days
    events = Icalendar.parse(Calendar.find_by_name('Berlin').ics).first.events.map {|ev| ev.dtstart }
    (start_at.to_datetime..deadline.to_datetime).reject {|day| events.include?(day) || [0, 6].include?(day.wday) }
  end

  def working_date_of_days
    working_days.map {|day| date_of_day(day) }
  end

  def date_of_day(day)
    day.strftime('%Y-%m-%d')
  end
end
