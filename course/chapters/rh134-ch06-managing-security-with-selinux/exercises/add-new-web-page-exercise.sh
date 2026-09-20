kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Add New Web Page
# Requirements
#   Host: workstation
#   Prerequisite: Set Up a Basic Web Server
#   The developer wants you to add about.html to the web site
#   Simulated: the developer put the file in /tmp/about.html
# Steps
#   0. Simulate the developer handing over the file
#   1. Move /tmp/about.html to /var/www/html/
#   2. Attempt to access http://localhost/about.html
#   3. Troubleshoot: switch SELinux to permissive temporarily
#   4. Troubleshoot: view /var/log/audit/audit.log
#   5. Troubleshoot: use sealert
clear

#^ 0. Simulate the developer handing over the file
vim /tmp/about.html
#@ noenter
i<h1>About Us</h1>
#@ pause 5
#@ key escape
:wq
ls -lZ /tmp/about.html
clear

#^ 1. Move /tmp/about.html to /var/www/html/
#! mv keeps the label from /tmp: user_tmp_t, not httpd_sys_content_t
sudo mv /tmp/about.html /var/www/html/
ls -lZ /var/www/html/

#^ 2. Attempt to access http://localhost/about.html
#! Expect 403 Forbidden: SELinux blocks httpd_t from opening a user_tmp_t file
#@ pause 5
curl http://localhost/about.html
clear

#^ 3. Troubleshoot: switch SELinux to permissive temporarily
sudo setenforce 0
getenforce
curl http://localhost/about.html
#! The page loads, so SELinux is the cause. Switch back to enforcing right away.
sudo setenforce 1
getenforce
clear

#^ 4. Troubleshoot: view /var/log/audit/audit.log
#! The log is dense. Look for type=AVC records that name about.html.
sudo less /var/log/audit/audit.log
#@ pause 6
/about.html
#@ noenter
q
clear

#^ 5. Troubleshoot: use sealert
#! workstation already has setroubleshoot-server, so dnf has nothing to do
sudo dnf install setroubleshoot-server -y
clear
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#@ noenter
q
#! Leave about.html in place. The next exercise fixes its label.
