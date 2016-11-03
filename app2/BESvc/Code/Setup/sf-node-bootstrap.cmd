

ECHO OFF

PowerShell.exe -ExecutionPolicy Bypass -File 0-choco-install.ps1

SET PATH=%PATH%;C:\ProgramData\chocolatey\bin;

PowerShell.exe -ExecutionPolicy Bypass -File 1-node-install.ps1

refreshenv

ECHO ON