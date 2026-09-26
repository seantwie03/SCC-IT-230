kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
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
#@ pause 5
echo "Shift report filed"
#@ key escape
:wq
chmod a+x shift_report.sh
./shift_report.sh
clear

#^ 2. Take the technician name as an argument
vim shift_report.sh
/Shift report filed
#@ noenter
dd
#@ noenter
o
#@ pause 5
echo "Shift report filed by $1"
#@ key escape
:wq
#! With no argument $1 is empty and the line reads badly. That is worth seeing.
./shift_report.sh
./shift_report.sh "Jon Luc Picard"
clear

#^ 3. Read the starship name from standard input
vim shift_report.sh
#@ noenter
G
#@ noenter
o
echo "Which starship did you command?"
read -r system_name
#@ pause 5
echo "The $system_name"
#@ key escape
:wq
#@ pause 5
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
#@ noenter
G
#@ noenter
o
log_file=$(basename /var/log/audit/audit.log)
#@ pause 5
echo "Recorded in $log_file"
#@ key escape
:wq
#! $( ) runs the command first, then substitutes its output.
#@ pause 5
./shift_report.sh "Jon Luc Picard" < worked_system.txt
clear

#^ Clean up
rm -f shift_report.sh worked_system.txt
cd ~
