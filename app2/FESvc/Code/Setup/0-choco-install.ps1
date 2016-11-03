

choco -v
if($?)
{
    Write-Host "+++ choco is already installed"
}
else
{
    Write-Host "+++ choco is not installed, installing"
    iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex
}