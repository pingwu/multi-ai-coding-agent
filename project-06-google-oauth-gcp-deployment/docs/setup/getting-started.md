# Getting Started

## Prerequisites

- Docker Desktop installed and running
- OpenAI API Key ([Get it here](https://platform.openai.com/api-keys))
- Serper API Key ([Get it here](https://serper.dev/))
- 8GB+ RAM recommended

## API Key Setup (Production Best Practice)

**⚠️ Production Note**: Use environment variables instead of `.env` files for production deployment. This approach ensures security and follows cloud deployment best practices.

### Option 1: Environment Variables (Recommended)

#### Windows (WSL2)
```bash
# Add to your shell profile (recommended)
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.bashrc
echo 'export SERPER_API_KEY="your-serper-key"' >> ~/.bashrc
source ~/.bashrc

# Or set for current session only
export OPENAI_API_KEY="sk-your-key-here"
export SERPER_API_KEY="your-serper-key"
```

#### macOS
```bash
# For Bash shell (~/.bash_profile or ~/.bashrc)
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.bash_profile
echo 'export SERPER_API_KEY="your-serper-key"' >> ~/.bash_profile
source ~/.bash_profile

# For Zsh shell (~/.zshrc) - Default on macOS Catalina+
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.zshrc
echo 'export SERPER_API_KEY="your-serper-key"' >> ~/.zshrc
source ~/.zshrc
```

#### Linux
```bash
# For Bash shell (~/.bashrc)
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.bashrc
echo 'export SERPER_API_KEY="your-serper-key"' >> ~/.bashrc
source ~/.bashrc

# For Zsh shell (~/.zshrc)
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.zshrc
echo 'export SERPER_API_KEY="your-serper-key"' >> ~/.zshrc
source ~/.zshrc

# For Fish shell (~/.config/fish/config.fish)
echo 'set -gx OPENAI_API_KEY "sk-your-key-here"' >> ~/.config/fish/config.fish
echo 'set -gx SERPER_API_KEY "your-serper-key"' >> ~/.config/fish/config.fish
```

### Option 2: .env File (Development Fallback)

If environment variables aren't available, the system falls back to `.env` file:

```bash
# Copy template and edit
cp .env.example .env

# Edit .env file with your keys
# OPENAI_API_KEY=sk-your-key-here
# SERPER_API_KEY=your-serper-key
```

### Verify Setup

```bash
# Check if environment variables are set
echo $OPENAI_API_KEY
echo $SERPER_API_KEY

# Verify your shell type
echo $SHELL
```

## Quick Setup

1. **Set Environment Variables** (see above)
2. **Start Services**
   ```bash
   make up
   ```
3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## First Content Generation

1. Open http://localhost:3000
2. Enter a topic (e.g., "AI in Healthcare 2025")
3. Click "Generate Content"
4. Watch the real-time agent progress
5. Review the generated content

## Common Commands

```bash
make up          # Start all services
make down        # Stop all services
make logs        # View logs
make rebuild     # Rebuild containers
```

## Shell Profile Quick Reference

| Platform | Default Shell | Profile File |
|----------|---------------|--------------|
| Windows WSL2 | Bash | `~/.bashrc` |
| macOS (older) | Bash | `~/.bash_profile` |
| macOS (Catalina+) | Zsh | `~/.zshrc` |
| Linux (Ubuntu/Debian) | Bash | `~/.bashrc` |
| Linux (various) | Zsh | `~/.zshrc` |
| Linux (modern) | Fish | `~/.config/fish/config.fish` |

**Production Deployment**: Environment variables automatically work with Docker, Kubernetes, and all major cloud platforms without additional configuration.