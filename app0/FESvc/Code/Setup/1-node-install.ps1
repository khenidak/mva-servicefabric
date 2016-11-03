

node -v
if($?)
{
    Write-Host "+++ nodejs is already installed"
}
else
{
    Write-Host "+++ node is not installed, installing"
    choco install nodejs -y

}

