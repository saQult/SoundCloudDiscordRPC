from psutil import process_iter, NoSuchProcess, AccessDenied, ZombieProcess


def check_if_process_running(process_name):

    for proc in process_iter():
        try:
            if process_name.lower() in proc.name().lower():
                return True
        except (NoSuchProcess, AccessDenied, ZombieProcess):
            pass
    return False