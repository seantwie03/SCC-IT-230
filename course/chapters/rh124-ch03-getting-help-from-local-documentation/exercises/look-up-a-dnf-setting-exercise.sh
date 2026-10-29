kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Look Up a DNF Setting
# Requirements
#   Host: servera
#   Find out what installonly_limit in the DNF configuration means
# Steps
#   1. Search the manual for the DNF configuration page
#   2. Open the page and find the file it documents
#   3. Search the page for installonly_limit
#   4. Compare the documented default with the file
clear

#^ 1. Search the manual for the DNF configuration page
#! -k searches every page's name and description. (5) is the file-format section.
#@ pause 5
man -k "dnf configuration"
clear

#^ 2. Open the page and find the file it documents
#! DESCRIPTION names the global configuration file: /etc/dnf/dnf.conf
#@ pause 6
man dnf.conf
#! Space scrolls forward one screen, b scrolls back
#@ key space
#@ key space
#@ noenter
b
#@ noenter
q
clear

#^ 3. Search the page for installonly_limit
man dnf.conf
#! The first match only mentions the option
#@ pause 6
/installonly_limit
#! n jumps to the next match: the definition, with its default of 3
#@ pause 6
#@ noenter
n
#@ noenter
q
clear

#^ 4. Compare the documented default with the file
#! The file sets installonly_limit=3, the same as the default
#@ pause 5
cat /etc/dnf/dnf.conf

# Complete
