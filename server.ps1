# ==============================================================================
# StaffConnect - Lightweight Static File Server (PowerShell)
# Serves static files on http://localhost:8080 without requiring Node or Python
# ==============================================================================

$port = 8080
$folder = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  StaffConnect Local Web Server Running!" -ForegroundColor Green
Write-Host "  URL: $prefix" -ForegroundColor Yellow
Write-Host "  Root: $folder" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

try {
    $listener.Start()
    Start-Process $prefix
} catch {
    Write-Host "Could not start server on $prefix. Error: $_" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        $filePath = Join-Path $folder $rawUrl.TrimStart("/").Replace("/", "\")

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawUrl")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Catch cancellation or socket errors
    }
}
