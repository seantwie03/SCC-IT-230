kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Explore Files with ls Options
# Requirements
#   Host: servera
#   Use options and arguments to change what ls reports
# Steps
#   1. Reveal the hidden files in your home directory
#   2. List the files in /var/log by size, largest first
#   3. List the files in /var/log by time, newest last
clear

#^ 1. Reveal the hidden files in your home directory
#! total 0 and no files: everything here begins with a dot, so ls hides it
ls -l
#! -l and -a combined into one group of short options
#@ pause 5
ls -la
#! --all is the long form of -a, so the output is the same
#@ pause 5
ls -l --all
clear

#^ 2. List the files in /var/log by size, largest first
#! /var/log is the argument. --sort takes an argument of its own: size
#@ pause 5
ls -l --sort=size /var/log
clear

#^ 3. List the files in /var/log by time, newest last
#! The equal sign is optional: --sort time is the same as --sort=time
#@ pause 5
ls -l --sort time /var/log
#! --reverse puts the newest file at the bottom, right above the prompt
#@ pause 5
ls -l --sort time --reverse /var/log

# Complete
