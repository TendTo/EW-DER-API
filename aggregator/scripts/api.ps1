$uri = 'http://localhost:3000/readings'
$asset_id = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819'
$delays = @(
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    110,
    120
)

foreach ($delay in $delays) {
    $value = Get-Random -Minimum 100 -Maximum 10000
    $timestamp = (Get-Date).ToUniversalTime().AddSeconds($delay).ToString("yyyy-MM-ddTHH:mm:ssZ")

    $Body = @{
        readings = @(
            @{
                timestamp = $timestamp
                value = $value
            }
        )
        unit = "Wh"
    }
    $Body = ConvertTo-Json -InputObject $Body
    Invoke-RestMethod -Method 'Post' -Uri "$uri/$asset_id" -Body $body -ContentType "application/json"
}