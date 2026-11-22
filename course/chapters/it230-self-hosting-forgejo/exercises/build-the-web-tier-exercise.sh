kitten @ action --self change_font_size current 30 && ssh workstation
clear

#@ pause 10
#^ Exercise: Build the Web Tier
# Requirements
#   Hosts: workstation, servera
#   Prerequisite exercise: Build the App Tier
#   Serve Forgejo at http://git.lab.example.com through httpd on servera
# Steps
#   1. Name servera git.lab.example.com on workstation
#   2. Install httpd on servera and reverse proxy it to Forgejo
#   3. Start httpd and open the firewall for http
#   4. Use sealert to figure out why the reverse proxy fails
#   5. Let httpd connect to Forgejo and test from workstation
clear

#^ 1. Name servera git.lab.example.com on workstation
#! workstation finds servera through DNS; /etc/hosts adds a name of our own
sudo vim /etc/hosts
#@ noenter
G
#@ noenter
o
#@ pause 5
#@ noenter
172.25.250.10 git.lab.example.com
#@ key escape
:wq
#! The name resolves, and nothing answers on port 80 yet
curl git.lab.example.com
clear

#^ 2. Install httpd on servera and reverse proxy it to Forgejo
ssh servera
#@ pause 6
sudo dnf install -y httpd
#! These three lines come from Forgejo's documentation for Apache
sudo vim /etc/httpd/conf.d/forgejo.conf
#@ noenter
i
ProxyPreserveHost On
AllowEncodedSlashes NoDecode
#@ pause 5
#@ noenter
ProxyPass / http://127.0.0.1:3000/ nocanon
#@ key escape
:wq
clear

#^ 3. Start httpd and open the firewall for http
sudo systemctl enable --now httpd
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
#! 503: httpd is answering, but it cannot reach Forgejo
curl -s localhost | grep '<title>'
clear

#^ 4. Use sealert to figure out why the reverse proxy fails
#@ pause 6
sudo dnf install -y setroubleshoot-server
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#! httpd was denied name_connect to port 3000, and sealert names the boolean that allows it
#@ pause 8
/port 3000
#@ noenter
q
clear

#^ 5. Let httpd connect to Forgejo and test from workstation
#@ pause 6
sudo setsebool -P httpd_can_network_connect on
curl -s localhost | grep '<title>'
exit
curl -s git.lab.example.com | grep '<title>'
#! Open http://git.lab.example.com in Firefox on workstation, and log in as student with the password student

# Complete
