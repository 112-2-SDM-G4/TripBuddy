# Developer Guide

## 0. Environment
Create new environment and Install packages first
```
virtualenv venv
source venv/bin/activate
pip install -r requirments.txt
```
If you use any new package, please update requirements.txt
```
pip freeze > requirements.txt
```

## 1. Run Server
To run server, you can use :
```
flask --app app run
``` 
or
```
flask --app app run --debug
```

## 2. Add new API
When you are creating new API (Controller), you have to : 

- Check the databases you need is in ```/models```
- Create new {controller_name}.py in ```/controllers```
- Implement ```get, post, delete, put ...``` functions (you may refer to example.py)
- Add the route in ```routes.py```
- Test your API, you can write test code in ```/tests``` or use other method