# Deploying to Cloud Run

This guide provides step-by-step instructions for deploying the containerized application to Cloud Run.

## 1. Build and Push the Container Image

First, you need to build your container image and push it to the Artifact Registry repository you created earlier.

**Note:** Make sure you are in the `project-04-Google-OAuth` directory before running the next command.

From the root of your project directory (where the `Dockerfile` is located), run the following command:

```bash
PROJECT_ID=$(gcloud config get-value project)
REPO_NAME=project-06-repo # Or your chosen repo name
REGION=us-central1 # Or your chosen region

# Build the container image
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/google-oauth-app:latest .
```

This command uses Cloud Build to build your Docker image and tags it with the location of your Artifact Registry repository. The `.` at the end of the command tells Cloud Build to use the current directory as the source.

## 2. Deploy to Cloud Run

Now that your container image is in Artifact Registry, you can deploy it to Cloud Run.

```bash
gcloud run deploy google-oauth-app \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/google-oauth-app:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-secrets="GOOGLE_CLIENT_ID=google-oauth-client-id:latest,GOOGLE_CLIENT_SECRET=google-oauth-client-secret:latest"
```

This command does the following:

*   `gcloud run deploy google-oauth-app`: Creates a new Cloud Run service named `google-oauth-app`.
*   `--image ...`: Specifies the container image to deploy.
*   `--platform managed`: Specifies that you are using the fully managed version of Cloud Run.
*   `--region ...`: Specifies the region where you want to run your service.
*   `--allow-unauthenticated`: Allows public access to your service, so users can access your web app.
*   `--set-secrets=...`: This is how you inject your secrets from Secret Manager into your application as environment variables. The format is `ENV_VAR_NAME=SECRET_NAME:VERSION`.

## 3. Configure Redirect URIs

After you deploy your application, Cloud Run will provide you with a URL for your service. You need to take this URL and add it to your **Authorized redirect URIs** in your Google Cloud OAuth 2.0 Client ID settings.

1.  Go to the [Credentials](https://console.cloud.google.com/apis/credentials) page in the Google Cloud Console.
2.  Click on the name of your OAuth 2.0 Client ID.
3.  Under **Authorized redirect URIs**, click **ADD URI**.
4.  Paste the URL of your Cloud Run service, followed by `/auth/callback`. For example:
    `https://google-oauth-app-xyz-uc.a.run.app/auth/callback`
5.  Click **Save**.

Your application is now deployed and configured to work with Google OAuth on Cloud Run!
