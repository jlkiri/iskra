# logo

command := repeat '(' motion ')' | motion
repeat := 'repeat' literal
motion := 'right' | 'left' | 'forward' literal
literal := INT
