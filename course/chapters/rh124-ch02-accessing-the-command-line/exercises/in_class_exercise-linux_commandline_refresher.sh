kitten @ set-font-size 30.0 && ssh servera
clear
#^ In-Class Exercise: Linux Commandline Refresher

#^ Create a file using redirection
echo "Space... The final frontier." > /home/student/tng-monologue.txt
cat /home/student/tng-monologue.txt
echo "These are the voyages of the starship Enterprise." >> /home/student/tng-monologue.txt
cat /home/student/tng-monologue.txt
echo "Its continuing mission, to explore strange new worlds." >> /home/student/tng-monologue.txt
echo "To seek out new life and new civilizations." >> /home/student/tng-monologue.txt
echo "To boldly go where no one has gone before." >> /home/student/tng-monologue.txt
cat /home/student/tng-monologue.txt
clear

#^ Use wc to understand how many lines are in the file
man wc
/lines
q
wc -l /home/student/tng-monologue.txt

#^ Use grep to find all lines with the word 'new'
grep new /home/student/tng-monologue.txt

#^ Use grep and wc together to get a count of all lines with the word 'new'
grep new /home/student/tng-monologue.txt | wc -l
