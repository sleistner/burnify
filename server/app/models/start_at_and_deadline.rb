module StartAtAndDeadline

  def start_at= t
    write_attribute :start_at, parse_time(t)
  end
  
  def deadline= t
    write_attribute :deadline, parse_time(t)
  end
  
  private

    def parse_time t
      t.is_a?(String) ? Chronic.parse(t) : t
    end
end