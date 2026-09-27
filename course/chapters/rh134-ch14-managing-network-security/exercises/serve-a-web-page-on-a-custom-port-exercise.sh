kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Serve a Web Page on a Custom Port
# Requirements
#   Host: workstation, from servera
#   Serve a page from workstation on port 8484 and reach it from servera
# Steps
#   1. Install httpd and write a page
#   2. Point Apache's Listen line at 8484
#   3. Open 8484/tcp in the firewall
#   4. Label 8484 for SELinux
#   5. Start httpd
#   6. Request the page from servera
#   7. Put workstation back the way you found it
clear

#^ 1. Install httpd and write a page
ssh student@workstation
#@ pause 6
sudo dnf install -y httpd
echo "<h1>Served from workstation</h1>" | sudo tee /var/www/html/index.html
clear

#^ 2. Point Apache's Listen line at 8484
sudo vim /etc/httpd/conf/httpd.conf
#@ pause 5
/^Listen 80
#@ noenter
CListen 8484
#@ pause 5
#@ key escape
:wq
grep ^Listen /etc/httpd/conf/httpd.conf
clear

#^ 3. Open 8484/tcp in the firewall
sudo firewall-cmd --add-port=8484/tcp --permanent
sudo firewall-cmd --reload
#@ pause 5
sudo firewall-cmd --list-all
#! The port is open, but nothing listens on it yet
clear

#^ 4. Label 8484 for SELinux
#@ pause 5
sudo semanage port -l | grep ^http
#! 8484 is on none of those lines, so httpd would be denied the port
sudo semanage port -a -t http_port_t -p tcp 8484
sudo semanage port -l -C
clear

#^ 5. Start httpd
sudo systemctl enable --now httpd.service
systemctl is-active httpd.service
#! No failure, no sealert, no permissive mode. Each piece was in place before the start
clear

#^ 6. Request the page from servera
exit
#@ pause 6
curl http://workstation:8484
#! Listen line, firewall port, SELinux label. The same three pieces from every exercise this week, in one pass
clear

#^ 7. Put workstation back the way you found it
ssh student@workstation
sudo systemctl disable --now httpd.service
sudo semanage port -d -t http_port_t -p tcp 8484
sudo firewall-cmd --permanent --remove-port=8484/tcp
sudo firewall-cmd --reload
clear
sudo vim /etc/httpd/conf/httpd.conf
#@ pause 5
/^Listen 8484
#@ noenter
CListen 80
#@ pause 5
#@ key escape
:wq
#! Undo the edit and delete the page before removing the package, so nothing is left behind in /etc/httpd or /var/www
sudo rm -f /var/www/html/index.html
#@ pause 10
sudo dnf remove -y httpd
#! workstation ends the week the way it started

# Complete
