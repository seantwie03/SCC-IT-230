---
layout: section
routeAlias: bash-prompt
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "02"
        title: Accessing the Command Line
    rhcsaCertGuide:
      - chapter: "02"
        title: Using Essential Tools
---

# Bash Prompt

---
layout: center
---

# The Bash Prompt is...

## text displayed by the shell before you type a command

## `student@workstation:~$`

---
layout: center
---

# Bash Prompt

<CommandExplainer
  command="student@workstation:/etc$ ls -l"
  :steps="[
    { active: 'student', explanation: 'The user you are logged in as' },
    { active: 'workstation', explanation: 'The host you are logged into' },
    { active: '/etc', explanation: 'Your current working directory' },
    { active: '$', explanation: 'Indicates a non-root user' },
    { active: 'ls -l', explanation: 'The command you typed' },
  ]"
/>

---
---

# Bash Prompt

<TerminalWindow title=student@workstation:/etc>

```bash-session
student@workstation:/etc$ ls -l
```

</TerminalWindow>

| Part          | Meaning                        |
|---------------|--------------------------------|
| `student`     | The user you are logged in as  |
| `workstation` | The host you are logged into   |
| `/etc`        | Your current working directory |
| `$`           | Indicates a non-root user      |
| `ls -l`       | The command you typed          |
