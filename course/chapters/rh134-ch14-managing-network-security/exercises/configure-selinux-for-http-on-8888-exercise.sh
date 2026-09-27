kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 8
#^ Exercise: Configure SELinux to Allow HTTP on 8888
# Requirements
#   Host: servera, from workstation
#   Prerequisite exercise: Configure Apache to Listen on 8888
#   Label port 8888 so httpd can bind to it
# Steps
#   1. Inspect the ports httpd may bind to
#   2. Label 8888 with http_port_t
#   3. Start httpd and request the page from workstation
#   4. Put servera back the way you found it
clear

#^ 1. Inspect the ports httpd may bind to
ssh student@servera
#@ pause 5
sudo semanage port -l | grep ^http
#@ pause 6
#! 8888 is on none of those lines, which is exactly what the denial said
clear

#^ 2. Label 8888 with http_port_t
sudo semanage port -a -t http_port_t -p tcp 8888
sudo semanage port -l | grep ^http
#@ pause 6
sudo semanage port -l -C
#! -C lists what this machine added and nothing else, which is one line
clear

#^ 3. Start httpd and request the page from workstation
sudo systemctl start httpd.service
systemctl is-active httpd.service
#@ pause 5
exit
#@ pause 4
curl http://servera:8888
#@ pause 6
#! Port open in the firewall, port labeled for SELinux, service listening. All three had to be true
clear

#^ 4. Put servera back the way you found it
ssh student@servera
#@ pause 5
sudo systemctl disable --now httpd.service
sudo semanage port -d -t http_port_t -p tcp 8888
sudo firewall-cmd --permanent --remove-port=8888/tcp
sudo firewall-cmd --permanent --remove-service=http
sudo firewall-cmd --reload
clear
sudo vim /etc/httpd/conf/httpd.conf
#@ pause 5
/^Listen 8888
#@ noenter
C
#@ pause 5
Listen 80
#@ key escape
:wq
#! Undo the edit before removing the package, so nothing is left behind in /etc/httpd
sudo dnf remove -y httpd setroubleshoot-server
#@ pause 10
sudo rm -f /var/www/html/index.html
#! servera ends the week the way it started

# Complete
