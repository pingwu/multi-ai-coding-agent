# Project 06: Google OAuth Deployment to Google Cloud

## An Introduction to Cloud Concepts

Welcome to the world of cloud computing! If you are new to this topic, this section will give you a brief overview of the key concepts you will encounter in this project.

### What is Cloud Computing?

Imagine that instead of running an application on your own computer, you could use a powerful computer owned by someone else (like Google) to run it for you. That's the basic idea of cloud computing. You are using someone else's computers (servers) over the internet to store data and run applications.

### What is a Container? (Docker)

A container is like a standardized box for your application. It packages up your code and all its dependencies (like libraries and settings) so that it can run consistently on any computer. In this project, we use **Docker** to create a container for our application. This ensures that the application will run the same way on your computer as it does in the cloud.

### What is Serverless? (Cloud Run and App Engine)

"Serverless" is a bit of a misnomer because there are still servers involved. However, with a serverless platform, you don't have to worry about managing those servers. You simply give your code (or container) to the cloud provider, and they take care of running it and scaling it up or down as needed. In this project, we will explore two of Google's serverless platforms: **Cloud Run** and **App Engine**.

### What is Google Cloud Platform (GCP)?

Google Cloud Platform (GCP) is Google's suite of cloud computing services. It provides a wide range of services, from running applications and storing data to machine learning and data analytics. In this project, you will use several GCP services to deploy your application.

This project serves as a comprehensive guide for deploying a containerized web application that uses Google OAuth to Google Cloud. It is designed as a teaching resource to illustrate best practices for deployment, security, and configuration on Google Cloud Platform (GCP).

## Objective

The primary goal of this project is to provide a step-by-step guide for deploying a containerized application to GCP. This guide uses the `project-04-Google-OAuth` application as an example and covers:

*   Setting up a Google Cloud project.
*   Enabling necessary APIs.
*   Containerizing an existing application using Docker.
*   Storing container images in Artifact Registry.
*   Managing secrets (like OAuth credentials) using Secret Manager.
*   Deploying the application to Cloud Run and App Engine.

## Prerequisites

This guide assumes you have access to the `project-04-Google-OAuth` application. All commands should be run from the `project-04-Google-OAuth` directory.

## Deployment Documentation

This project is broken down into the following documents:

*   **[SETUP-APIS.md](SETUP-APIS.md):** A step-by-step guide to enable the required APIs in your Google Cloud project.
*   **[SETUP-ARTIFACT-REGISTRY.md](SETUP-ARTIFACT-REGISTRY.md):** Instructions on how to create a new Artifact Registry to store your container images.
*   **[SETUP-SECRETS.md](SETUP-SECRETS.md):** A guide to using Google Cloud Secret Manager to securely store your OAuth credentials.
*   **[DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md):** A comparison of Cloud Run and App Engine as deployment targets.
*   **[DEPLOY-TO-CLOUD-RUN.md](DEPLOY-TO-CLOUD-RUN.md):** Detailed instructions for deploying the application to Cloud Run.
*   **[DEPLOY-TO-APP-ENGINE.md](DEPLOY-TO-APP-ENGINE.md):** Detailed instructions for deploying the application to App Engine.

## Future Development

*   **CI/CD Pipeline:** A potential future enhancement for this project is to set up a CI/CD pipeline using Cloud Build. This would automate the process of building and deploying the application whenever changes are pushed to the repository.
