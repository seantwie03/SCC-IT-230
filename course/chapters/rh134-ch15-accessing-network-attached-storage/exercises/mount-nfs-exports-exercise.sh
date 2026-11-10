kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Mount NFS Exports
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercise: Configure an NFS Server
#   Mount servera's export on workstation by hand, then at every boot
# Steps
#   1. On workstation, install nfs-utils
#   2. Verify servera's export is visible with showmount --exports
#   3. Mount it on /nfs/reports and confirm student can write a file
#   4. Unmount the export
#   5. Add the export to /etc/fstab with rw,sync,nofail options
#   6. Mount it from /etc/fstab and verify it is mounted
#   7. Reboot workstation and confirm the export mounts automatically
clear

#^ 1. On workstation, install nfs-utils
sudo -i
#@ pause 6
dnf install -y nfs-utils
clear

#^ 2. Verify servera's export is visible with showmount --exports
showmount --exports servera
clear

#^ 3. Mount it on /nfs/reports and confirm student can write a file
mkdir -p /nfs/reports
mount -t nfs -o rw,sync servera:/srv/reports /nfs/reports
#@ pause 5
mount | grep /nfs/reports
#! root is squashed to nobody on servera, so write the file as student
exit
echo "Q3 totals are ready" > /nfs/reports/q3-summary.txt
ls -l /nfs/reports
sudo -i
clear

#^ 4. Unmount the export
umount /nfs/reports
#! No output: the share is no longer mounted
mount | grep /nfs/reports
clear

#^ 5. Add the export to /etc/fstab with rw,sync,nofail options
vim /etc/fstab
#@ noenter
G
#@ pause 5
#@ noenter
oservera:/srv/reports  /nfs/reports  nfs  rw,sync,nofail  0 0
#@ key escape
:wq
tail -1 /etc/fstab
clear

#^ 6. Mount it from /etc/fstab and verify it is mounted
systemctl daemon-reload
mount /nfs/reports
#@ pause 5
mount | grep /nfs/reports
ls -l /nfs/reports
clear

#^ 7. Reboot workstation and confirm the export mounts automatically
#! The SSH session ends; wait for workstation to finish booting before reconnecting
#@ pause 25
systemctl reboot
ssh workstation
#@ pause 5
mount | grep /nfs/reports
cat /nfs/reports/q3-summary.txt
clear

#^ Clean up
#! Nothing later uses this mount or the export from the last exercise
sudo -i
umount /nfs/reports
vim /etc/fstab
/reports
#@ pause 3
#@ noenter
dd
:wq
tail -1 /etc/fstab
systemctl daemon-reload
rmdir /nfs/reports
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
#! No output: nothing is exported now; nfs-server keeps running for the next exercises
exportfs -v
#! root's rm is an alias for rm -i, which asks before each delete; -f skips the questions
rm -rf /srv/reports

# Complete
