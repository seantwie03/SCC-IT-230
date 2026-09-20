kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Allow Apache to Send Email
# Requirements
#   Host: servera
#   Allow Apache to send email
# Steps
#   1. Find the appropriate SELinux boolean
#   2. View the current value of the boolean
#   3. Permanently set the boolean to allow Apache to send mail
#   4. Verify the boolean is set
#   5. Clean up
clear

#^ 1. Find the appropriate SELinux boolean
#! selinux-policy-doc installs a man page for each SELinux domain
#@ pause 6
sudo dnf install selinux-policy-doc -y
clear
man -k _selinux | grep httpd
man 8 httpd_selinux
#@ pause 6
/mail
#@ noenter
q
clear

#^ 2. View the current value of the boolean
getsebool httpd_can_sendmail
#@ pause 5
sudo semanage boolean -l | grep httpd_can_sendmail
clear

#^ 3. Permanently set the boolean to allow Apache to send mail
#@ pause 6
sudo setsebool -P httpd_can_sendmail on
clear

#^ 4. Verify the boolean is set
getsebool httpd_can_sendmail
#@ pause 5
sudo semanage boolean -l | grep httpd_can_sendmail
clear

#^ 5. Clean up
sudo setsebool -P httpd_can_sendmail off
#@ pause 6
sudo dnf remove -y selinux-policy-doc
