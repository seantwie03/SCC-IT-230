kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Activating a Tuning Profile
# Requirements
#   Host: servera
#   Target profile: network-latency
# Tasks
#   1. Install tuned and start it
#   2. Find the active profile
#   3. Read what network-latency changes
#   4. Activate it
#   5. Verify it took effect
#   6. Put the original profile back
clear

#^ 1. Install tuned and start it
sudo dnf install -y tuned
sudo systemctl enable --now tuned
systemctl is-active tuned
clear

#^ 2. Find the active profile
#! virtual-guest, because the lab machines are virtual machines
tuned-adm active
clear

#^ 3. Read what network-latency changes
tuned-adm list
clear
cat /usr/lib/tuned/profiles/network-latency/tuned.conf
#! It includes latency-performance and adds network-specific sysctl settings
clear

#^ 4. Activate it
sudo tuned-adm profile network-latency
tuned-adm active
clear

#^ 5. Verify it took effect
tuned-adm verify
sudo tail -n5 /var/log/tuned/tuned.log
clear

#^ 6. Put the original profile back
sudo tuned-adm profile virtual-guest
tuned-adm active
sudo systemctl disable --now tuned
sudo dnf remove -y tuned
