kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Passing Data to a Script
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/shift_report.sh
#   The script records who worked a shift and which system they touched
# Tasks
#   1. Create a new script from scratch and make it executable
#   2. Take the technician name as an argument
#   3. Read the starship name from standard input
#   4. Supply that input from a file instead of the keyboard
#   5. Add a value produced by another command
clear

#^ 1. Create a new script from scratch and make it executable
#! Same three steps as before: hashbang, content, chmod.
cd ~/scripts
vim shift_report.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
echo "Shift report filed"
jj:wq
chmod a+x shift_report.sh
./shift_report.sh
clear

#^ 2. Take the technician name as an argument
vim shift_report.sh
/Shift report filed
dd
o
echo "Shift report filed by $1"
jj:wq
#! With no argument $1 is empty and the line reads badly. That is worth seeing.
./shift_report.sh
./shift_report.sh "Jon Luc Picard"
clear

#^ 3. Read the starship name from standard input
vim shift_report.sh
G
o
echo "Which starship did you command?"
read -r system_name
echo "The $system_name"
jj:wq
cat shift_report.sh
./shift_report.sh "Jon Luc Picard"
USS Enterprise
clear

#^ 4. Supply that input from a file instead of the keyboard
echo "USS Enterprise" > worked_system.txt
cat worked_system.txt
#! The script cannot tell the difference. It just reads a line from stdin.
./shift_report.sh "Jon Luc Picard" < worked_system.txt
clear

#^ 5. Add a value produced by another command
vim shift_report.sh
G
o
log_file=$(basename /var/log/audit/audit.log)
echo "Recorded in $log_file"
jj:wq
#! $( ) runs the command first, then substitutes its output.
./shift_report.sh "Jon Luc Picard" < worked_system.txt
clear

#^ Clean up
rm -f shift_report.sh worked_system.txt
cd ~
