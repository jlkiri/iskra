# logo

command := repeat '(' motion ')' | motion
repeat := 'repeat' INT
motion := rotate | move
rotate := ('right' | 'left') INT
move := 'forward' INT
