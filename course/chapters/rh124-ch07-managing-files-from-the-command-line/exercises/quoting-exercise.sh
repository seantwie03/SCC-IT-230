kitten @ set-font-size 30.0 && ssh servera
clear

#^ Watch Bash expand an unquoted asterisk
#! echo never receives a *. Bash replaces it with the file names before echo runs.
echo *
#! Single quotes stop the shell from changing our text.
echo '*'
#! Double quotes also suppress globbing
echo "*"
#! A backslash escapes the special meaning of exactly one character.
echo \*
clear

#^ Assign a variable
#! This is how you assign a value in Bash. No spaces around the equals sign.
linux=awesome
echo To print the value, prefix the variable name with a dollar sign: $linux
clear

#^ Single quotes versus double quotes
echo "Double quotes allow variable expansion: $linux"
echo 'Single quotes do not. They treat everything literally: $linux'
echo 'Single quotes are best when another program must receive the pattern'
clear

#^ Escape inside double quotes
#! The backslash still works inside double quotes.
echo "This prints the dollar sign even though it is in double quotes: \$linux"
clear

#^ Spaces separate arguments
#! Commands split their arguments on spaces. This creates TWO directories.
mkdir My Files
ls -l
clear
#! Quote the whole name to group the words into ONE argument.
mkdir 'My Files'
ls -l
#! Escaping each space does the same thing.
mkdir This\ Is\ One\ Argument
ls -l
clear

#^ Clean up
rmdir My Files 'My Files' 'This Is One Argument'
rm filea.txt fileb.md filec.sh
ls -l
clear
