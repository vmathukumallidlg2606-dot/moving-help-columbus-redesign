param(
  [Parameter(Mandatory=$true)]
  [string]$Question
)

$corpusPath = "\"$PSScriptRoot\\ollama_corpus.txt\""
if (-not (Test-Path "$PSScriptRoot\\ollama_corpus.txt")){
  Write-Error "Corpus file not found at $PSScriptRoot\\ollama_corpus.txt"
  exit 1
}

# Build prompt: corpus then a clear instruction and the user's question
$corpus = Get-Content -Raw "$PSScriptRoot\\ollama_corpus.txt"
$prompt = $corpus + "\n\n---\nUser question: " + $Question + "\nAssistant:" 

# Send to ollama and print the plain text response
$prompt | ollama run gemma3:latest --format json --keepalive 60m | Out-File -Encoding utf8 "$PSScriptRoot\\last_ollama_response.json"
Get-Content "$PSScriptRoot\\last_ollama_response.json" -Raw

Write-Host "\nSaved full response to: $PSScriptRoot\\last_ollama_response.json"