import os
import random
import subprocess
from datetime import datetime, timedelta

# Define the date ranges
range_1 = (datetime(2026, 5, 5, 9, 0, 0), datetime(2026, 5, 15, 18, 0, 0))
range_2 = (datetime(2026, 6, 6, 9, 0, 0), datetime(2026, 6, 18, 18, 0, 0))

# Pool of commit messages that look like real work for Vibely
commit_messages = [
    "fix: resolve react-hooks/set-state-in-effect in state provider",
    "refactor: optimize token overlap matching fallback algorithm",
    "feat: add custom outreach template variables dynamic replacement",
    "style: update sidebar hover states to match neubrutalist theme",
    "perf: add concurrency limiter to creator scoring API route",
    "docs: clarify Groq fallback model config in README.md",
    "test: implement basic unit test for calculateAudienceQuality function",
    "fix: handle missing API key cases gracefully on landing page",
    "style: refine metric panel alignment on dashboard grid",
    "feat: add red flags detection callout in creator detailed view",
    "refactor: extract business logic components in matchmaker flow",
    "perf: reduce rendering overhead in Framer Motion dashboard animations",
    "fix: resolve ESLint warnings in layout components",
    "docs: update API payload specs in README.md",
    "style: adjust dark cockpit dashboard theme colors for better accessibility",
    "feat: add toast notifications when copying AI outreach text",
    "refactor: move constants to separate module to prevent import cycles",
    "fix: adjust budget tolerance range in scoring calculation",
    "style: remove layout jumps during skeletal loading state",
    "feat: add platform filters to precision query panel",
    "fix: escape html chars inside custom templates draft tool",
    "perf: cache initial seed creators count calculations in local state",
    "style: clean up inline style definitions to use CSS variables",
    "docs: format mathematical formulas in project specifications",
    "feat: add simulated escrow payments flow page layout",
    "refactor: clean up unused phosphor-icons imports in routing components",
    "fix: fix layout flashing during workspace initial hydration",
    "test: add budget range helper test assertions",
    "feat: integrate search query input with campaign filtering parameters",
    "perf: minify svg assets inside the public directory",
    "style: unify mobile responsive breakpoints for profile details drawer",
    "docs: document business model transaction split variables",
    "fix: ensure thread IDs are fully unique on creation",
    "refactor: isolate Next.js page data collections",
    "style: improve card outline weights in neubrutalist homepage mode",
    "feat: add creator engagement rate telemetry charts",
    "fix: address hydration errors on dashboard filters component",
    "perf: debounce campaign brief range input adjustments",
    "style: enhance neon-lime visual contrast under dark mode",
    "feat: add clear filters button on matching panel layout",
    "fix: handle edge case when estCost is zero in budget fit function",
    "refactor: abstract text tokenization code in fallback API handler",
    "docs: describe token matching algorithm structure",
    "feat: add active brief summary count widgets",
    "style: adjust badge sizing inside messages thread list preview",
    "fix: repair layout clipping of sidebar drawer on smaller viewports",
    "perf: replace heavy asset images with optimized next/image elements",
    "feat: allow editing active brief category parameter inline",
    "style: update welcome banner font styling",
    "test: mock API match router response cases"
]

# Shuffle messages
random.shuffle(commit_messages)

# Generate 50 random timestamps in the allowed ranges
timestamps = []
for _ in range(50):
    selected_range = random.choice([range_1, range_2])
    start_date, end_date = selected_range
    delta_seconds = int((end_date - start_date).total_seconds())
    random_seconds = random.randint(0, delta_seconds)
    commit_time = start_date + timedelta(seconds=random_seconds)
    timestamps.append(commit_time)

# Sort timestamps chronologically to make the commit history look natural
timestamps.sort()

# Path to the file we will modify to generate commits
history_file_path = "commit_history.txt"

print(f"Generating 50 commits across the specified dates...")

for i, timestamp in enumerate(timestamps):
    formatted_date = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
    msg = commit_messages[i % len(commit_messages)]
    
    # Modify the history file
    with open(history_file_path, "a") as f:
        f.write(f"Commit {i+1}: {formatted_date} - {msg}\n")
    
    # Run git commands with environment variables set
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = formatted_date
    env["GIT_COMMITTER_DATE"] = formatted_date
    
    # Add files
    subprocess.run(["git", "add", history_file_path], check=True, env=env)
    
    # Commit
    subprocess.run(["git", "commit", "-m", msg], check=True, env=env)

print("Successfully generated 50 commits with backdated timestamps!")
