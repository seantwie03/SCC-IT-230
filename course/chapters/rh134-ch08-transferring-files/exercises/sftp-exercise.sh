kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Download /etc/group From servera With sftp
# Requirements
#   Local host: workstation
#   Local directory: /home/student/Downloads
#   Remote host: servera
#   Remote directory: /etc
# Tasks
#   1. Open an interactive transfer session
#   2. Point the local side at Downloads
#   3. Point the remote side at /etc
#   4. Download the group file
#   5. Verify from inside the session
#   6. Leave and read the file
#   7. Clean up
clear

mkdir -p /home/student/Downloads
clear

#^ 1. Open an interactive transfer session
sftp student@servera
#! The sftp> prompt has replaced the shell prompt. Bash is not running here.

#^ 2. Point the local side at Downloads
#! Commands prefixed with l act on the LOCAL host.
lpwd
lcd /home/student/Downloads
lpwd

#^ 3. Point the remote side at /etc
#! Commands with no prefix act on the REMOTE host.
cd /etc
pwd

#^ 4. Download the group file
ls group
get group

#^ 5. Verify from inside the session
lls

#^ 6. Leave and read the file
bye
ls -l /home/student/Downloads
cat /home/student/Downloads/group
clear

#^ 7. Clean up
rm /home/student/Downloads/group
clear
