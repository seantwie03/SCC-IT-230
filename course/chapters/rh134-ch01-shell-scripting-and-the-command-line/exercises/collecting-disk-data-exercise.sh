kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Collecting Disk Data
# Requirements
#   Hosts: servera and workstation
#   Script location: /home/student/scripts/collect_disk_data.sh
#   The script must accept any number of host names as arguments
#   Run lsblk and df -h on each host
#   Store the output in /tmp/disk-data/{HOST}-disk-data.txt
# Steps
#   1. Create a basic script file and run it with bash
#   2. Make it executable and run it with ./
#   3. Loop over a fixed list of hosts and confirm the loop runs once per host
#   4. Get the disk commands working on one host, then move them into the loop
#   5. Replace the fixed list with "$@" so the caller chooses the hosts
#   6. Verify the collected files
clear

#^ 1. Create a basic script file and run it with bash
mkdir -p ~/scripts
cd ~/scripts
vim collect_disk_data.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
#@ pause 5
#@ noenter
echo "Starting $0"
#@ key escape
:wq
bash collect_disk_data.sh
clear

#^ 2. Make it executable and run it with ./
chmod a+x collect_disk_data.sh
./collect_disk_data.sh
clear

#^ 3. Loop over a fixed list of hosts and confirm the loop runs once per host
vim collect_disk_data.sh
/Starting \$0
#@ noenter
o
for host in workstation servera; do
    echo $host
#@ pause 5
#@ noenter
done
#@ key escape
:wq
./collect_disk_data.sh
clear

#^ 4. Get the disk commands working on one host, then move them into the loop
#! Get one host working by hand before putting it in the loop
mkdir -p /tmp/disk-data
ssh student@servera lsblk > /tmp/disk-data/servera-disk-data.txt
ssh student@servera df -h >> /tmp/disk-data/servera-disk-data.txt
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/servera-disk-data.txt
clear
vim collect_disk_data.sh
/echo \$host
A > /tmp/disk-data/$host-disk-data.txt
    ssh student@$host lsblk >> /tmp/disk-data/$host-disk-data.txt
#@ pause 5
#@ noenter
    ssh student@$host df -h >> /tmp/disk-data/$host-disk-data.txt
#@ key escape
:wq
clear
#@ pause 10
./collect_disk_data.sh
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/workstation-disk-data.txt
clear

#^ 5. Replace the fixed list with "$@" so the caller chooses the hosts
#! The host list is hard coded; "$@" lets the caller choose
vim collect_disk_data.sh
/for host in
#! w three times to move forward three words
#@ noenter
#@ pause 3
www
#! Change up to the ;
#@ noenter
ct;
#@ pause 5
#@ noenter
"$@"
#@ key escape
:wq
#@ pause 5
cat collect_disk_data.sh
rm -f /tmp/disk-data/*
#@ pause 10
./collect_disk_data.sh workstation servera
clear

#^ 6. Verify the collected files
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/servera-disk-data.txt
clear

#^ Clean up
#! Nothing later uses the collected files or the script
rm -rf /tmp/disk-data
\rm ~/scripts/collect_disk_data.sh

# Complete
