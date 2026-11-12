kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Configure a Direct Map
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercise: Mount NFS Exports
#   Have workstation mount a share at a fixed path the first time it is used
# Steps
#   1. On servera, create /srv/manuals and export it
#   2. Reload the exports and verify with showmount --exports
#   3. On workstation, install autofs
#   4. Create the master map file in /etc/auto.master.d/
#   5. Create the direct map for /nfs/manuals
#   6. Enable and start the autofs service
#   7. Verify the share is not mounted, then access the mount point
#   8. Verify the share is now mounted
clear

#^ 1. On servera, create /srv/manuals and export it
sudo -i
mkdir /srv/manuals
echo "Hold the power button for ten seconds" > /srv/manuals/printer-reset.txt
chown -R student:student /srv/manuals
vim /etc/exports
#@ pause 5
#@ noenter
i/srv/manuals  172.25.250.0/24(rw,sync)
#@ key escape
:wq
cat /etc/exports
clear

#^ 2. Reload the exports and verify with showmount --exports
exportfs -r
exportfs -v
exit
exit
ssh workstation
showmount --exports servera
clear

#^ 3. On workstation, install autofs
sudo -i
#@ pause 6
dnf install -y autofs
clear

#^ 4. Create the master map file in /etc/auto.master.d/
#! /- marks a direct map: the map file holds full paths
vim /etc/auto.master.d/direct.autofs
#@ pause 5
#@ noenter
i/-  /etc/auto.direct
#@ key escape
:wq
cat /etc/auto.master.d/direct.autofs
clear

#^ 5. Create the direct map for /nfs/manuals
vim /etc/auto.direct
#@ pause 5
#@ noenter
i/nfs/manuals  -rw,sync  servera:/srv/manuals
#@ key escape
:wq
cat /etc/auto.direct
clear

#^ 6. Enable and start the autofs service
systemctl enable autofs --now
clear

#^ 7. Verify the share is not mounted, then access the mount point
#! Only the autofs trigger: nothing from servera yet
#@ pause 5
mount | grep /nfs/manuals
#! Any user can trigger the mount, so access it as student
exit
ls /nfs/manuals
cat /nfs/manuals/printer-reset.txt
clear

#^ 8. Verify the share is now mounted
#! The autofs trigger and, below it, the nfs4 mount from servera
#@ pause 6
mount | grep /nfs/manuals
clear

#^ Clean up
#! Nothing later uses this map or export; autofs stays for the next exercise
sudo -i
#! root's rm is an alias for rm -i, which asks before each delete; -f skips the questions
rm -f /etc/auto.master.d/direct.autofs /etc/auto.direct
systemctl restart autofs
#! No output: the trigger and the mount are gone
mount | grep /nfs/manuals
exit
exit
ssh servera
sudo -i
vim /etc/exports
#@ pause 3
#@ noenter
dd
:wq
exportfs -r
rm -rf /srv/manuals

# Complete
