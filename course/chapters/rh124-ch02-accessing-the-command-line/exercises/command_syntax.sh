kitten @ set-font-size 30.0 && ssh servera
clear
#^ Task: Demonstrate Commandline Syntax

#^ Print the current Working Directory (pwd)
pwd

#^ Inspect the current Working Directory
ls
#! Notice no files are shown. There are files here but they begin with a '.' By default, ls will not show these "Hidden" files
ls -a
clear

#^ Use Short Options
ls -a -l
#! Short options can be combined
ls -al
clear

#^ Use Long Options
#! Most short options have an equivalent long option
ls --all # same as -a

#^ Use Long and Short Options together
ls -l --all
ls --all -l
clear

#^ List the files in /etc by passing an argument
ls /etc
clear

#^ Use cd to change to the /var/log directory
cd /var/log
#! Notice the prompt changed

#^ List the items in /var/log
ls -l

#^ Use a Long Option that takes an argument
#! What is that time? By default it is the modified time, but there is an option for that!
ls -l --time=creation
clear

#^ Sort ls output by creation time, most newly created files at the top
ls -l --time=creation --sort=time
clear

#^ Sort ls output by creation time reversed
ls -l --time=creation --sort=time --reverse
clear

#^ The equal-sign between the option and its argument is optional
ls -lh --sort size
clear

#^ Short options can have arguments too
ls -w10
ls -w 10

#^ Notice the equal-sign doesn't work with sort options
ls -w=10
