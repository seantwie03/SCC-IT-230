kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Rotating a Log File by Size
# Requirements
#   Host: servera
#   Log file: /var/log/demo.log
#   Rotate when: the file grows past 1k
#   Compress: yes
#   Keep: 2 old copies
# Tasks
#   1. Write the logrotate configuration
#   2. Fill the file past the threshold
#   3. Rotate it by hand
#   4. Fill and rotate again
#   5. Confirm the oldest copy is discarded
#   6. Clean up
clear

#^ 1. Write the logrotate configuration
sudo -i
vim /etc/logrotate.d/demo
i/var/log/demo.log {
    size 1k
    rotate 2
    compress
    missingok
#@ pause 5
#@ noenter
}
#@ key escape
:wq
#@ pause 5
cat /etc/logrotate.d/demo
clear

#^ 2. Fill the file past the threshold
for i in {1..100}; do echo "Log entry line $i" >> /var/log/demo.log; done
#@ pause 5
ls -lh /var/log/demo.log
clear

#^ 3. Rotate it by hand
#! --force rotates now instead of waiting for logrotate.timer
logrotate --force /etc/logrotate.d/demo
#@ pause 5
ls -lh /var/log/demo.log*
clear

#^ 4. Fill and rotate again
for i in {1..100}; do echo "Log entry line $i" >> /var/log/demo.log; done
logrotate --force /etc/logrotate.d/demo
#@ pause 5
ls -lh /var/log/demo.log*
clear

#^ 5. Confirm the oldest copy is discarded
#! rotate 2 means two old copies, so the third rotation drops the first
for i in {1..100}; do echo "Log entry line $i" >> /var/log/demo.log; done
logrotate --force /etc/logrotate.d/demo
#@ pause 5
ls -lh /var/log/demo.log*
clear

#^ 6. Clean up
rm -f /etc/logrotate.d/demo /var/log/demo.log*
