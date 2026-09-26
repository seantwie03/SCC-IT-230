kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 17
#^ Exercise: Finding Recently Modified Logs
# Requirements
#   Host: servera
#   Record which files under /var/log change while you are away from the console
#   The search runs once, two minutes from now
#   Save the results to /tmp/log_audit
# Tasks
#   1. Install at and start atd
#   2. Build the search
#   3. Schedule it two minutes from now
#   4. Inspect the pending job
#   5. Confirm the job ran
#   6. Clean up
clear

#^ 1. Install at and start atd
#@ pause 10
sudo dnf install -y at
clear
#! Installing the package enables atd at boot, but does not start it now
systemctl is-active atd
sudo systemctl start atd
systemctl is-active atd
clear

#^ 2. Build the search
#! logger writes a line to /var/log/messages, so the search has something recent to find
logger "IT-230 log audit"
#@ pause 5
find /var/log -mmin -2
#! student cannot read every directory under /var/log, so those errors are expected
clear
#@ pause 5
find /var/log -mmin -2 2>/dev/null
clear

#^ 3. Schedule it two minutes from now
#! A deferred job has no terminal, so its results have to go to a file
ls /tmp/log_audit
#@ pause 5
echo "find /var/log -mmin -2 > /tmp/log_audit 2>/dev/null" | at now +2min
clear

#^ 4. Inspect the pending job
atq
#! Adjust the job number to match your own atq output
#@ pause 5
at -c 1
clear

#@ pause 130
#^ 5. Confirm the job ran
#! Wait until the scheduled time has passed before continuing
#@ pause 5
sudo less /var/log/cron
#@ pause 6
#@ noenter
G
#@ noenter
q
ls -l /tmp/log_audit
#@ pause 5
cat /tmp/log_audit
clear

#^ 6. Clean up
atq
#! A job still listed here would be removed with atrm JOBNUMBER
rm /tmp/log_audit
