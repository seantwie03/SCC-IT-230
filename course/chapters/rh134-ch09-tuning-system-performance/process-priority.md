---
layout: section
routeAlias: process-priority
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "09"
        title: Tuning System Performance
    rhcsaCertGuide:
      - chapter: "10"
        title: Managing Processes
  exercises:
    - title: Managing Nice Values Exercise
      source: ./exercises/managing-nice-values-exercise.html
---

# Process Priority

## Deciding what waits when the CPU is busy

---
vertical: center
---

# Not Every Task Is Urgent

Linux runs far more processes than it has CPUs, so the kernel is always choosing

- A nightly backup can afford to wait
- A user typing into a shell cannot

Priority is how you tell the kernel which is which

---

# Nice Values

Range from <AccentText>-20</AccentText> to <AccentText>19</AccentText>, default `0`

A **lower** number means **less nice** to other processes, so it gets more CPU

A higher number steps aside for everything else

<Callout type="warning">

Raising priority needs `root`. An ordinary user can only be nicer, never greedier, and even to their own processes.

</Callout>

---

# Reading Them

<TerminalWindow title="student@servera:~">

```bash-session {*}{lines:false}
student@servera:~$ ps -axo pid,comm,nice,pri --sort=nice
    PID COMMAND          NI PRI
      3 rcu_gp          -20  39
      5 slub_flushwq    -20  39
  16872 sleep             0  19
```

</TerminalWindow>

`NI` is the nice value you set, and `PRI` is the priority the kernel derived from it

`top` shows the same two columns and refreshes automatically

---

# Setting Them

<TerminalWindow title="student@servera:~">

```bash-session {*}{lines:false}
student@servera:~$ nice -n 15 sleep 300 &
student@servera:~$ ps -o pid,comm,nice -p 16890
    PID COMMAND          NI
  16890 sleep            15
student@servera:~$ sudo renice -n -10 16872
16872 (process ID) old priority 0, new priority -10
student@servera:~$ renice -n -5 16872
renice: failed to set priority for 16872 (process ID): Permission denied
```

</TerminalWindow>

`nice` starts a process with a value, `renice` changes one already running

---
layout: exercise
---

# Managing Nice Values

::goal::

Change a running process's priority in both directions and find the limit

::environment::

**Host:** `servera`

::workflow::

1. Start a long-running process in the background
2. Read its default nice value
3. Raise its priority, and notice what that required
4. Lower its priority again
5. Try to raise it without privileges and read the error
6. Stop the process

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/managing-nice-values-exercise.cast?url";
</script>

# Managing Nice Values

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor backgrounding a sleep process, reading the nice value it started with alongside the priority the kernel derived from it, using sudo to renice it to a lower number for more CPU, raising the number again without sudo, being refused when trying to lower it back as an ordinary user, and finishing with nice to set a value at launch rather than after the fact."
/>

::resources::

<a href="../resources/managing-nice-values-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Managing Nice Values exercise in a new tab">Written exercise</a>
