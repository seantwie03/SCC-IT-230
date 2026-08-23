kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Synchronize servera's Log Directory Into /tmp
#!   Local:  workstation, /tmp
#!   Remote: servera, /var/log

#^ 1. Install rsync on both machines
#! rsync must be present on BOTH ends. It is not in a minimal installation.
sudo dnf install -y rsync
clear
ssh student@servera
sudo dnf install -y rsync
exit
clear

#^ 2. Preview the transfer with -n
#! -n is a dry run. It reports what would move and changes nothing. Build this habit.
rsync -avn root@servera:/var/log /tmp
clear

#^ 3. Run it for real
#! The first pass copies everything, exactly like scp would.
rsync -av root@servera:/var/log /tmp
clear

#^ 4. Make servera write some new log entries
ssh root@servera
logger -t rsync-exercise "Generating a new log entry for the transfer exercise"
logger -t rsync-exercise "And one more"
tail -n 2 /var/log/messages
exit
clear

#^ 5. Synchronize a second time
#! Read the byte counts. Only the changed files crossed the network this time.
rsync -av root@servera:/var/log /tmp
clear

#^ 6. Verify the new entries arrived locally
grep 'rsync-exercise' /tmp/log/messages
clear

#^ 7. Clean up
sudo rm -rf /tmp/log
ls /tmp
clear
