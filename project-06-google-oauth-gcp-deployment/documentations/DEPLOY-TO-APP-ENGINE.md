# Deploying to App Engine

This guide provides step-by-step instructions for deploying the containerized application to the App Engine Flexible Environment.

## 1. Create the `app.yaml` file

App Engine uses an `app.yaml` file to configure your service. Create a file named `app.yaml` in the root of the `project-04-Google-OAuth` directory with the following content:

```yaml
runtime: custom
env: flex

env_variables:
  GOOGLE_CLIENT_ID: "projects/YOUR_PROJECT_ID/secrets/google-oauth-client-id/versions/latest"
  GOOGLE_CLIENT_SECRET: "projects/YOUR_PROJECT_ID/secrets/google-oauth-client-secret/versions/latest"

# The following settings are optional, but recommended
automatic_scaling:
  min_num_instances: 1
  max_num_instances: 2
  cpu_utilization:
    target_utilization: 0.6

resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

**Important:** Unlike Cloud Run, which can inject the secret value directly, App Engine requires you to specify the full resource name of the secret. Your application code will need to be able to handle this and fetch the secret value from Secret Manager.

## 2. Deploy to App Engine

With the `app.yaml` file in place, you can deploy your application using a single `gcloud` command. This command will use Cloud Build to build your container and then deploy it to App Engine.

**Note:** Make sure you are in the `project-04-Google-OAuth` directory before running the next command.

```bash
gcloud app deploy
```

When prompted, choose the region where you want to deploy your application.

## 3. Configure Redirect URIs

After you deploy your application, App Engine will provide you with a URL for your service. You need to take this URL and add it to your **Authorized redirect URIs** in your Google Cloud OAuth 2.0 Client ID settings.

1.  Go to the [Credentials](https://console.cloud.google.com/apis/credentials) page in the Google Cloud Console.
2.  Click on the name of your OAuth 2.0 Client ID.
3.  Under **Authorized redirect URIs**, click **ADD URI**.
4.  Paste the URL of your App Engine service, followed by `/auth/callback`. For example:
    `https://your-project-id.appspot.com/auth/callback`
5.  Click **Save**.

Your application is now deployed and configured to work with Google OAuth on App Engine!
