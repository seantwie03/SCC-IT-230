kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 8
#^ Exercise: Move an Interface to Another Zone
# Requirements
#   Host: servera, from workstation
#   Move servera's interface into dmz, notice the impacts to what is allowed
# Steps
#   1. List the zones
#   2. Inspect what the active zone allows
#   3. Move enp1s0 into dmz
#   4. Confirm the interface moved and the service list is shorter
#   5. Reload the firewall
#   6. Look again
clear

#^ 1. Find your interface, then list the zones
ssh student@servera
#@ pause 5
nmcli device status
#! enp1s0 here. On the SCC lab it is enp0s8, on the RHA lab it is ens3
#! Use the name your own machine reports, not the one on this recording
sudo firewall-cmd --get-zones
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --get-default-zone
#! enp1s0 is in public because public is the default, not because anyone put it there
clear

#^ 2. Inspect what the active zone allows
sudo firewall-cmd --list-all
#@ pause 8
#! Three services: cockpit, dhcpv6-client, and ssh
clear

#^ 3. Move enp1s0 into dmz
sudo firewall-cmd --zone=dmz --change-interface=enp1s0
#@ pause 5
clear

#^ 4. Confirm the interface moved and the service list is shorter
sudo firewall-cmd --get-active-zones
#@ pause 5
sudo firewall-cmd --list-all --zone=dmz
#@ pause 8
#! dmz allows ssh alone, which is why this session survived the move
clear

#^ 5. Reload the firewall
sudo firewall-cmd --reload
#@ pause 4
clear

#^ 6. Look again
sudo firewall-cmd --get-active-zones
#@ pause 5
sudo firewall-cmd --list-all
#@ pause 8
#! The move is gone. enp1s0 is back in public and every service is back
#! Nobody undid it, so where did the change go? That is the next section

# Complete
