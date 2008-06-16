module Chartify

  def chart_data
    returning Hash.new do |hash|
      hash[:estimated_hours] = estimated_hours
      working_days.each { |day| (hash[:days] ||= []) << { :day => day.strftime('%d.%m'), :left => hours_left_on(day) } }
    end
  end
  
end