Param(
    [string] $AppName,
    [Switch] $UseLocalCluster
)

#From Service Fabric SDK
function Get-ImageStoreConnectionStringFromClusterManifest
{
    [CmdletBinding()]
    Param
    (
        [xml]
        $ClusterManifest
    )

    $managementSection = $ClusterManifest.ClusterManifest.FabricSettings.Section | ? { $_.Name -eq "Management" }
    return $managementSection.ChildNodes | ? { $_.Name -eq "ImageStoreConnectionString" } | Select-Object -Expand Value
}

$ServiceFabricAppName = "fabric:/PortalApp" 
$AppTypeName       = "PortalAppType"
$AppTypeVersion    = "1.0.0.0"
$CurrentDirectory  = $PSScriptRoot
$SolutionDirectory = (get-item $CurrentDirectory).parent.FullName
$AppPkg            =  $SolutionDirectory + "\" + $AppName



# Connection
$ClusterEndPoint = "MY-CLUSTER-FQDN.AZURE-REGION.cloudapp.azure.com:19000" # Azure Cluster management endpoint
$CertThumbPrint  = "CERT-Thump-print-in-current-user-personal-store" # Certificate used to connect securly

if($UseLocalCluster) 
{

Write-Host "************************ LOCAL CLUSTER *************************" -ForegroundColor Yellow     

    Connect-ServiceFabricCluster
}
else {


# we assume that cloud clusters is secure, if not (which you should never do) then remove the cert related parameters.
Write-Host "************************ REMOTE CLUSTER: $ClusterEndPoint *************************" -ForegroundColor Yellow     
    
#Change if you placed your cert in a different store
Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterEndPoint `
                              -X509Credential `
                              -FindType FindByThumbprint `
                              -FindValue $CertThumbPrint `
                              -StoreName My `
                              -StoreLocation CurrentUser

}








$ClusterMainfest =  Get-ServiceFabricClusterManifest
$imageStoreConnectionString = Get-ImageStoreConnectionStringFromClusterManifest -ClusterManifest $ClusterMainfest

Write-Host "************************ COPY APP PKG *************************" -ForegroundColor Yellow 
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $AppPkg `
									 -ImageStoreConnectionString $imageStoreConnectionString `
									 -ApplicationPackagePathInImageStore $AppName

Write-Host "************************ REGISTER APP *************************" -ForegroundColor Yellow
Register-ServiceFabricApplicationType -ApplicationPathInImageStore $AppName


Write-Host "************************ CREATE APP INSTANCE *************************" -ForegroundColor Yellow
New-ServiceFabricApplication -ApplicationName $ServiceFabricAppName `
                             -ApplicationTypeName $AppTypeName `
                             -ApplicationTypeVersion $AppTypeVersion