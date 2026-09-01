kitten @ set-font-size 30.0 && ssh workstation
ssh servera
clear

#^ Exercise: Preventing Clobber
# Requirements
#   Hosts: workstation, then servera
# Tasks
#   1. Create a file holding data you care about
#   2. Enable noclobber and try to overwrite it
#   3. Append with >> and overwrite deliberately with >|
#   4. Confirm the option is off again in a new shell
#   5. Persist noclobber in ~/.bashrc
clear

#^ 1. Create a file holding data you care about
cd ~
echo "quarterly revenue: 4200" > finance_report.txt
cat finance_report.txt
clear

#^ 2. Enable noclobber and try to overwrite it
set -o
set -o noclobber
#! This is the accident noclobber exists to prevent.
echo "oops, wrong file" > finance_report.txt
echo $?
cat finance_report.txt
clear

#^ 3. Append with >> and overwrite deliberately with >|
#! Appending is never destructive, so noclobber allows it.
echo "quarterly expenses: 3100" >> finance_report.txt
cat finance_report.txt
#! >| says "I really do mean overwrite". A seatbelt, not a lock.
echo "superseded by the audited figures" >| finance_report.txt
cat finance_report.txt
clear

#^ 4. Confirm the option is off again in a new session
#! Log out of servera and log back in.
exit
ssh servera
set -o | grep noclobber
clear

#^ 5. Persist noclobber in ~/.bashrc
vim ~/.bashrc
Gzz
o
set -o noclobber
jj:wq
exit
ssh servera
set -o | grep noclobber
echo "test" > finance_report.txt
clear

#^ Clean up
rm finance_report.txt
