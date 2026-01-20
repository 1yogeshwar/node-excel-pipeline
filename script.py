
import sys

def log(msg):
    print(f"[STEP] {msg}")

def error(msg):
    print(f"[ERROR] {msg}", file=sys.stderr)
    sys.exit(1)

log("Python script started")

if len(sys.argv) < 3:
    error("INPUT_MISSING: Expected two numbers")

try:
    a = int(sys.argv[1])
    log(f"Received A = {a}")
except:
    error("INVALID_INPUT: A is not a valid number")

try:
    b = int(sys.argv[2])
    log(f"Received B = {b}")
except:
    error("INVALID_INPUT: B is not a valid number")

log("Performing addition")
result = a + b
log(f"Calculation complete: {a} + {b} = {result}")
print(result)
