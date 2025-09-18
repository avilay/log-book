#!/usr/bin/env -S uv run --script
"""
Development shutdown script for log-book project.
This script will gracefully shutdown both the web and API servers
by reading their PIDs from the temporary file created by startup_dev.py.
"""

import os
import signal
import sys
import tempfile
import time
from pathlib import Path


def load_pids():
    """Load the PIDs from the temporary file."""
    pid_file = Path(tempfile.gettempdir()) / "logbook_dev_pids.txt"

    if not pid_file.exists():
        print("No PID file found. Are the servers running?")
        print(f"Expected file: {pid_file}")
        return None, None

    web_pid = None
    api_pid = None

    try:
        with open(pid_file, "r") as f:
            for line in f:
                if line.startswith("web_pid="):
                    web_pid = int(line.split("=")[1].strip())
                elif line.startswith("api_pid="):
                    api_pid = int(line.split("=")[1].strip())

        return web_pid, api_pid
    except Exception as e:
        print(f"Error reading PID file: {e}")
        return None, None


def is_process_running(pid):
    """Check if a process with given PID is running."""
    try:
        # Send signal 0 to check if process exists
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def terminate_process(pid, name):
    """Gracefully terminate a process by PID."""
    if not is_process_running(pid):
        print(f"{name} (PID {pid}) is not running")
        return True

    try:
        print(f"Terminating {name} (PID {pid})...")

        # First try SIGTERM for graceful shutdown
        os.kill(pid, signal.SIGTERM)

        # Wait up to 10 seconds for graceful shutdown
        for _ in range(10):
            if not is_process_running(pid):
                print(f"{name} terminated gracefully")
                return True
            time.sleep(1)

        # If still running, try SIGKILL
        print(f"{name} did not respond to SIGTERM, sending SIGKILL...")
        os.kill(pid, signal.SIGKILL)

        # Wait up to 5 seconds for forced shutdown
        for _ in range(5):
            if not is_process_running(pid):
                print(f"{name} terminated forcefully")
                return True
            time.sleep(1)

        print(f"Failed to terminate {name} (PID {pid})")
        return False

    except Exception as e:
        print(f"Error terminating {name} (PID {pid}): {e}")
        return False


def cleanup_pid_file():
    """Remove the PID file after shutdown."""
    pid_file = Path(tempfile.gettempdir()) / "logbook_dev_pids.txt"
    try:
        if pid_file.exists():
            pid_file.unlink()
            print(f"Cleaned up PID file: {pid_file}")
    except Exception as e:
        print(f"Error cleaning up PID file: {e}")


def main():
    """Main function to orchestrate the shutdown process."""
    print("Shutting down log-book development servers...")

    # Load PIDs
    web_pid, api_pid = load_pids()

    if web_pid is None or api_pid is None:
        print("Could not load server PIDs. Exiting.")
        sys.exit(1)

    print(f"Found PIDs - Web: {web_pid}, API: {api_pid}")

    # Terminate servers
    web_success = terminate_process(web_pid, "Web server")
    api_success = terminate_process(api_pid, "API server")

    # Cleanup PID file
    cleanup_pid_file()

    if web_success and api_success:
        print("\nAll servers shut down successfully!")
    else:
        print("\nSome servers may still be running. Check manually if needed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
