# Enabling Google Cloud APIs

Before you can deploy the application, you need to enable several APIs in your Google Cloud project. These APIs provide the necessary services for building, storing, and running your application.

## 1. Set Your Project ID

First, make sure you have set the correct Google Cloud Project ID in your terminal. You can do this with the following command:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

## 2. Enable the APIs

You can enable all the required APIs with a single `gcloud` command. This command will enable the following APIs:

*   **Cloud Build API (`cloudbuild.googleapis.com`):** To build your container images.
*   **Artifact Registry API (`artifactregistry.googleapis.com`):** To store your container images.
*   **Cloud Run API (`run.googleapis.com`):** To deploy your application to Cloud Run.
*   **Secret Manager API (`secretmanager.googleapis.com`):** To manage your application's secrets.

Execute the following command to enable these APIs:

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com
```

### Enabling APIs via the Cloud Console

Alternatively, you can enable these APIs through the Google Cloud Console:

1.  Go to the [API Library](https://console.cloud.google.com/apis/library) in the Google Cloud Console.
2.  Search for each of the following APIs by name:
    *   `Cloud Build API`
    *   `Artifact Registry API`
    *   `Cloud Run API`
    *   `Secret Manager API`
3.  Click on the API in the search results and then click the **Enable** button.

