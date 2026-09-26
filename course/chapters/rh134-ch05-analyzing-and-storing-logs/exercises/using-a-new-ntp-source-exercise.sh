kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Using a New NTP Source
# Requirements
#   Host: servera
#   New time source: time.google.com
# Tasks
#   1. Confirm chrony is installed and running
#   2. Read the current sources
#   3. Replace the pool
#   4. Restart chronyd
#   5. Confirm the new source is selected
#   6. Put the original back
clear

#^ 1. Confirm chrony is installed and running
rpm -q chrony
systemctl is-enabled chronyd
systemctl is-active chronyd
#@ pause 5
timedatectl
clear

#^ 2. Read the current sources
#! ^* marks the source in use, ^+ acceptable, ^- excluded
#@ pause 6
chronyc sources -v
clear

#^ 3. Replace the pool
sudo cp /etc/chrony.conf /etc/chrony.conf.orig
sudo vim /etc/chrony.conf
/^pool
#@ pause 5
#@ noenter
Cpool time.google.com iburst
#@ key escape
:wq
#@ pause 5
head -3 /etc/chrony.conf
clear

#^ 4. Restart chronyd
#@ pause 10
sudo systemctl restart chronyd
#@ pause 5
systemctl status chronyd --no-pager
clear

#^ 5. Confirm the new source is selected
#! iburst makes the first sync fast, but give it a few seconds
#@ pause 6
chronyc sources -v
#@ pause 5
timedatectl
clear

#^ 6. Put the original back
sudo mv /etc/chrony.conf.orig /etc/chrony.conf
#@ pause 10
sudo systemctl restart chronyd
#@ pause 5
chronyc sources -v
