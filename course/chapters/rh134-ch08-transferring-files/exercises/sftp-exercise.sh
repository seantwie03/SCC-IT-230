kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Download /etc/group from servera with sftp
# Requirements
#   Local host: workstation
#   Remote host: servera
# Tasks
#   1. Open a transfer session and inspect both sides
#   2. Navigate the local and remote filesystems
#   3. Download and verify the group file
#   4. Leave the session and clean up
clear

#^ 1. Open a transfer session and inspect both sides
sftp student@servera
lpwd
pwd

#^ 2. Navigate the local and remote filesystems
lcd /home/student/Downloads
lpwd
cd /etc
pwd

#^ 3. Download and verify the group file
ls group
get group
lls

#^ 4. Leave the session and clean up
bye
ls -l /home/student/Downloads
cat /home/student/Downloads/group
rm /home/student/Downloads/group
