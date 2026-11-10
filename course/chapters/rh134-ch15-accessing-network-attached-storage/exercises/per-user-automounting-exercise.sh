kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Per-User Automounting
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercises: Configure an Indirect Map, UID-Based Access Control
#   Give each user an automounted directory of their own from one map entry
# Steps
#   1. On servera, create /srv/usershares with a directory for each user
#   2. Export the parent directory to the subnet
#   3. On workstation, confirm con_john and dev_jane match their servera UIDs and GIDs
#   4. Configure a wildcard indirect map for /nfs/usershares
#   5. Restart autofs
#   6. As each user, verify your own directory mounts on access
#   7. Verify neither user can use the other's directory
clear

#^ 1. On servera, create /srv/usershares with a directory for each user
sudo -i
mkdir -p /srv/usershares/con_john /srv/usershares/dev_jane
echo "con_john's files" > /srv/usershares/con_john/readme.txt
echo "dev_jane's files" > /srv/usershares/dev_jane/readme.txt
chown -R con_john:consultants /srv/usershares/con_john
chown -R dev_jane:developers /srv/usershares/dev_jane
chmod 770 /srv/usershares/con_john /srv/usershares/dev_jane
#@ pause 5
ls -l /srv/usershares
clear

#^ 2. Export the parent directory to the subnet
vim /etc/exports
#@ pause 5
#@ noenter
i/srv/usershares  172.25.250.0/24(rw,sync)
#@ key escape
:wq
exportfs -r
exportfs -v
clear

#^ 3. On workstation, confirm con_john and dev_jane match their servera UIDs and GIDs
id con_john
id dev_jane
exit
exit
ssh workstation
showmount --exports servera
#! Same numbers as on servera, from the UID-Based Access Control exercise
id con_john
id dev_jane
clear

#^ 4. Configure a wildcard indirect map for /nfs/usershares
sudo -i
vim /etc/auto.master.d/usershares.autofs
#@ pause 5
#@ noenter
i/nfs/usershares  /etc/auto.usershares
#@ key escape
:wq
cat /etc/auto.master.d/usershares.autofs
#! One entry covers every user: * is the name accessed, and & repeats it
vim /etc/auto.usershares
#@ pause 5
#@ noenter
i*  -rw,sync  servera:/srv/usershares/&
#@ key escape
:wq
cat /etc/auto.usershares
clear

#^ 5. Restart autofs
systemctl restart autofs
#! Only the trigger for /nfs/usershares so far
mount | grep /nfs/usershares
clear

#^ 6. As each user, verify your own directory mounts on access
su - con_john
cat /nfs/usershares/con_john/readme.txt
exit
su - dev_jane
cat /nfs/usershares/dev_jane/readme.txt
exit
#! One wildcard entry, two separate mounts
#@ pause 6
mount | grep /nfs/usershares
clear

#^ 7. Verify neither user can use the other's directory
#! The mount succeeds for anyone; the server's permissions decide the rest
su - con_john
cat /nfs/usershares/dev_jane/readme.txt
exit
su - dev_jane
cat /nfs/usershares/con_john/readme.txt
exit
clear

#^ Clean up
#! Return both hosts to the start of the week
#! root's rm is an alias for rm -i, which asks before each delete; -f skips the questions
rm -f /etc/auto.master.d/usershares.autofs /etc/auto.usershares
systemctl disable autofs --now
userdel -r con_john
userdel -r dev_jane
groupdel consultants
groupdel developers
#@ pause 6
dnf remove -y autofs nfs-utils
rmdir /nfs
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
rm -rf /srv/usershares
userdel -r con_john
userdel -r dev_jane
groupdel consultants
groupdel developers
systemctl disable nfs-server --now
firewall-cmd --remove-service=nfs --remove-service=rpc-bind --remove-service=mountd
firewall-cmd --runtime-to-permanent
#@ pause 6
dnf remove -y nfs-utils

# Complete
