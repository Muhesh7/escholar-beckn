import socket

def is_port_open(host, port):
    # Create a TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Set a timeout of 1 second
    sock.settimeout(1)

    try:
        # Attempt to connect to the host and port
        sock.connect((host, port))

        # Close the socket if successful
        sock.close()

        # Return True if the connection was successful
        return True

    except (socket.timeout, ConnectionRefusedError):
        # Return False if there was an error connecting
        return False

# Check if port 80 is open on example.com
for i in range (1, 10000):
    if is_port_open('portquiz.net', i):
        print('Port', i, 'is open!')
