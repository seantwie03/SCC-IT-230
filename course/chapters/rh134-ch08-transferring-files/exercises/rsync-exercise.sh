kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Synchronize servera's Log Directory into /tmp
# Requirements
#   Local host: workstation
#   Remote host: servera
# Tasks
#   1. Install rsync on both machines
#   2. Preview and run the first synchronization
#   3. Generate changes and synchronize again
#   4. Verify the changes and clean up
clear

#^ 1. Install rsync on both machines
sudo dnf install -y rsync
ssh student@servera
sudo dnf install -y rsync
exit
clear

#^ 2. Preview and run the first synchronization
rsync -avn root@servera:/var/log /tmp
ls -l /tmp
clear
rsync -av root@servera:/var/log /tmp
ls -l /tmp
clear

#^ 3. Generate changes and synchronize again
#    SSHing into a server generates log message for audit purposes
ssh root@servera
exit
clear
rsync -av root@servera:/var/log /tmp
clear

#^ 4. Verify the changes and clean up
tail -n1 /tmp/log/audit/audit.log
sudo rm -rf /tmp/log
ls /tmp
