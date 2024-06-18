import os
import sys
import datetime

def today():
    return datetime.datetime.now().strftime('%Y.%m.%d')

def get_creation_date(file):
    creation_time = os.path.getctime(file)
    creation_date = datetime.datetime.fromtimestamp(creation_time).strftime('%Y.%m.%d')
    return creation_date

def get_modification_date(file):
    modification_time = os.path.getmtime(file)
    modification_date = datetime.datetime.fromtimestamp(modification_time).strftime('%Y.%m.%d')
    return modification_date





if __name__ == '__main__':
    pass

