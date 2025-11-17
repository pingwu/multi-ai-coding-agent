# Environment Variables and PATH: Production Security Fundamentals

**Target Audience**: Developers training for DevOps/Platform Engineering roles with enterprise security mindset

**Concept Type**: Production Infrastructure Configuration

**Related To**: Secrets management, application security, infrastructure as code, twelve-factor app methodology

---

## Overview

Environment variables are the foundation of secure, portable application configuration in production environments. This guide covers enterprise-grade practices for managing configuration, secrets, and system paths.

**Production Imperatives**:
- **Security**: Separation of secrets from code (OWASP Top 10)
- **Portability**: Deploy same code across dev/staging/production
- **Compliance**: Audit trails and access control for sensitive data
- **Operations**: Runtime configuration without code changes

---

## Table of Contents

- [What Are Environment Variables?](#what-are-environment-variables)
- [Why Environment Variables Matter](#why-environment-variables-matter-for-you)
- [User vs System Environment Variables](#user-vs-system-environment-variables-windows)
- [How to View Environment Variables](#how-to-view-environment-variables)
- [How to Set Environment Variables](#how-to-set-environment-variables)
- [Understanding the PATH Variable](#understanding-the-path-variable)
- [Environment Variables for API Keys](#environment-variables-for-api-keys-security)
- [Common Issues for Beginners](#common-issues-for-beginners)
- [Quick Reference](#quick-reference-for-beginners)

---

## What Are Environment Variables?

**Definition**: Environment variables are key-value pairs that configure application behavior at runtime, external to the codebase. They provide dynamic configuration injection following the [Twelve-Factor App](https://12factor.net/config) methodology.

**Core Principle**: Strict separation of configuration from code.

**Production Anti-Pattern** (Security Violation):
```python
# NEVER DO THIS - Credential exposure vulnerability
api_key = "sk-ant-api03-xyz123abc456..."  # Hardcoded secret
client = anthropic.Client(api_key=api_key)
```

**Production Standard** (Secure Configuration):
```python
# REQUIRED - Externalized configuration
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY must be set in environment")
client = anthropic.Client(api_key=api_key)
```

---

## Why Environment Variables Are Critical

Environment variables enable four production requirements:

### 1. **Security: Secrets Management**
- Credentials never committed to version control
- Prevention of secret exposure in logs, error messages, or screenshots
- Different secrets per environment (dev uses test keys, prod uses production keys)
- Rotation capability without code deployment
- Compliance with SOC 2, PCI-DSS, HIPAA requirements

### 2. **Portability: Environment Parity**
- Same Docker image deployed across all environments
- Configuration injected at deployment time
- No code changes between dev/staging/production
- Infrastructure as Code (IaC) compatible

### 3. **Operations: Runtime Configuration**
- Feature flags toggled without redeployment
- Database connection strings updated during failover
- Service endpoints switched during migration
- Performance tuning (connection pools, timeouts) without builds

### 4. **Compliance: Audit and Access Control**
- Centralized secrets management (AWS Secrets Manager, HashiCorp Vault)
- Access logging for sensitive configuration
- Role-based access control (RBAC) for production credentials
- Separation of duties (developers don't see production API keys)

**Common Variables You'll Use**:

| Variable Name | What It Does | Example Value |
|--------------|--------------|---------------|
| `ANTHROPIC_API_KEY` | Your Claude API key | `sk-ant-api03-...` |
| `OPENAI_API_KEY` | OpenAI API key for GPT | `sk-proj-...` |
| `PATH` | Where to find programs | `C:\Python311;C:\Users\you\.local\bin` |
| `PYTHONPATH` | Where Python finds modules | `C:\MyPythonLibs` |
| `HOME` | Your user home directory | `C:\Users\yourname` |
| `EDITOR` | Default text editor for command-line tools | `code --wait` |
| `TEMP` / `TMP` | Temporary files directory | `C:\Users\you\AppData\Local\Temp` |

---

## User vs System Environment Variables (Windows)

Windows has **two types** of environment variables:

### User Environment Variables (Recommended for You)
- **Who sees them**: Only YOUR user account
- **Permissions needed**: None (you can set these yourself)
- **Safety**: Can't break system-wide programs
- **Best for**: Installing tools just for yourself, API keys, personal settings

### System Environment Variables
- **Who sees them**: ALL users on the computer
- **Permissions needed**: [[glossary/system-administrator|Administrator rights]]
- **Safety**: Could affect other users or system programs
- **Best for**: System-wide applications (avoid as a beginner)

**Important**: The PATH variable combines both—System PATH is searched first, then your User PATH is appended.

---

## How to View Environment Variables

### Method 1: GUI (Easiest for Beginners)

**Step-by-step**:
1. Press `Windows key + R` to open Run dialog
2. Type `sysdm.cpl` and press Enter
3. Click the **Advanced** tab
4. Click **Environment Variables** button
5. You'll see two sections:
   - **Top**: User variables for your account ← Start here
   - **Bottom**: System variables (for all users)

**Alternative way**:
1. Press Windows key
2. Type "environment"
3. Click "Edit the system environment variables"
4. Click **Environment Variables** button

### Method 2: PowerShell (Quick Check)

```powershell
# View ALL environment variables
Get-ChildItem Env:

# View a specific variable
$env:PATH
$env:ANTHROPIC_API_KEY

# View PATH entries one per line (easier to read)
$env:PATH -split ";"

# Check if something is in your PATH
$env:PATH -split ";" | Select-String "Python"
```

### Method 3: Git Bash

```bash
# View all environment variables
env

# View specific variable
echo $PATH
echo $ANTHROPIC_API_KEY

# View PATH entries one per line
echo $PATH | tr ';' '\n'
```

---

## How to Set Environment Variables

### Method 1: GUI (Permanent - Best for Beginners)

**To create a new User environment variable** (like for API keys):

1. Open Environment Variables window (see "How to View" above)
2. In the **User variables** section (top half), click **New...**
3. **Variable name**: Type the name (e.g., `ANTHROPIC_API_KEY`)
4. **Variable value**: Paste your value (e.g., your API key)
5. Click **OK** on all windows
6. **CRITICAL**: Close and reopen ALL terminal windows

**To add a directory to your PATH**:

1. Open Environment Variables window
2. In **User variables**, select the **Path** variable
3. Click **Edit...**
4. Click **New**
5. Type or paste the directory path (e.g., `C:\Users\yourname\.local\bin`)
6. Click **OK** on all windows
7. **CRITICAL**: Close and reopen ALL terminals

### Method 2: PowerShell (Permanent)

```powershell
# Set a new user environment variable
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-api-key-here", [EnvironmentVariableTarget]::User)

# Add a directory to your user PATH
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;C:\Users\yourname\.local\bin", [EnvironmentVariableTarget]::User)

# ⚠️ Remember to close and reopen terminals after this!
```

### Method 3: PowerShell (Temporary - Current Session Only)

```powershell
# Set for this PowerShell window only (lost when you close it)
$env:ANTHROPIC_API_KEY = "your-api-key-here"
$env:PATH = "$env:PATH;C:\new\directory"
```

**When to use temporary**: Testing, one-time tasks, or when you don't want permanent changes.

---

## Understanding the PATH Variable

**What is PATH?** The most important environment variable you'll use.

**Simple Explanation**: PATH is a list of folders where Windows looks for executable programs when you type a command.

**Analogy**: Imagine PATH as a list of rooms where you keep tools. When you ask for a "hammer," Windows checks each room on the PATH list until it finds one.

### How PATH Works: Step-by-Step

When you type a command like `python` or `claude`:

1. **Check Current Folder**: Windows first looks in your current directory
2. **Check PATH Folders**: If not found, Windows checks each directory in PATH (left to right)
3. **Run First Match**: When found, Windows runs that program
4. **Error if Not Found**: If not in any PATH folder, you get "command not recognized"

**Example**:

Your PATH is:
```
C:\Windows\System32;C:\Python311;C:\Users\you\.local\bin
```

You type `python`:
1. Check current folder → not found
2. Check `C:\Windows\System32` → not found
3. Check `C:\Python311` → **FOUND** `python.exe` ✓
4. Run it!

### Viewing Your PATH

**PowerShell (shows all directories in PATH)**:
```powershell
# Hard to read (one long line)
$env:PATH

# Easy to read (one directory per line)
$env:PATH -split ";"
```

**Git Bash**:
```bash
# Easy to read
echo $PATH | tr ';' '\n'
```

### Why PATH Matters

After installing programs like Python or Claude Code, the installer adds its location to your PATH so you can type the command from anywhere:

**Before PATH is updated**:
```powershell
PS C:\Users\you\Documents> python --version
# Error: 'python' is not recognized as a command
```

**After PATH is updated**:
```powershell
PS C:\Users\you\Documents> python --version
# Python 3.11.0 ✓
```

---

## Environment Variables for API Keys (Security!)

### The Security Problem

**⚠️ NEVER DO THIS** (Hardcoded API Key - BAD):
```python
# DON'T DO THIS - Anyone who sees this code gets your API key!
api_key = "sk-ant-api03-xyz123abc456..."
client = anthropic.Client(api_key=api_key)
```

**✅ DO THIS** (Environment Variable - GOOD):
```python
# DO THIS - API key stored safely outside your code
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Client(api_key=api_key)
```

### Why This Matters (Real Risks)

**If you hardcode API keys**:
- ❌ **Push to GitHub** → Your key is public forever (even if you delete it later)
- ❌ **Share code** → Everyone gets your key
- ❌ **Screenshot** → Key is visible
- ❌ **Someone uses your key** → You get charged for their usage
- ❌ **Code review** → Key visible to all reviewers
- ❌ **Copy-paste** → Accidentally expose in forums/Stack Overflow

**Real-world scenario**: You commit code with API key, push to GitHub, delete it in next commit. The key is still in Git history forever and can be found by scrapers.

**If you use environment variables**:
- ✅ Code can be shared safely
- ✅ Different keys on different computers
- ✅ Easy to rotate/change keys
- ✅ Keys not in version control
- ✅ Separation of code and configuration
- ✅ Production vs development keys

### Best Practices for API Keys

1. **Never hardcode** API keys in source code
2. **Use environment variables** (Windows) or `.env` files (projects)
3. **Add `.env` to `.gitignore`** (never commit it to Git)
4. **Rotate keys regularly** (change them periodically)
5. **Limit permissions** when creating API keys (principle of least privilege)
6. **Monitor usage** to detect unauthorized access
7. **Revoke immediately** if exposed (generate new key)
8. **Use different keys** for development, testing, and production

### Using .env Files for Projects

For project-specific API keys, use `.env` files:

**Step 1**: Install python-dotenv
```bash
pip install python-dotenv
```

**Step 2**: Create `.env` file in your project
```
# .env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-proj-your-other-key-here
DATABASE_URL=postgresql://localhost/mydb
DEBUG=True
```

**Step 3**: Add `.env` to `.gitignore`
```
# .gitignore
.env
*.env
.env.local
.env.*.local
```

**Step 4**: Create `.env.example` for documentation
```
# .env.example (commit this to Git)
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
DATABASE_URL=postgresql://localhost/mydb
DEBUG=False
```

**Step 5**: Use in your Python code
```python
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access them
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY not set in environment")

print(f"API key loaded: {api_key[:10]}...")  # Print first 10 chars only
```

### Other Application Configurations

Environment variables aren't just for API keys—they configure many aspects of applications:

**Database Configuration**:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
```

**Application Behavior**:
```
DEBUG=True
LOG_LEVEL=INFO
ENVIRONMENT=development
```

**Service Endpoints**:
```
API_BASE_URL=https://api.example.com
WEBHOOK_URL=https://myapp.com/webhook
```

**Feature Flags**:
```
ENABLE_FEATURE_X=true
MAX_UPLOAD_SIZE=10485760
```

**Example Usage in Python**:
```python
import os

# Get configuration from environment
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))

# Use in application
if DEBUG:
    print("Running in debug mode")
```

---

## Cloud Provider Secret Management Services

**Context**: This section transitions from local `.env` files to enterprise-grade secret management for production deployments.

**When to Read**: After understanding environment variables fundamentals, when architecting production systems requiring centralized secret management, automated rotation, and compliance requirements.

### Evolution: Environment Variables → Secret Managers

While environment variables provide configuration management foundation, production systems at scale require dedicated secret management infrastructure:

**Environment Variables Alone (Development)**:
- ✅ Acceptable: Local development, small deployments (< 10 secrets)
- ✅ Acceptable: Single developer, non-production environments
- ❌ Insufficient: Production with compliance requirements (SOC 2, HIPAA, PCI-DSS)
- ❌ Insufficient: Multi-service deployments requiring shared secrets
- ❌ Insufficient: Automatic credential rotation requirements

**Secret Managers Required When**:
- Automated secret rotation without redeployment
- Centralized audit trails for compliance frameworks
- Fine-grained access control across teams and environments
- Secrets shared across multiple services or environments
- Dynamic secrets with time-based expiration
- Multi-cloud or hybrid cloud deployments

---

### AWS Secret Management

AWS provides two distinct services optimized for different use cases:

#### AWS Secrets Manager (Database Credentials, Rotating Secrets)

**Primary Use Case**: Database credentials, API keys requiring automatic rotation.

**Key Capabilities**:
- **Automatic Rotation**: Native integration with RDS, Redshift, DocumentDB
- **Cross-Region Replication**: Disaster recovery and multi-region deployments
- **Versioning**: Built-in secret version management with rollback
- **Secret Generation**: Cryptographically secure random secret generation
- **Capacity**: Up to 64 KB per secret
- **Encryption**: Mandatory AWS KMS encryption with customer-managed keys

**Pricing (2025)**:
- $0.40 per secret per month
- $0.05 per 10,000 API calls

**Rotation Architecture**:
```python
# Lambda rotation function (AWS-provided template)
def lambda_handler(event, context):
    service_client = boto3.client('secretsmanager')
    # 1. Create new secret
    # 2. Test new credentials
    # 3. Update database
    # 4. Finalize rotation
```

**IAM Access Control**:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/database-*",
    "Condition": {
      "StringEquals": {"secretsmanager:VersionStage": "AWSCURRENT"}
    }
  }]
}
```

**When to Use Secrets Manager**:
- Database credentials requiring rotation every 30-90 days
- Compliance mandates for automatic credential rotation (PCI-DSS Req. 8.2.4)
- Multi-region deployments requiring secret replication
- Secrets larger than 4 KB
- Cross-account secret sharing requirements

#### AWS Systems Manager Parameter Store (Configuration Data)

**Primary Use Case**: Configuration data, feature flags, cost-sensitive secret storage.

**Key Capabilities**:
- **Standard Tier**: FREE up to 10,000 parameters, 4 KB limit
- **Advanced Tier**: $0.05/month, 8 KB limit, parameter policies
- **Hierarchical Storage**: Path-based organization (`/prod/app/database/host`)
- **Change Notifications**: CloudWatch Events integration
- **Encryption**: Optional KMS encryption for SecureString type

**Parameter Types**:
```bash
# String - Plain text configuration
aws ssm put-parameter --name /prod/api/endpoint --value "https://api.example.com" --type String

# SecureString - KMS-encrypted secrets
aws ssm put-parameter --name /prod/db/password --value "secret123" --type SecureString --key-id alias/aws/ssm

# StringList - Comma-separated values
aws ssm put-parameter --name /prod/allowed-ips --value "10.0.0.1,10.0.0.2" --type StringList
```

**Cost Comparison**:
| Service | 100 Secrets | 1,000 Secrets | Rotation |
|---------|-------------|---------------|----------|
| Secrets Manager | $40/month | $400/month | Automated |
| Parameter Store (Standard) | **FREE** | **FREE** | Manual |
| Parameter Store (Advanced) | $5/month | $50/month | Manual |

**When to Use Parameter Store**:
- High volume of small configuration values
- Non-sensitive configuration (API endpoints, feature flags)
- Cost optimization (free tier for up to 10,000 parameters)
- Manual rotation is acceptable
- Already using AWS Systems Manager ecosystem

#### Injecting Secrets in AWS Services

**ECS (Elastic Container Service)**:
```json
{
  "containerDefinitions": [{
    "name": "app",
    "secrets": [{
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/db-password"
    }, {
      "name": "API_ENDPOINT",
      "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/prod/api/endpoint"
    }]
  }]
}
```

**Lambda Functions**:
```python
import boto3
import json

def lambda_handler(event, context):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/api-key')
    secret = json.loads(response['SecretString'])
    # Use secret['apiKey']
```

**Lambda Extension (Caching - Cost Optimization)**:
```python
# AWS Secrets and Configuration Provider Extension
# Caches secrets for 5 minutes, reduces API calls
import requests

secrets_extension_endpoint = f"http://localhost:2773/secretsmanager/get?secretId=prod/api-key"
headers = {"X-Aws-Parameters-Secrets-Token": os.environ['AWS_SESSION_TOKEN']}
response = requests.get(secrets_extension_endpoint, headers=headers)
```

**Security Best Practices**:
- Use VPC endpoints for private network access (no internet gateway)
- Apply least-privilege IAM policies with specific secret ARNs
- Enable CloudTrail for access auditing and compliance
- Implement secret rotation before expiration (30-90 days)
- Use resource-based policies for cross-account access

**Operational Considerations**:
- Secrets injected at container startup (not updated during runtime)
- Lambda cold starts include secret retrieval latency (~100-200ms)
- ECS secret updates require task redeployment

---

### Azure Secret Management

#### Azure Key Vault (Centralized Secret, Key, Certificate Management)

**Primary Use Case**: Enterprise-grade secret management for Azure workloads with Managed Identity integration.

**Vault Types**:
1. **Secrets**: Passwords, connection strings, API keys (string values)
2. **Keys**: Encryption keys, signing keys (cryptographic keys)
3. **Certificates**: SSL/TLS certificates with managed renewal

**Key Capabilities**:
- **Managed Identity Integration**: Passwordless authentication for Azure resources
- **RBAC and Access Policies**: Dual permission models (RBAC recommended)
- **Soft Delete & Purge Protection**: 30-90 day recovery from accidental deletion
- **Network Security**: Private endpoints and firewall rules
- **HSM-Backed Keys**: Premium tier for FIPS 140-2 Level 3 compliance

**Pricing (2025)**:
- Standard tier: $0.03 per 10,000 operations (no per-secret fee)
- Premium tier (HSM-backed): $1/key/month + operations
- Significantly cheaper than AWS for high secret count

**Managed Identity Authentication (Recommended Pattern)**:
```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

// No credentials in code - uses system-assigned managed identity
var client = new SecretClient(
    vaultUri: new Uri("https://myvault.vault.azure.net"),
    credential: new DefaultAzureCredential()
);

KeyVaultSecret secret = await client.GetSecretAsync("database-password");
string password = secret.Value;
```

**RBAC Permission Model** (Best Practice):
```bash
# Assign least-privilege role to managed identity
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee <managed-identity-principal-id> \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/<vault-name>
```

**Rotation Strategy**:
Azure Key Vault does **NOT** provide automatic rotation (unlike AWS Secrets Manager). Implement rotation via:

```bash
# Event Grid notification on near-expiration
az eventgrid event-subscription create \
  --name secret-expiration-notification \
  --source-resource-id /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/<vault> \
  --endpoint https://myfunction.azurewebsites.net/api/rotate-secret \
  --included-event-types Microsoft.KeyVault.SecretNearExpiry
```

#### Injecting Secrets in Azure Services

**App Service / Azure Functions (Key Vault Reference)**:
```bash
# Application Setting with Key Vault reference syntax
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/database-password/)

# With specific version (pinned)
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/api-key/abc123def456)
```

**Configuration Steps**:
1. Enable System-Assigned Managed Identity for App Service
2. Grant "Key Vault Secrets User" role to the managed identity
3. Add Application Setting with `@Microsoft.KeyVault()` reference
4. App Service automatically retrieves secret at startup

**Azure Kubernetes Service (AKS) - CSI Driver**:
```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault-secrets
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: "<managed-identity-client-id>"
    keyvaultName: "myvault"
    tenantId: "<tenant-id>"
    objects: |
      array:
        - objectName: "database-password"
          objectType: "secret"
          objectVersion: ""  # Empty = latest version
```

**Security Best Practices**:
- **Use Managed Identity** over service principals (eliminates credential storage)
- **Use RBAC** instead of access policies (better separation of duties, audit trail)
- **Enable soft delete** (30-90 day retention for disaster recovery)
- **Use private endpoints** for VNet-isolated access
- **Version secrets** when rotating (allows zero-downtime rollback)

**Operational Considerations**:
- Secrets cached by App Service (not updated until app restart)
- Network isolation via VNet integration required for compliance
- Audit logging via Azure Monitor (90-day retention, export to Log Analytics)
- Compliance: FIPS 140-2 Level 2 (Standard), Level 3 (Premium HSM)

---

### Google Cloud Secret Management

#### Google Cloud Secret Manager (Version-Based Secret Storage)

**Primary Use Case**: Centralized secret storage for GCP services with automatic versioning and IAM integration.

**Key Capabilities**:
- **Automatic Versioning**: Every secret update creates new immutable version
- **IAM Integration**: Fine-grained access control at secret or version level
- **Regional Replication**: Automatic multi-region availability
- **Audit Logging**: Cloud Audit Logs for all access attempts
- **Encryption**: Automatic encryption at rest (Google-managed or Customer-Managed Encryption Keys)

**Pricing (2025)**:
- 6 active secret versions: **FREE**
- $0.06 per secret version per month (beyond free tier)
- $0.03 per 10,000 access operations
- Regional replication: No additional cost

**IAM Permission Model**:
```bash
# Grant least-privilege access to service account
gcloud secrets add-iam-policy-binding database-password \
  --member="serviceAccount:myapp@project-id.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Versioning and Rotation**:
```bash
# Add new secret version (rotation)
echo -n "new-password-value" | gcloud secrets versions add database-password --data-file=-

# List all versions
gcloud secrets versions list database-password

# Disable old version (keep for audit, prevent use)
gcloud secrets versions disable 1 --secret=database-password

# Destroy version (compliance requirement for PII)
gcloud secrets versions destroy 1 --secret=database-password
```

**Rotation Notifications** (Pub/Sub Integration):
```bash
# Create rotation schedule (notifies via Pub/Sub, does NOT auto-rotate)
gcloud secrets update database-password \
  --next-rotation-time="2025-03-01T00:00:00Z" \
  --rotation-period="2592000s" \
  --topics="projects/my-project/topics/secret-rotation"
```

**Important**: GCP Secret Manager sends Pub/Sub notifications on rotation schedule but does **NOT** automatically rotate secrets. Implement rotation handler:

```python
# Cloud Function triggered by Pub/Sub
def rotate_secret(event, context):
    import google.cloud.secretmanager as secretmanager

    client = secretmanager.SecretManagerServiceClient()
    secret_name = event['attributes']['secretId']

    # 1. Generate new password
    new_password = generate_secure_password()

    # 2. Add new version to Secret Manager
    parent = client.secret_path(PROJECT_ID, secret_name)
    response = client.add_secret_version(
        request={"parent": parent, "payload": {"data": new_password.encode("UTF-8")}}
    )

    # 3. Update database with new password
    update_database_password(new_password)

    # 4. Disable old version
    old_version = get_previous_version(secret_name)
    client.disable_secret_version(request={"name": old_version})
```

#### Injecting Secrets in GCP Services

**Cloud Run**:
```bash
# Mount secret as environment variable
gcloud run deploy myapp \
  --set-secrets="DB_PASSWORD=database-password:latest"

# Mount secret as file
gcloud run deploy myapp \
  --set-secrets="/secrets/db-password=database-password:latest"
```

**Cloud Functions**:
```bash
# Secret injected as environment variable at function deployment
gcloud functions deploy myfunction \
  --set-secrets="API_KEY=api-key:1"  # Pin to version 1
```

**GKE (Google Kubernetes Engine) - Workload Identity**:
```python
from google.cloud import secretmanager

# Uses Workload Identity (no service account key file)
client = secretmanager.SecretManagerServiceClient()
name = "projects/my-project/secrets/database-password/versions/latest"
response = client.access_secret_version(request={"name": name})
secret_value = response.payload.data.decode("UTF-8")
```

**GKE - Secret Store CSI Driver** (Volume Mount):
```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: gcp-secrets
spec:
  provider: gcp
  parameters:
    secrets: |
      - resourceName: "projects/my-project/secrets/database-password/versions/latest"
        path: "db-password"
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  serviceAccountName: myapp-sa  # With Workload Identity
  volumes:
  - name: secrets
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "gcp-secrets"
  containers:
  - name: app
    image: myapp:latest
    volumeMounts:
    - name: secrets
      mountPath: "/mnt/secrets"
      readOnly: true
```

**Security Best Practices**:
- **Use `latest` alias** for automatic version updates (or pin to specific version for stability)
- **Implement Pub/Sub rotation handlers** for automated secret lifecycle
- **Use Workload Identity** in GKE (avoid service account key files)
- **Enable automatic replication** for high availability
- **Disable old versions** instead of deleting (maintains audit trail)

**Operational Considerations**:
- Secrets retrieved at container startup (Cloud Run/Functions)
- Use VPC Service Controls for network isolation (compliance requirement)
- Cloud Audit Logs capture all `accessSecretVersion` operations
- Compliance: FIPS 140-2 validated encryption modules

**GCP vs AWS/Azure Comparison**:
| Feature | GCP Secret Manager | AWS Secrets Manager | Azure Key Vault |
|---------|-------------------|---------------------|-----------------|
| Automatic Rotation | ❌ (Pub/Sub notify) | ✅ (Lambda-based) | ❌ (custom Event Grid) |
| Pricing Model | Per version | Per secret | Per operation |
| Free Tier | 6 versions/secret | None | None |
| Versioning | Immutable versions | AWSCURRENT/AWSPREVIOUS | Version IDs |
| Native K8s Integration | CSI driver + Workload Identity | External Secrets Operator | CSI driver + Managed Identity |

---

### Kubernetes Secret Management

#### Native Secrets vs ConfigMaps

**ConfigMaps** (Non-Sensitive Configuration):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  API_ENDPOINT: "https://api.example.com"
  LOG_LEVEL: "INFO"
  FEATURE_FLAG_X: "true"
```

**Kubernetes Secrets** (Sensitive Data):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
type: Opaque
data:
  username: YWRtaW4=  # Base64 encoded, NOT encrypted
  password: cGFzc3dvcmQxMjM=
```

**Critical Security Limitation**:
- Kubernetes Secrets are **base64 encoded**, NOT encrypted by default
- Stored in etcd without encryption (unless etcd encryption at rest enabled)
- Anyone with access to etcd backup can decode secrets
- **Production Recommendation**: Do NOT store sensitive secrets directly in K8s Secrets

**What K8s Secrets Provide**:
- Separation from pod definitions (not in YAML manifests)
- RBAC access control
- No encryption at rest by default (requires cluster-level configuration)

#### External Secrets Operator (ESO) - Production Standard

**Architecture Pattern**:
```
Cloud Secret Manager → External Secrets Operator → Kubernetes Secret → Pod
(AWS/Azure/GCP/Vault)    (Watches & Syncs)         (Native K8s)      (Consumes)
```

**Why ESO**:
- Synchronizes secrets from external providers into Kubernetes
- Single source of truth in cloud secret manager
- Continuous sync (secrets updated automatically)
- Multi-cloud support (AWS, Azure, GCP, Vault, 70+ providers)
- Centralized audit trail in cloud provider

**Installation**:
```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
```

**AWS Integration Example**:
```yaml
# Step 1: Configure SecretStore (connection to AWS Secrets Manager)
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: production
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:  # Uses IRSA (IAM Roles for Service Accounts)
          serviceAccountRef:
            name: external-secrets-sa
---
# Step 2: Define ExternalSecret (what to sync)
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
  namespace: production
spec:
  refreshInterval: 1h  # Re-sync every hour
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: database-credentials  # Creates K8s Secret
    creationPolicy: Owner
  data:
  - secretKey: password  # Key in K8s Secret
    remoteRef:
      key: prod/database/password  # Secret name in AWS Secrets Manager
      property: password  # JSON key if secret is JSON object
```

**GCP Integration Example**:
```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gcp-secret-manager
spec:
  provider:
    gcpsm:
      projectID: "my-gcp-project"
      auth:
        workloadIdentity:
          clusterLocation: us-central1
          clusterName: my-gke-cluster
          serviceAccountRef:
            name: external-secrets-sa
```

**Azure Integration Example**:
```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: azure-key-vault
spec:
  provider:
    azurekv:
      vaultUrl: "https://myvault.vault.azure.net"
      authType: ManagedIdentity
      identityId: /subscriptions/<sub>/resourcegroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>
```

**Key Benefits**:
- **Continuous Sync**: Automatically updates K8s Secrets when cloud secrets rotate
- **Multi-Cloud**: Single operator for AWS, Azure, GCP, Vault
- **Centralized Management**: Secrets managed in cloud provider, not K8s manifests
- **Audit Trail**: Cloud provider audit logs capture all access
- **No Secret Sprawl**: Single source of truth

**2025 Updates**:
- **Red Hat OpenShift GA**: External Secrets Operator officially supported (November 2025)
- **Nutanix Kubernetes Platform**: Pre-installed in NKP 2.16+
- **Enhanced OIDC Support**: Passwordless cloud authentication across providers

**Best Practices**:
- Use **Workload Identity** (GKE), **IRSA** (EKS), or **Managed Identity** (AKS) for authentication
- Set `refreshInterval` based on rotation frequency (15m-1h)
- Use `ClusterSecretStore` for cluster-wide secret providers
- Implement `ExternalSecret` per namespace for isolation
- Monitor ESO controller logs for sync failures

---

### HashiCorp Vault (Multi-Cloud Enterprise Secret Management)

**When to Use Vault vs Cloud-Native Solutions**:

**Use HashiCorp Vault When**:
- ✅ Multi-cloud deployments (secrets span AWS, Azure, GCP, on-premises)
- ✅ Dynamic secrets required (database credentials created on-demand, auto-expire)
- ✅ Encryption-as-a-service needed (application data encryption without managing keys)
- ✅ PKI/certificate management (internal certificate authority)
- ✅ Advanced features required (secret leasing, renewal, revocation)
- ✅ Vendor neutrality strategy (avoid cloud provider lock-in)

**Use Cloud-Native Solutions When**:
- ✅ Single cloud environment (all resources in AWS, Azure, or GCP)
- ✅ Simpler requirements (static secrets with basic rotation)
- ✅ Managed service preferred (reduce operational overhead)
- ✅ Cost-sensitive (cloud-native often cheaper for small deployments)

#### Vault Differentiators

**1. Dynamic Secrets**:
```bash
# Generate short-lived database credentials (expires after use)
vault read database/creds/readonly-role

# Output:
# Key                Value
# ---                -----
# lease_id           database/creds/readonly-role/abc123
# lease_duration     1h
# username           v-token-readonly-abc123def
# password           xyz789secure
```

**2. Encryption as a Service** (Transit Engine):
```bash
# Encrypt data without managing keys
vault write transit/encrypt/customer-data plaintext=$(base64 <<< "credit-card-number")

# Returns:
# ciphertext    vault:v1:abc123...
# (Store ciphertext in database, Vault holds encryption key)
```

**3. Multi-Cloud Secret Sync** (Enterprise):
```hcl
# Vault Secrets Sync - replicate to AWS, Azure, GCP
destination "aws-sm" {
  type   = "aws-sm"
  region = "us-east-1"

  sync {
    prefix = "vault/"
  }
}
```

**4. PKI Management**:
```bash
# Generate SSL certificate with 24-hour TTL
vault write pki/issue/web-server \
  common_name="app.example.com" \
  ttl=24h
```

#### Vault Deployment Models

| Model | Operational Overhead | Cost (est.) | Use Case |
|-------|---------------------|-------------|----------|
| **Self-Hosted (OSS)** | High | Infra costs | Full control, on-premises |
| **HCP Vault (Managed)** | Low | ~$22/month base | Production without ops burden |
| **Vault Enterprise** | Medium | Custom licensing | Advanced features (DR replication, namespaces) |

#### Vault vs Cloud Provider Feature Matrix

| Feature | HashiCorp Vault | AWS Secrets Mgr | Azure Key Vault | GCP Secret Mgr |
|---------|----------------|-----------------|-----------------|----------------|
| **Multi-Cloud** | ✅ Best-in-class | ❌ AWS only | ❌ Azure only | ❌ GCP only |
| **Dynamic Secrets** | ✅ Native (DB, PKI, AWS, SSH) | ❌ Custom Lambda | ❌ Custom | ❌ Custom |
| **Auto Rotation** | ✅ Flexible policies | ✅ RDS/Redshift | ❌ Manual/Event Grid | ❌ Pub/Sub notify |
| **Complexity** | ⚠️ High | ✅ Low | ✅ Low | ✅ Low |
| **Operational Overhead** | ⚠️ High (self-hosted), Low (HCP) | ✅ Managed | ✅ Managed | ✅ Managed |
| **Cost (100 secrets)** | ~$22/month (HCP) | $40/month | ~$0.30/month | ~$6/month |
| **Encryption-as-a-Service** | ✅ Transit engine | ❌ (use KMS separately) | ✅ Key Vault | ❌ (use KMS separately) |

**Complexity Trade-off**: Vault provides enterprise-grade features at the cost of operational complexity. Cloud-native solutions offer simplicity within their ecosystems.

---

### Decision Framework: Choosing the Right Solution

**Use Environment Variables Directly When**:
- ✅ Single developer, local development
- ✅ Small deployments (< 10 secrets)
- ✅ Non-production environments
- ✅ Cost is primary constraint
- ❌ **NOT** for production with compliance requirements

**Use AWS Secrets Manager When**:
- ✅ AWS-native deployments (ECS, Lambda, RDS)
- ✅ Need automatic database password rotation
- ✅ Compliance requirements (SOC 2, HIPAA, PCI-DSS)
- ✅ Cross-region secret replication required
- ✅ Willing to pay $0.40/secret/month for automation

**Use AWS Parameter Store When**:
- ✅ High volume of configuration values
- ✅ Non-sensitive data or manually rotated secrets
- ✅ Cost optimization (free tier up to 10,000 parameters)
- ✅ Integration with AWS Systems Manager

**Use Azure Key Vault When**:
- ✅ Azure-native deployments (App Service, AKS, Azure Functions)
- ✅ Need Managed Identity integration (passwordless auth)
- ✅ Certificate management requirements
- ✅ Cost-sensitive (cheapest per-operation pricing)

**Use GCP Secret Manager When**:
- ✅ GCP-native deployments (Cloud Run, GKE, Cloud Functions)
- ✅ Need immutable version history
- ✅ Workload Identity integration required
- ✅ Multi-region availability without extra cost

**Use HashiCorp Vault When**:
- ✅ Multi-cloud or hybrid cloud architecture
- ✅ Need dynamic secrets (short-lived credentials)
- ✅ Encryption-as-a-service requirements
- ✅ PKI/certificate authority needs
- ✅ Vendor-neutral strategy

**Use External Secrets Operator When**:
- ✅ Running workloads in Kubernetes (any cloud)
- ✅ Want single operator for multiple secret backends
- ✅ Need automatic secret synchronization
- ✅ Multi-cloud Kubernetes deployments

---

### Cost Comparison (2025 Pricing)

**Scenario: 100 Secrets, 1 Million API Calls/Month**

| Solution | Monthly Cost | Notes |
|----------|--------------|-------|
| **Environment Variables** | $0 | No centralized management, no audit |
| **AWS Parameter Store (Standard)** | $0 + $5 (API calls) = **$5** | Free secrets, pay for API operations |
| **AWS Secrets Manager** | $40 (secrets) + $5 (API calls) = **$45** | Automatic rotation included |
| **Azure Key Vault** | ~$0.30 (operations) = **$0.30** | No per-secret fee, cheapest option |
| **GCP Secret Manager** | $6 (versions) + $3 (operations) = **$9** | 6 free versions/secret |
| **HashiCorp Vault (HCP)** | ~**$22** (base tier) | Managed service, multi-cloud |
| **HashiCorp Vault (Self-Hosted)** | Infra costs (EC2/GKE instances) | Operational overhead |

**Cost Optimization Strategies**:
- Use Parameter Store for non-sensitive config (free tier)
- Use Secrets Manager for credentials requiring rotation
- Implement caching (AWS Lambda Extension reduces API calls 80%+)
- Use External Secrets Operator with cloud-native backends

---

### Security Comparison Matrix

| Feature | Env Vars | AWS Secrets | Azure KV | GCP Secret Mgr | Vault |
|---------|----------|-------------|----------|----------------|-------|
| **Encryption at Rest** | ❌ | ✅ KMS | ✅ KMS | ✅ CMEK | ✅ |
| **Encryption in Transit** | ❌ | ✅ TLS 1.2+ | ✅ TLS 1.2+ | ✅ TLS 1.2+ | ✅ TLS 1.3 |
| **Access Control** | OS-level | IAM | RBAC/Access Policy | IAM | ACL Policies |
| **Audit Logging** | ❌ | CloudTrail | Azure Monitor | Cloud Audit Logs | Audit Device |
| **Automatic Rotation** | ❌ | ✅ (RDS, Redshift) | ❌ | ❌ | ✅ (Dynamic secrets) |
| **Secret Versioning** | ❌ | ✅ | ✅ | ✅ (Immutable) | ✅ |
| **Network Isolation** | N/A | VPC Endpoints | Private Endpoints | VPC-SC | Private Network |
| **Compliance Certs** | N/A | SOC 2, ISO 27001, HIPAA | SOC 2, ISO 27001, HIPAA | SOC 2, ISO 27001, HIPAA | SOC 2, FedRAMP |

---

### Compliance Requirements

**SOC 2 Type II Compliance**:
- ✅ **Mandatory**: Centralized secret management with immutable audit trails
- ✅ **Mandatory**: Access control with least-privilege (IAM, RBAC)
- ✅ **Mandatory**: Encryption at rest and in transit
- ✅ **Mandatory**: Secret rotation policies documented and enforced
- ❌ **Insufficient**: Environment variables without centralized management

**HIPAA Compliance** (Protected Health Information):
- ✅ **Required**: Encryption at rest and in transit
- ✅ **Required**: Audit logs retained for 6+ years
- ✅ **Required**: Access control with user attribution (who accessed what, when)
- ✅ **Recommended**: Automatic secret rotation every 90 days
- ✅ **Recommended**: Network isolation (VPC endpoints, private networks)

**PCI-DSS Compliance** (Payment Card Data):
- ✅ **Requirement 8.2.4**: Change credentials every 90 days (automatic rotation)
- ✅ **Requirement 10**: Audit trail of all access to authentication credentials
- ✅ **Requirement 3.4**: Render PAN (card numbers) unreadable (KMS-backed encryption)
- ✅ **Requirement 7**: Restrict access to cardholder data by business need-to-know

**Key Takeaway**: Compliance frameworks **require** secret managers with audit trails. Environment variables alone do not satisfy audit, access control, or rotation requirements.

---

### CI/CD Integration Best Practices

**GitHub Actions - OIDC Authentication** (Eliminate Long-Lived Credentials):
```yaml
jobs:
  deploy:
    permissions:
      id-token: write  # Required for OIDC
      contents: read
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: us-east-1

      - name: Retrieve secrets
        run: |
          SECRET=$(aws secretsmanager get-secret-value --secret-id prod/api-key --query SecretString --output text)
          echo "::add-mask::$SECRET"  # Mask in logs
          echo "API_KEY=$SECRET" >> $GITHUB_ENV
```

**GitLab CI - Vault Integration**:
```yaml
deploy:
  secrets:
    DATABASE_PASSWORD:
      vault: production/database/password@secret
      file: false  # Inject as environment variable
  script:
    - ./deploy.sh
```

**Secret Scanning** (Prevent Commits):
```yaml
- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
```

---

### Implementation Checklist

**Phase 1: Assessment**
- [ ] Audit current secret storage (`grep -r "api_key\|password" .`)
- [ ] Identify hardcoded secrets (`git-secrets --scan-history`)
- [ ] Document secret rotation requirements
- [ ] Determine compliance requirements (SOC 2, HIPAA, PCI-DSS)

**Phase 2: Architecture**
- [ ] Choose secret manager based on cloud provider and requirements
- [ ] Design IAM/RBAC access control policies
- [ ] Plan secret rotation strategy (manual vs automated)
- [ ] Design network isolation (VPC endpoints, private endpoints)

**Phase 3: Implementation**
- [ ] Configure cloud secret manager
- [ ] Migrate non-critical secrets first (test rotation)
- [ ] Update application code to fetch from secret manager
- [ ] Update CI/CD pipelines (use OIDC, not long-lived credentials)
- [ ] Implement audit logging and monitoring

**Phase 4: Operations**
- [ ] Enable audit logging (CloudTrail, Azure Monitor, Cloud Audit Logs)
- [ ] Configure rotation schedules
- [ ] Test disaster recovery (secret restore from backups)
- [ ] Monitor secret access patterns for anomalies
- [ ] Document runbooks for secret lifecycle management

---

### Key Takeaways for Platform Engineers

1. **Environment variables are the interface**, secret managers are the secure backend
2. **Cloud-native solutions** optimize for simplicity within single cloud ecosystems
3. **HashiCorp Vault** optimizes for multi-cloud and advanced features
4. **Compliance mandates** secret managers—environment variables alone are insufficient
5. **Cost varies 100x**: Free (Parameter Store) to $400+/month (Secrets Manager at scale)
6. **Security posture**: All major providers meet enterprise compliance (SOC 2, HIPAA, PCI-DSS)
7. **Operational trade-off**: Managed services (low ops) vs self-hosted Vault (high ops, high flexibility)

---

---

## WSL (Windows Subsystem for Linux) Environment Variables

**Context**: When using [[wsl-setup-guide|WSL]] on Windows, you work with both Windows and Linux environment variables.

### Environment Variable Separation

**Windows Environment** (PowerShell):
```powershell
# Windows environment variables
$env:ANTHROPIC_API_KEY
$env:PATH  # Uses ; (semicolon) as separator
```

**WSL Environment** (Linux):
```bash
# Linux environment variables (separate from Windows)
echo $ANTHROPIC_API_KEY
echo $PATH  # Uses : (colon) as separator
```

### Windows PATH Integration in WSL

**WSL automatically appends Windows PATH**:
```bash
# Inside WSL - see both Linux and Windows paths
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/mnt/c/Windows/System32:...
#                             ↑ Windows paths appended
```

**Running Windows executables from WSL**:
```bash
# These work because Windows PATH is included
code.exe .         # Launch VS Code (Windows)
explorer.exe .     # Open File Explorer (Windows)
```

### Setting Environment Variables in WSL

**User-Level** (no [[glossary/system-administrator#linux-sudo|sudo]] required):
```bash
# Edit your shell profile
nano ~/.bashrc

# Add environment variables
export ANTHROPIC_API_KEY="sk-ant-api03-..."
export OPENAI_API_KEY="sk-proj-..."

# Apply changes
source ~/.bashrc
```

**System-Level** (requires [[glossary/system-administrator#linux-sudo|sudo]]):
```bash
# For all users (rarely needed)
sudo nano /etc/environment
# Add: VARIABLE_NAME="value"
```

### Cross-Environment Best Practices

**For Development**:
- Set API keys in **WSL environment** (`~/.bashrc`) for Linux tools
- Set API keys in **Windows environment** for Windows tools
- Both environments can have same variable names with different values

**File System Performance**:
```bash
# BEST: Store projects in WSL filesystem
~/projects/my-app

# SLOWER: Access Windows filesystem from WSL
/mnt/c/Users/YourUsername/projects/my-app
```

**Related**: See [[wsl-setup-guide#environment-variables-in-wsl-context|WSL Setup Guide - Environment Variables]]

---

### Related Concepts

- [[glossary/system-administrator]] - Understanding administrator privileges for system vs user environment variables
- [[wsl-setup-guide]] - Complete WSL setup with environment variable configuration
- [[glossary/api-key]] - Secure API key storage using environment variables
- [[twelve-factor-app]] - Configuration best practices for cloud-native applications
- [[zero-trust-architecture]] - Network security and secret access patterns
- [[infrastructure-as-code]] - Terraform/Pulumi secret management
- [[kubernetes-security]] - Container secret management best practices
- [[compliance-frameworks]] - SOC 2, HIPAA, PCI-DSS detailed requirements

---

## Common Issues for Beginners

### Issue 1: "Changes don't take effect"

**Problem**: You set an environment variable but programs don't see it.

**Cause**: Existing terminal windows don't automatically reload environment variables.

**Solution**:
- Close ALL terminal windows (PowerShell, Git Bash, VS Code terminals)
- Open a brand new terminal
- Check again: `$env:VARNAME` (PowerShell) or `echo $VARNAME` (Git Bash)

### Issue 2: "Command not found" after installation

**Problem**: You installed a program (like Python or Claude Code) but Windows says it's not recognized.

**Diagnosis**:
```powershell
# Check if the directory is in your PATH
$env:PATH -split ";" | Select-String "Python"
$env:PATH -split ";" | Select-String "local"
```

**Solutions**:
1. Verify the program actually installed (find the `.exe` file)
2. Add that directory to your PATH (see "How to Set" above)
3. Close and reopen terminals
4. If still not working, restart your computer

### Issue 3: "PATH is too long"

**Problem**: Windows has limits on PATH length (though increased in Windows 10+).

**Solution**:
- Remove unused directories from PATH
- Keep only what you actually use
- Use shorter directory names when possible

### Issue 4: "Which Python/program is running?"

**Problem**: You have multiple versions installed and don't know which one is being used.

**Check which one**:
```powershell
# PowerShell
Get-Command python | Select-Object Source
Get-Command claude | Select-Object Source

# Shows full path to the executable being used
```

```bash
# Git Bash
which python
which claude
```

### Issue 5: "Environment variable not found in code"

**Problem**: Your code can't find the environment variable.

**Diagnosis**:
```python
import os
print(f"ANTHROPIC_API_KEY: {os.getenv('ANTHROPIC_API_KEY')}")
# Prints: None
```

**Solutions**:
1. Check variable name spelling (case-sensitive on some systems)
2. Verify variable is set: `echo $env:ANTHROPIC_API_KEY` (PowerShell)
3. Restart terminal after setting variable
4. Check if using `.env` file, ensure `load_dotenv()` is called
5. Verify `.env` file is in correct directory

---

## Quick Reference for Beginners

### View Environment Variable
```powershell
# PowerShell
$env:VARIABLE_NAME

# Git Bash
echo $VARIABLE_NAME
```

### Set Temporarily (Current Session)
```powershell
# PowerShell
$env:VARIABLE_NAME = "value"

# Git Bash
export VARIABLE_NAME="value"
```

### Set Permanently
1. Press `Windows + R`
2. Type `sysdm.cpl` and press Enter
3. Advanced → Environment Variables
4. Add or edit in User variables section
5. **Close and reopen all terminals**

### Check PATH
```powershell
# PowerShell - one directory per line
$env:PATH -split ";"

# Git Bash
echo $PATH | tr ';' '\n'
```

### Check if directory is in PATH
```powershell
# PowerShell
$env:PATH -split ";" | Select-String "directory-name"

# Git Bash
echo $PATH | grep "directory-name"
```

### Python: Get environment variable with default
```python
import os

# Get variable or use default if not set
api_key = os.getenv("API_KEY", "default-value")

# Get variable or raise error if not set
api_key = os.environ["API_KEY"]  # Raises KeyError if not found
```

---

## Key Takeaways

✅ **You should now understand**:
- Environment variables are settings that programs use
- User variables are safer for beginners than System variables
- PATH tells Windows where to find programs
- API keys should NEVER be hardcoded in code
- Changes require closing and reopening terminals
- `.env` files are good for project-specific settings
- Environment variables separate configuration from code

✅ **You should be able to**:
- View environment variables using GUI or command line
- Set User environment variables using the GUI
- Add a directory to your PATH
- Understand how programs are found when you type commands
- Store API keys securely
- Use `.env` files with python-dotenv
- Configure applications through environment variables

✅ **Security awareness**:
- Never commit API keys to Git
- Always use `.gitignore` for `.env` files
- Understand the permanence of Git history
- Know how to rotate compromised keys
- Use different keys for different environments

📝 **Remember**:
- Always close and reopen terminals after changing environment variables
- Use User variables (not System) as a beginner
- Never commit API keys to Git
- PATH contains directories, not file paths
- `.env.example` documents required variables without exposing secrets

---

## Related Concepts

- **Command-line basics**: Understanding terminals and shells
- **Git and version control**: Why `.gitignore` is important
- **Python virtual environments**: Using `venv` and environment variables together
- **Cloud deployment**: Environment variables in production systems
- **Docker containers**: Environment variables in containerized applications
- **Configuration management**: Best practices for application settings
- **Secrets management**: Tools like AWS Secrets Manager, Azure Key Vault

---

## Additional Resources

### Official Documentation
- [Windows Environment Variables](https://docs.microsoft.com/en-us/windows/win32/procthread/environment-variables)
- [Python os.getenv Documentation](https://docs.python.org/3/library/os.html#os.getenv)
- [python-dotenv Documentation](https://pypi.org/project/python-dotenv/)

### Tutorials
- [Environment Variables for Beginners](https://www.computerhope.com/jargon/e/envivari.htm)
- [PATH Variable Explained](https://www.computerhope.com/issues/ch000549.htm)
- [API Key Security Best Practices](https://owasp.org/www-community/vulnerabilities/Insecure_Storage_of_Sensitive_Information)

### Security Resources
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [git-secrets tool](https://github.com/awslabs/git-secrets)

---

**Last Updated**: 2025-01-16
**Document Type**: Atomic Concept (Zettelkasten)
**Maintained For**: MACA Course - Multi-AI Coding Agent
**Target Audience**: Beginners with limited system administration experience
