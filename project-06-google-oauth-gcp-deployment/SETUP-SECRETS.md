# Managing Secrets with Secret Manager

Google Cloud Secret Manager is a secure and convenient way to store and manage secrets like API keys, passwords, and certificates. In this project, you will use Secret Manager to store your Google OAuth client ID and client secret.

## 1. Storing Your OAuth Credentials

You will need to create two secrets: one for your client ID and one for your client secret.

### Create the Client ID Secret

```bash
echo -n "YOUR_CLIENT_ID" | gcloud secrets create google-oauth-client-id --data-file=-
```

Replace `YOUR_CLIENT_ID` with your actual Google OAuth client ID.

### Create the Client Secret Secret

```bash
echo -n "YOUR_CLIENT_SECRET" | gcloud secrets create google-oauth-client-secret --data-file=-
```

Replace `YOUR_CLIENT_SECRET` with your actual Google OAuth client secret.

### Storing Secrets via the Cloud Console

1.  Go to the [Secret Manager](https://console.cloud.google.com/security/secret-manager) in the Google Cloud Console.
2.  Click **Create Secret**.
3.  Enter a **Name** for your secret (e.g., `google-oauth-client-id`).
4.  In the **Secret value** field, enter your client ID.
5.  Click **Create Secret**.
6.  Repeat the process for your client secret, naming it `google-oauth-client-secret`.

## 2. Granting Access to Your Application

For your Cloud Run or App Engine application to be able to access these secrets, you need to grant the appropriate permissions to the service account that your application uses.

By default, Cloud Run and App Engine use the **Compute Engine default service account**. You can grant this service account the **Secret Manager Secret Accessor** role.

### Granting Access via gcloud

First, get your project number:

```bash
PROJECT_NUMBER=$(gcloud projects describe "$(gcloud config get-value project)" --format='value(projectNumber)')
```

Then, grant the role to the default service account:

```bash
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

This command grants the service account the ability to access the values of secrets in your project. You will reference the secret names in your application's configuration so it knows which secrets to fetch.

