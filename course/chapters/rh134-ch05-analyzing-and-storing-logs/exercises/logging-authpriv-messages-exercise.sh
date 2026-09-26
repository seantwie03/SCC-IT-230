kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Logging authpriv.info Messages
# Requirements
#   Host: servera
#   Facility: authpriv
#   Priority: info
#   Log location: /var/log/authpriv-info
# Tasks
#   1. Add a rule for authpriv.info
#   2. Restart rsyslog
#   3. Send a test message
#   4. Confirm higher priorities land in the same file
#   5. Clean up
clear

#^ 1. Add a rule for authpriv.info
sudo -i
#! Drop-in files in /etc/rsyslog.d are read alongside /etc/rsyslog.conf
vim /etc/rsyslog.d/authpriv-info.conf
#@ pause 5
#@ noenter
iauthpriv.info /var/log/authpriv-info
#@ key escape
:wq
cat /etc/rsyslog.d/authpriv-info.conf
clear

#^ 2. Restart rsyslog
#! rsyslog reads its configuration at startup, so a new rule needs a restart
systemctl restart rsyslog
#@ pause 5
systemctl status rsyslog --no-pager
clear

#^ 3. Send a test message
logger -p authpriv.info "Houston, we have a problem."
cat /var/log/authpriv-info
clear

#^ 4. Confirm higher priorities land in the same file
#! A rule naming info catches everything more severe than info
logger -p authpriv.alert "Houston, we have an alert!"
logger -p authpriv.emerg "Houston, we have an EMERGENCY!"
#@ pause 5
tail -n3 /var/log/authpriv-info
clear

#^ 5. Clean up
rm -f /etc/rsyslog.d/authpriv-info.conf /var/log/authpriv-info
systemctl restart rsyslog
#@ pause 5
ls /etc/rsyslog.d/
