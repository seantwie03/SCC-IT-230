kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Configure an Indirect Map
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercise: Configure a Direct Map
#   Mount each subdirectory of a share on demand with one map entry
# Steps
#   1. On servera, create /srv/regions with east and west subdirectories and export it
#   2. Reload the exports and verify with showmount --exports
#   3. On workstation, add a master map entry for /nfs/regions
#   4. Create the indirect map file with a wildcard entry
#   5. Restart the autofs service
#   6. Verify /nfs/regions is empty before accessing any subdirectory
#   7. Access east and verify only it is mounted
#   8. Access west and verify both are mounted
clear

#^ 1. On servera, create /srv/regions with east and west subdirectories and export it
sudo -i
mkdir -p /srv/regions/east /srv/regions/west
echo "East region: 412 orders" > /srv/regions/east/orders.txt
echo "West region: 388 orders" > /srv/regions/west/orders.txt
chown -R student:student /srv/regions
#! Export only the parent; the client can mount its subdirectories
vim /etc/exports
#@ pause 5
#@ noenter
i/srv/regions  172.25.250.0/24(rw,sync)
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

#^ 3. On workstation, add a master map entry for /nfs/regions
sudo -i
vim /etc/auto.master.d/regions.autofs
#@ pause 5
#@ noenter
i/nfs/regions  /etc/auto.regions
#@ key escape
:wq
cat /etc/auto.master.d/regions.autofs
clear

#^ 4. Create the indirect map file with a wildcard entry
#! * matches whatever name is accessed under /nfs/regions, and & repeats it
vim /etc/auto.regions
#@ pause 5
#@ noenter
i*  -rw,sync  servera:/srv/regions/&
#@ key escape
:wq
cat /etc/auto.regions
clear

#^ 5. Restart the autofs service
systemctl restart autofs
clear

#^ 6. Verify /nfs/regions is empty before accessing any subdirectory
#! The trigger for /nfs/regions, and nothing mounted under it
#@ pause 5
mount | grep /nfs/regions
#! No output: autofs lists a name only once it is mounted
ls /nfs/regions
clear

#^ 7. Access east and verify only it is mounted
exit
cat /nfs/regions/east/orders.txt
ls /nfs/regions
#@ pause 6
mount | grep /nfs/regions
clear

#^ 8. Access west and verify both are mounted
cat /nfs/regions/west/orders.txt
ls /nfs/regions
#@ pause 6
mount | grep /nfs/regions
clear

#^ Clean up
#! Nothing later uses this map or export; autofs stays for the last exercise
sudo -i
#! root's rm is an alias for rm -i, which asks before each delete; -f skips the questions
rm -f /etc/auto.master.d/regions.autofs /etc/auto.regions
systemctl restart autofs
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
rm -rf /srv/regions

# Complete
