kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Manage Shell Expansion with Quoting
# Requirements
#   Host: servera
# Tasks
#   1. Print a literal asterisk (*)
#   2. Assing a value to a variable
#   3. Use single and double quotes
#   4. Include spaces in arguments
clear

#^ 1. Print a literal asterisk (*)
cd /tmp
echo *
echo '*'
echo "*"
echo \*
clear

#^ 2. Assign a value to a variable
linux=awesome
echo See the value with: $linux
clear

#^ 3. Use single and double quotes
echo "Double quotes allow variable expansion: $linux"
echo 'Single quotes treat everything literally: $linux'
clear

#^ 4. Include spaces in arguments
mkdir My Files
ls -l
clear
mkdir 'Linux Files'
ls -l
mkdir This\ Is\ One\ Argument
ls -l
clear

#^ Clean up
rmdir My Files 'Linux Files' 'This Is One Argument'
unset linux
