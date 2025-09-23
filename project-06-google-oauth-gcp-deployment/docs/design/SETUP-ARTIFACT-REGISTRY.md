# Setting Up Artifact Registry

Artifact Registry is a service for storing and managing your container images and other artifacts. Before you can deploy your application, you need to create a repository in Artifact Registry to store your container images.

## 1. Understanding Artifact Registry Options

When you create an Artifact Registry repository, you need to make a few decisions:

*   **Repository Name:** This is a unique name for your repository within your project and region (e.g., `my-app-repo`).
*   **Region:** This is the geographic location where your repository will be stored. You should choose a region that is close to your other Google Cloud services (like Cloud Run) to minimize latency. For example, `us-central1`.
*   **Repository Format:** Artifact Registry can store different types of artifacts. For this project, you will be storing Docker container images, so you should choose the `Docker` format.

## 2. Create the Artifact Registry Repository

You can create the repository using the `gcloud` command-line tool.

```bash
gcloud artifacts repositories create YOUR_REPO_NAME \
    --repository-format=docker \
    --location=YOUR_REGION \
    --description="Docker repository for my application"
```

Replace the following:

*   `YOUR_REPO_NAME`: with the name you want to give your repository (e.g., `project-06-repo`).
*   `YOUR_REGION`: with the region where you want to create the repository (e.g., `us-central1`).

### Example

```bash
gcloud artifacts repositories create project-06-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Project 06"
```

### Creating a Repository via the Cloud Console

1.  Go to the [Artifact Registry](https://console.cloud.google.com/artifacts) in the Google Cloud Console.
2.  Click **Create Repository**.
3.  Enter a **Repository name**.
4.  For **Format**, select **Docker**.
5.  For **Location Type**, choose **Region** and then select your desired region.
6.  Click **Create**.

