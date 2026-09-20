kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Configure a New DocumentRoot for Apache
# Requirements
#   Host: workstation
#   Prerequisite: Set Up a Basic Web Server
#   Configure Apache to serve content from the /web directory
# Steps
#   1. Make a /web directory with an HTML file
#   2. Configure Apache to serve /web
#   3. Test and troubleshoot: switch SELinux to permissive temporarily
#   4. Troubleshoot: use sealert
#   5. Configure a policy to set httpd_sys_content_t on /web(/.*)? files
#   6. Apply the policy to the files
#   7. Verify the results
#   8. Clean up
clear

#^ 1. Make a /web directory with an HTML file
sudo mkdir /web
sudo vim /web/index.html
#@ noenter
i<h1>Welcome to /web</h1>
#@ pause 5
#@ key escape
:wq
ls -lZ /web/
#! default_t: no policy rule matches /web
clear

#^ 2. Configure Apache to serve /web
#! Keep a copy of the original for the cleanup step
sudo cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.orig
sudo vim /etc/httpd/conf/httpd.conf
/^DocumentRoot
#! f" jumps to the first quote, and ci" changes the text inside the quotes
#@ noenter
f"ci"
#@ noenter
/web
#@ key escape
/^<Directory "\/var\/www\/html">
#@ noenter
f"ci"
#@ noenter
/web
#@ pause 5
#@ key escape
:wq
sudo systemctl restart httpd.service
#@ pause 5
systemctl status httpd.service --no-pager
clear

#^ 3. Test and troubleshoot: switch SELinux to permissive temporarily
#! Expect the Apache test page: SELinux blocks /web, so Apache answers with its welcome page
#@ pause 5
curl http://localhost/
sudo setenforce 0
curl http://localhost/
sudo setenforce 1
clear

#^ 4. Troubleshoot: use sealert
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#@ pause 6
/web/index.html
#@ noenter
q
clear

#^ 5. Configure a policy to set httpd_sys_content_t on /web(/.*)? files
sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'
sudo semanage fcontext -l -C
clear

#^ 6. Apply the policy to the files
sudo restorecon -Rv /web
ls -lZ /web/
clear

#^ 7. Verify the results
getenforce
curl http://localhost/
clear

#^ 8. Clean up
sudo mv /etc/httpd/conf/httpd.conf.orig /etc/httpd/conf/httpd.conf
sudo systemctl restart httpd.service
sudo semanage fcontext -d '/web(/.*)?'
sudo rm -rf /web
curl http://localhost/
