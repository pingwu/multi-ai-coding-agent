### Optional but Recommended: Install GitHub CLI

For a smoother experience, we recommend installing the official GitHub CLI, `gh`. It simplifies authentication and makes working with GitHub repositories easier.

1.  **Install GitHub CLI:**
    -   The easiest way to install it on macOS is with [Homebrew](https://brew.sh/). If you have Homebrew, run:
        ```bash
        brew install gh
        ```
    -   Alternatively, you can download it from the [official website](https://cli.github.com/).

2.  **Authenticate with GitHub:**
    ```bash
    gh auth login
    ```
    -   Follow the prompts to log in. Afterwards, you can clone repositories using `gh repo clone <repository-url>` without needing to manage credentials manually.