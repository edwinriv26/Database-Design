from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL
from flask import session

import re

app = Flask(__name__, template_folder='templates')
app.secret_key = 'secret_key'

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'C@staneda2024!'
app.config['MYSQL_DB'] = 'user'

mysql = MySQL(app)

# Function to validate email format
def validate_email(email):
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+$', email))

# Function to validate name format (contains only letters)
def validate_name(name):
    return bool(re.match(r'^[a-zA-Z]+$', name))

# Function to validate password format
def validate_password(password):
    # Password should contain at least six characters, at least one number,
    # at least one uppercase letter, and at least one special character
    # that does not include a single quote and double quote.
    return bool(re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|:<>?,./-])[A-Za-z\d~!@#$%^&*()_+{}|:<>?,./-]{6,}$', password))
# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']

        # Validate email format
        if not validate_email(email):
            flash('Invalid email format', 'error')
            return redirect(url_for('home'))

        # Validate password length and format
        if not validate_password(password):
            flash('Password must be at least 6 characters long and meet the requirements', 'error')
            return redirect(url_for('home'))

        # Validate first name format
        if not validate_name(first_name):
            flash('First name must contain only letters', 'error')
            return redirect(url_for('home'))

        # Validate last name format
        if not validate_name(last_name):
            flash('Last name must contain only letters', 'error')
            return redirect(url_for('home'))

        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return redirect(url_for('home'))

        # Check if username or email already exists
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM login WHERE username = %s OR email = %s", (username, email))
        existing_user = cur.fetchone()
        cur.close()

        if existing_user:
            flash('Username or email already exists', 'error')
            return redirect(url_for('home'))
        else:
            # Insert new user into the database
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO login (username, password, firstName, lastName, email) VALUES (%s, %s, %s, %s, %s)", (username, password, first_name, last_name, email))
            mysql.connection.commit()
            cur.close()
            flash('Account created successfully', 'success')
            return redirect(url_for('home'))

    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Connect to the database
        cur = mysql.connection.cursor()

        # Execute the SQL query to check if the username and password match
        cur.execute("SELECT * FROM login WHERE username = %s AND password = %s", (username, password))
        user = cur.fetchone()

        # Close the database cursor
        cur.close()

        # If a user with matching username and password is found, redirect to home page
        if user:
            flash(f'Login successful. Welcome {username}!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password', 'error')

    # Render the login page
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
