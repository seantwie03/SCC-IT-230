kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: UID-Based Access Control
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercise: Configure an NFS Server
#   Give two users their own directories on one share and prove each reaches only their own
# Steps
#   1. On servera, create two groups and two users with explicit UIDs and GIDs
#   2. Create a directory for each group, owned by it, that only its members can enter
#   3. Export the parent directory to the subnet
#   4. On workstation, create the same groups and users with the same UIDs and GIDs
#   5. Mount the export on workstation
#   6. As each user, verify you can use your own directory but not the other
clear

#^ 1. On servera, create two groups and two users with explicit UIDs and GIDs
sudo -i
groupadd -g 1200 consultants
groupadd -g 1201 developers
useradd -u 1100 -g consultants con_john
useradd -u 1101 -g developers dev_jane
id con_john
id dev_jane
clear

#^ 2. Create a directory for each group, owned by it, that only its members can enter
mkdir -p /srv/teams/consultants /srv/teams/developers
touch /srv/teams/consultants/5_point_plan.md
touch /srv/teams/developers/lol_no_docs.md
chown -R con_john:consultants /srv/teams/consultants
chown -R dev_jane:developers /srv/teams/developers
chmod 770 /srv/teams/consultants /srv/teams/developers
#@ pause 5
ls -l /srv/teams
clear

#^ 3. Export the parent directory to the subnet
vim /etc/exports
#@ pause 5
#@ noenter
i/srv/teams  172.25.250.0/24(rw,sync)
#@ key escape
:wq
exportfs -r
exportfs -v
clear

#^ 4. On workstation, create the same groups and users with the same UIDs and GIDs
exit
exit
ssh workstation
sudo -i
groupadd -g 1200 consultants
groupadd -g 1201 developers
useradd -u 1100 -g consultants con_john
useradd -u 1101 -g developers dev_jane
id con_john
id dev_jane
clear

#^ 5. Mount the export on workstation
mkdir -p /nfs/teams
mount -t nfs -o rw,sync servera:/srv/teams /nfs/teams
#! root is squashed to nobody, so the two Permission denied lines are expected
#! The 770 directories keep nobody out; the listing still comes back
#@ pause 6
ls -l /nfs/teams
clear

#^ 6. As each user, verify you can use your own directory but not the other
su - con_john
echo "Consultant report" > /nfs/teams/consultants/report.txt
ls -l /nfs/teams/consultants
#! Permission denied: con_john is neither dev_jane nor in developers
ls /nfs/teams/developers
exit
su - dev_jane
echo "Developer notes" > /nfs/teams/developers/notes.txt
ls -l /nfs/teams/developers
ls /nfs/teams/consultants
exit

# Complete
