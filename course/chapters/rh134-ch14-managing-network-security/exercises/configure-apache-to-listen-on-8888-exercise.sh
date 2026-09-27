kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 8
#^ Exercise: Configure Apache to Listen on 8888
# Requirements
#   Host: servera, from workstation
#   Prerequisite exercise: Allow HTTP Traffic
#   Move the web server to port 8888 and find out what stops it
# Steps
#   1. Allow 8888/tcp in the firewall
#   2. Point Apache's Listen line at 8888
#   3. Restart httpd and watch it fail
#   4. Confirm SELinux is the cause
#   5. Read what sealert recommends
clear

#^ 1. Allow 8888/tcp in the firewall
ssh student@servera
#@ pause 5
sudo firewall-cmd --add-port=8888/tcp --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
#@ pause 6
#! The port is open before anything listens on it. An open port with no service behind it still answers nothing
clear

#^ 2. Point Apache's Listen line at 8888
sudo vim /etc/httpd/conf/httpd.conf
#@ pause 5
/^Listen 80
#@ noenter
C
#@ pause 5
Listen 8888
#@ key escape
:wq
grep ^Listen /etc/httpd/conf/httpd.conf
clear

#^ 3. Restart httpd and watch it fail
sudo systemctl restart httpd.service
#@ pause 5
systemctl status httpd.service --no-pager
#@ pause 6
#! Permission denied binding 0.0.0.0:8888. The firewall is open and nothing else holds the port
clear

#^ 4. Confirm SELinux is the cause
sudo setenforce 0
sudo systemctl restart httpd.service
systemctl is-active httpd.service
#@ pause 5
#! It starts the moment SELinux stops enforcing, which names the culprit
sudo systemctl stop httpd.service
sudo setenforce 1
#! Permissive mode is a diagnostic, not a fix, so put it back before going on
clear

#^ 5. Read what sealert recommends
#@ pause 6
sudo dnf install -y setroubleshoot-server
clear
sudo systemctl restart httpd.service
#@ pause 5
sudo grep 'sealert -l' /var/log/messages | tail -n 1
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#@ pause 6
/port 8888
#@ noenter
q
#! "Then you need to modify the port type", and http_port_t is one of the choices. That is the next exercise

# Complete
