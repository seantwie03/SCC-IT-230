kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Managing Nice Values
# Requirements
#   Host: servera
#   Change a running process's priority in both directions
# Tasks
#   1. Start a long-running process
#   2. Read its default nice value
#   3. Raise its priority
#   4. Lower its priority
#   5. Try to raise it without privileges
#   6. Clean up
clear

#^ 1. Start a long-running process
sleep infinity &
pgrep -a sleep
clear

#^ 2. Read its default nice value
#! NI is the nice value, PRI is the priority the kernel derived from it
ps -o pid,comm,nice,pri -p $(pgrep -n sleep)
clear

#^ 3. Raise its priority
#! Lower nice means less nice to everything else, so it gets more CPU
sudo renice -n -10 $(pgrep -n sleep)
ps -o pid,comm,nice,pri -p $(pgrep -n sleep)
clear

#^ 4. Lower its priority
renice -n 5 $(pgrep -n sleep)
ps -o pid,comm,nice,pri -p $(pgrep -n sleep)
#! That one needed no sudo, because raising the number is always allowed
clear

#^ 5. Try to raise it without privileges
renice -n -5 $(pgrep -n sleep)
#! Permission denied. Only root may make a process greedier, even your own.
clear

#^ 6. Clean up
#! nice sets the value at launch, renice changes it afterward
nice -n 15 sleep 60 &
ps -o pid,comm,nice -p $(pgrep -n sleep)
pkill sleep
pgrep -a sleep
