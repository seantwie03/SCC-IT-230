kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Configure a New DocumentRoot for Apache on servera
# Requirements
#   Host: servera
#   Configure Apache to serve content from the /website directory
# Steps
#   1. Install httpd and start its service
#   2. Make a /website directory with an HTML file
#   3. Configure Apache to serve /website
#   4. Test and troubleshoot: switch SELinux to permissive temporarily
#   5. Troubleshoot: use sealert
#   6. Configure a policy to set httpd_sys_content_t on /website(/.*)? files
#   7. Apply the policy to the files
#   8. Verify the results
#   9. Clean up
clear

#^ 1. Install httpd and start its service
#! servera has no web server yet
#@ pause 6
sudo dnf install -y httpd
clear
sudo systemctl enable --now httpd.service
systemctl is-active httpd.service
clear

#^ 2. Make a /website directory with an HTML file
sudo mkdir /website
sudo vim /website/index.html
#@ noenter
i<h1>Welcome to /website</h1>
#@ pause 5
#@ key escape
:wq
ls -lZ /website/
clear

#^ 3. Configure Apache to serve /website
sudo cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.orig
sudo vim /etc/httpd/conf/httpd.conf
/^DocumentRoot
#@ noenter
f"ci"
#@ noenter
/website
#@ key escape
/^<Directory "\/var\/www\/html">
#@ noenter
f"ci"
#@ noenter
/website
#@ pause 5
#@ key escape
:wq
sudo systemctl restart httpd.service
#@ pause 5
systemctl status httpd.service --no-pager
clear

#^ 4. Test and troubleshoot: switch SELinux to permissive temporarily
#! Expect the Apache test page: SELinux blocks /website
#@ pause 5
curl http://localhost/
clear
sudo setenforce 0
curl http://localhost/
sudo setenforce 1
clear

#^ 5. Troubleshoot: use sealert
#! servera does not have setroubleshoot-server yet
#@ pause 6
sudo dnf install -y setroubleshoot-server
clear
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#@ pause 6
/website/index.html
#@ noenter
q
clear

#^ 6. Configure a policy to set httpd_sys_content_t on /website(/.*)? files
sudo semanage fcontext -a -t httpd_sys_content_t '/website(/.*)?'
sudo semanage fcontext -l -C
clear

#^ 7. Apply the policy to the files
sudo restorecon -Rv /website
ls -lZ /website/
clear

#^ 8. Verify the results
getenforce
curl http://localhost/
clear

#^ 9. Clean up
sudo mv /etc/httpd/conf/httpd.conf.orig /etc/httpd/conf/httpd.conf
sudo semanage fcontext -d '/website(/.*)?'
sudo rm -rf /website
sudo systemctl disable --now httpd.service
#@ pause 6
sudo dnf remove -y httpd setroubleshoot-server
