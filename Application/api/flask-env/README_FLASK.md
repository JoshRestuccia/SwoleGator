# Running Flask
1. Ensure python3 is intalled 
   * `python --version` should return `Python 3.XX.XX`
2. Create a new python Virtual Environment in the [api directory](../../api/)
   * `python3 -m venv flask-env`
3. To activate the virtual environment:
   *  `./Scripts/activate`
4. Install the required packaged via `pip`:
   * `pip install -r requirements.txt` 
   * If you install any new packages, be sure to update the [requirements.txt](../requirements.txt) file by running:
        - `pip freeze > requirements.txt`
        - You may have to delete all the text in that file to ensure there are no duplicate packages installed (I have not tested this out at all)
5. I have already created the `.flaskenv` file for us to use in development.
6. Update [api.py](./api.py) with the code we want to run in the background
7. cd into [flask-env](../flask-env/) and run `flask run` to start the flask api server