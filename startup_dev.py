#!/usr/bin/env -S uv run --script
"""
Development startup script for log-book project.
This script will:
1. Update web/.env to use the host's private IP
2. Start the web server in a new terminal tab
3. Start the API server in a new terminal tab with virtual environment
"""

import configparser
import shutil
import socket
import subprocess
import sys
import tempfile
from pathlib import Path


def detect_terminal():
    """Detect available terminal emulator and return command structure."""
    terminals = {
        "konsole": ["konsole", "--new-tab", "--workdir"],
        "gnome-terminal": ["gnome-terminal", "--tab", "--working-directory"],
        "xterm": ["xterm", "-e"],
        "x-terminal-emulator": ["x-terminal-emulator", "-e"],
    }

    for term_name, term_cmd in terminals.items():
        if shutil.which(term_name):
            return term_name, term_cmd

    return None, None


def get_private_ip():
    """Get the private IP address of this machine."""
    try:
        # Connect to a remote address to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        # Fallback method
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)


def update_env_file(private_ip):
    """Update the web/.env file with the private IP."""
    env_path = Path("web/.env")

    if not env_path.exists():
        print(f"Error: {env_path} not found")
        sys.exit(1)

    # Read current content
    with open(env_path, "r") as f:
        lines = f.readlines()

    # Update the PUBLIC_API line
    updated_lines = []
    for line in lines:
        if line.startswith("PUBLIC_API="):
            updated_lines.append(f'PUBLIC_API="http://{private_ip}:8000"\n')
        else:
            updated_lines.append(line)

    # Write back to file
    with open(env_path, "w") as f:
        f.writelines(updated_lines)

    print(f"Updated PUBLIC_API to http://{private_ip}:8000")


def start_web_server(terminal_name, terminal_cmd):
    """Start the web server in a new terminal tab."""
    web_dir = str(Path.cwd() / "web")

    if terminal_name == "konsole":
        cmd = [
            terminal_cmd[0],
            terminal_cmd[1],
            terminal_cmd[2],
            web_dir,
            "-e",
            "bash",
            "-c",
            "npm run dev -- --host 0.0.0.0; exec bash",
        ]
    elif terminal_name == "gnome-terminal":
        cmd = [
            terminal_cmd[0],
            terminal_cmd[1],
            "--title=Web Server",
            terminal_cmd[2] + "=" + web_dir,
            "--",
            "bash",
            "-c",
            "npm run dev -- --host 0.0.0.0; exec bash",
        ]
    else:  # xterm and others
        cmd = [
            terminal_cmd[0],
            terminal_cmd[1],
            f"cd {web_dir} && npm run dev -- --host 0.0.0.0; exec bash",
        ]

    process = subprocess.Popen(cmd)
    print("Started web server in new terminal tab")
    return process.pid


def start_api_server(terminal_name, terminal_cmd):
    """Start the API server in a new terminal tab with virtual environment."""
    venv_path = Path.cwd() / ".venv"
    api_dir = str(Path.cwd() / "api" / "log_book")

    activate_cmd = f"source {venv_path}/bin/activate && fastapi dev app.py --host 0.0.0.0; exec bash"

    if terminal_name == "konsole":
        cmd = [
            terminal_cmd[0],
            terminal_cmd[1],
            terminal_cmd[2],
            api_dir,
            "-e",
            "bash",
            "-c",
            activate_cmd,
        ]
    elif terminal_name == "gnome-terminal":
        cmd = [
            terminal_cmd[0],
            terminal_cmd[1],
            "--title=API Server",
            terminal_cmd[2] + "=" + api_dir,
            "--",
            "bash",
            "-c",
            activate_cmd,
        ]
    else:  # xterm and others
        cmd = [terminal_cmd[0], terminal_cmd[1], f"cd {api_dir} && {activate_cmd}"]

    process = subprocess.Popen(cmd)
    print("Started API server in new terminal tab")
    return process.pid


def save_pids(web_pid, api_pid):
    """Save the PIDs to a temporary file for shutdown script."""
    pid_file = Path(tempfile.gettempdir()) / "logbook_dev_pids.txt"
    with open(pid_file, "w") as f:
        f.write(f"web_pid={web_pid}\n")
        f.write(f"api_pid={api_pid}\n")
    print(f"PIDs saved to {pid_file}")


def get_api_log_file():
    """Parse the uvicorn logger config to get the log file path."""
    config_path = Path("api/uvicorn_logger.ini")

    if not config_path.exists():
        return None

    config = configparser.ConfigParser()
    config.read(config_path)

    try:
        args_str = config["handler_logfile"]["args"]
        # Strip leading ( and split on comma to get first element
        # From "('/var/log/logbook-api/access.log','a')" -> "'/var/log/logbook-api/access.log'"
        first_arg = args_str.lstrip("(").split(",")[0]
        # Strip quotes
        return first_arg.strip("'\"")
    except Exception:
        return None


def print_manual_instructions(private_ip):
    """Print manual startup instructions if terminal launching fails."""
    print("\nNo GUI terminal emulator found. Please start the servers manually:")
    print("\n=== Web Server ===")
    print("Open a new terminal and run:")
    print(f"cd {Path.cwd() / 'web'}")
    print("npm run dev -- --host 0.0.0.0")
    print(f"Then visit: http://{private_ip}:5173")

    print("\n=== API Server ===")
    print("Open another terminal and run:")
    print(f"cd {Path.cwd() / 'api' / 'log_book'}")
    print(f"source {Path.cwd() / '.venv'}/bin/activate")
    print("fastapi dev app.py --host 0.0.0.0")
    print(f"API will be available at: http://{private_ip}:8000")


def main():
    """Main function to orchestrate the startup process."""
    print("Starting log-book development environment...")

    # Check if we're in the right directory
    if not (Path("web").exists() and Path("api").exists()):
        print("Error: Please run this script from the log-book project root directory")
        sys.exit(1)

    # Get private IP
    try:
        private_ip = get_private_ip()
        print(f"Detected private IP: {private_ip}")
    except Exception as e:
        print(f"Error detecting private IP: {e}")
        sys.exit(1)

    # Update .env file
    try:
        update_env_file(private_ip)
    except Exception as e:
        print(f"Error updating .env file: {e}")
        sys.exit(1)

    # Detect terminal
    terminal_name, terminal_cmd = detect_terminal()

    if not terminal_name:
        print_manual_instructions(private_ip)
        return

    # Start servers
    try:
        web_pid = start_web_server(terminal_name, terminal_cmd)
        api_pid = start_api_server(terminal_name, terminal_cmd)

        # Save PIDs for shutdown script
        save_pids(web_pid, api_pid)

        print(f"\nDevelopment servers started using {terminal_name}!")
        print(f"Web server: http://{private_ip}:5173")
        print(f"API server: http://{private_ip}:8000")

        # Show API log file location
        log_file = get_api_log_file()
        if log_file:
            print(f"API logs: {log_file}")

        print(
            "\nBoth servers are accessible from your mobile phone using the IP address above."
        )
        print("Use 'python shutdown_dev.py' to stop both servers.")

    except Exception as e:
        print(f"Error starting servers: {e}")
        print("\nFalling back to manual instructions:")
        print_manual_instructions(private_ip)
        sys.exit(1)


if __name__ == "__main__":
    main()
