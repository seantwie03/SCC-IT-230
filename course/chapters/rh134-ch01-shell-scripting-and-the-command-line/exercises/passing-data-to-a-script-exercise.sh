kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Passing Data to a Script
# Requirements
#   Host: servera
#   Prerequisite exercise: Putting Scripts on the PATH
#   Script location: /home/student/scripts/shift_report.sh
#   The script records who worked a shift and which starship they commanded
# Steps
#   1. Create a new script from scratch and make it executable
#   2. Take the technician name as an argument
#   3. Read the starship name from stdin
#   4. Supply that input from a file instead of the keyboard
#   5. Add a value produced by another command
clear

#^ 1. Create a new script from scratch and make it executable
#! Same three steps as before: hashbang, content, chmod
cd ~/scripts
vim shift_report.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
#@ pause 5
#@ noenter
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
#@ noenter
echo "Shift report filed by $1"
#@ key escape
:wq
#! With no argument, $1 is empty and the line reads badly; worth seeing
./shift_report.sh
./shift_report.sh "Jean-Luc Picard"
clear

#^ 3. Read the starship name from stdin
vim shift_report.sh
#@ noenter
G
#@ noenter
o
echo "Which starship did you command?"
read -r starship_name
#@ pause 5
#@ noenter
echo "The $starship_name"
#@ key escape
:wq
#@ pause 5
cat shift_report.sh
./shift_report.sh "Jean-Luc Picard"
USS Enterprise
clear

#^ 4. Supply that input from a file instead of the keyboard
echo "USS Enterprise" > starship.txt
cat starship.txt
#! The script cannot tell the difference: it just reads a line from stdin
./shift_report.sh "Jean-Luc Picard" < starship.txt
clear

#^ 5. Add a value produced by another command
vim shift_report.sh
#@ noenter
G
#@ noenter
o
log_file=$(basename /var/log/audit/audit.log)
#@ pause 5
#@ noenter
echo "Recorded in $log_file"
#@ key escape
:wq
#! $( ) runs the command first, then substitutes its output
#@ pause 5
./shift_report.sh "Jean-Luc Picard" < starship.txt
clear

#^ Clean up
#! Nothing later uses this script or its input file
rm -f shift_report.sh starship.txt
cd ~

# Complete
