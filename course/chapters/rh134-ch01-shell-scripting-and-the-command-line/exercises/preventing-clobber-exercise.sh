kitten @ action --self change_font_size current 30 && ssh workstation
ssh servera
clear

#@ pause 8
#^ Exercise: Preventing Clobber
# Requirements
#   Hosts: workstation, then servera
#   Protect an existing file from being overwritten, in this shell and in every shell
# Steps
#   1. Create a file holding data you care about
#   2. Enable noclobber and attempt to overwrite the file with >
#   3. Add to the file with >>, then overwrite it deliberately with >|
#   4. Confirm the option is off again in a new session
#   5. Persist noclobber in ~/.bashrc and confirm it applies at next login
clear

#^ 1. Create a file holding data you care about
cd ~
echo "quarterly revenue: 4200" > finance_report.txt
cat finance_report.txt
clear

#^ 2. Enable noclobber and attempt to overwrite the file with >
#@ pause 5
set -o
set -o noclobber
#! The accident noclobber exists to prevent
#@ pause 5
echo "oops, wrong file" > finance_report.txt
echo $?
cat finance_report.txt
clear

#^ 3. Add to the file with >>, then overwrite it deliberately with >|
#! Appending is never destructive, so noclobber allows it
echo "quarterly expenses: 3100" >> finance_report.txt
cat finance_report.txt
#! >| says "I really do mean overwrite": a seatbelt, not a lock
echo "superseded by the audited figures" >| finance_report.txt
cat finance_report.txt
clear

#^ 4. Confirm the option is off again in a new session
#! Log out of servera and log back in
exit
ssh servera
set -o | grep noclobber
clear

#^ 5. Persist noclobber in ~/.bashrc and confirm it applies at next login
vim ~/.bashrc
#@ noenter
Gzz
#@ noenter
o
#@ pause 5
#@ noenter
set -o noclobber
#@ key escape
:wq
exit
ssh servera
set -o | grep noclobber
echo "test" > finance_report.txt
clear

#^ Clean up
#! The backslash skips the rm -i alias from the aliases exercise
\rm finance_report.txt

# Complete
