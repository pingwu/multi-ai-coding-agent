# macOS Setup Guide

Welcome! This guide will walk you through setting up your Mac for our course. We'll install the necessary tools to run the projects.

## Prerequisites

- **macOS:** A recent version of macOS.
- **Administrator Access:** Some installation steps may require your administrator password.

## Step 1: Install Docker Desktop

Docker is a tool that allows us to run our projects in isolated environments called containers. This ensures that the projects work the same for everyone.

1.  **Download Docker Desktop:**
    -   Go to the [Docker Desktop website](https://www.docker.com/products/docker-desktop).
    -   Click the "Download for Mac" button, choosing the correct version for your Mac's chip (Apple Silicon or Intel).

2.  **Install Docker Desktop:**
    -   Once the download is complete, open your `Downloads` folder and double-click the `Docker.dmg` file.
    -   Drag the Docker icon into your `Applications` folder.
    -   Open Docker from your `Applications` folder and follow the on-screen setup instructions.

3.  **Verify Docker Installation:**
    -   After Docker starts, you'll see a whale icon in your menu bar.
    -   Open the **Terminal** app and run the following command to make sure everything is working:
        ```bash
        docker run hello-world
        ```
    -   You should see a "Hello from Docker!" message.

## Step 2: Install Git

Git is a version control system that we use to manage our code. It often comes pre-installed on macOS.

1.  **Check if Git is installed:**
    -   Open the **Terminal** app and run:
        ```bash
        git --version
        ```
    -   If you see a version number, you can skip to the next step.

2.  **Install Git (if needed):**
    -   If Git is not installed, you can install it with the Xcode Command Line Tools. Run the following command in your terminal and follow the prompts:
        ```bash
        xcode-select --install
        ```

## Step 3: Clone the Course Repository

Now that you have the necessary tools, you can download the course projects.

1.  **Open the Terminal app.**
2.  **Navigate to the directory where you want to store the projects.**
3.  **Clone the repository:**
    ```bash
    git clone https://github.com/pingwu/multi-ai-coding-agent.git
    ```
4.  **Navigate into the project directory:**
    ```bash
    cd <repository-name>
    ```



## Next Steps

You now have all the necessary tools installed on your system.

For an overview of all the projects and the general workflow, please see the [main project README file](../README.md).

When you are ready to run a specific project, navigate to its directory (e.g., `project-01-content-generator/`) and follow the instructions in its local `README.md` file.

For advanced setup (e.g., GitHub CLI), see the [Advanced Setup Guide](./advanced-setup.md).

## Troubleshooting

-   If you have any issues with the Docker installation, please refer to the official [Docker Desktop Mac installation guide](https://docs.docker.com/desktop/mac/install/).
