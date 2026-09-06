kitten @ set-font-size 30.0 && ssh servera
clear

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
#   4. Watch the file fill as you authenticate
#   5. Confirm higher priorities land in the same file
#   6. Clean up
clear

#^ 1. Add a rule for authpriv.info
sudo -i
#! Drop-in files in /etc/rsyslog.d are read alongside /etc/rsyslog.conf
vim /etc/rsyslog.d/authpriv-info.conf
iauthpriv.info /var/log/authpriv-info
jj:wq
cat /etc/rsyslog.d/authpriv-info.conf
clear

#^ 2. Restart rsyslog
#! rsyslog reads its configuration at startup, so a new rule needs a restart
systemctl restart rsyslog
systemctl is-active rsyslog
ls -l /var/log/authpriv-info
clear

#^ 3. Send a test message
logger -p authpriv.info "Houston, we have a problem."
cat /var/log/authpriv-info
clear

#^ 4. Watch the file fill as you authenticate
#! authpriv.info catches every login and sudo, not only your own messages
less /var/log/authpriv-info
G
q
#! Open a second window and ssh in, then look again
tail -n5 /var/log/authpriv-info
clear

#^ 5. Confirm higher priorities land in the same file
#! A rule naming info catches everything more severe than info
logger -p authpriv.alert "Houston, we have an alert!"
logger -p authpriv.emerg "Houston, we have an EMERGENCY!"
tail -n2 /var/log/authpriv-info
clear

#^ 6. Clean up
rm -f /etc/rsyslog.d/authpriv-info.conf /var/log/authpriv-info
systemctl restart rsyslog
ls /etc/rsyslog.d/
