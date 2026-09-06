kitten @ set-font-size 30.0 && ssh servera
clear

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
timedatectl
clear

#^ 2. Read the current sources
#! ^* marks the source in use, ^+ acceptable, ^- excluded
chronyc sources -v
clear

#^ 3. Replace the pool
sudo cp /etc/chrony.conf /etc/chrony.conf.orig
sudo vim /etc/chrony.conf
/^pool
ccpool time.google.com iburst
jj:wq
head -3 /etc/chrony.conf
clear

#^ 4. Restart chronyd
sudo systemctl restart chronyd
systemctl is-active chronyd
clear

#^ 5. Confirm the new source is selected
#! iburst makes the first sync fast, but give it a few seconds
chronyc sources -v
timedatectl
clear

#^ 6. Put the original back
sudo mv /etc/chrony.conf.orig /etc/chrony.conf
sudo systemctl restart chronyd
chronyc sources -v
