# WebCards
SWE Project

## To set up the back end
Install PyCharm Community Edition (google it)

Also, install python 3.10 https://www.python.org/ftp/python/3.10.9/python-3.10.9-amd64.exe

Open PyCharm and then use it to open the Backend folder.
If you have never set up a python environment (or have no idea what that means) do the following:

File -> Settings -> Project: Backend -> Python Interpreter -> Add Interpreter -> Add Local...

Replace <your_user_name> with the folder name that should be there. 
> C:\Users\<your_user_name>\AppData\Local\Programs\Python\Python310\python.exe

Paste that into the file search bar and press Apply.

At the bottom of the pycharm window, click on Terminal. In the terminal, submit the command:
>pip install -r requirements.txt


## To run the python fast api
At the bottom of the pycharm window, click on Terminal. In the terminal, submit the command:
>uvicorn main:app --reload

This will start the web server and allow http requests to be sent. (You can see it by clicking the link).
