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
            session['username'] = username  # Store the username in session
            session.pop('_flashes', [])  # Clear existing flash messages
            return redirect(url_for('postitem'))  # Redirect to the postitem route
        else:
            flash('Invalid username or password', 'error')
            return render_template('index.html', flash_messages=session['_flashes'])
            
    # Clear existing flash messages before rendering the login page
    flash_messages = session.pop('_flashes', [])
    return render_template('postitem.html', flash_messages=flash_messages)

#@app.route('/postitem')   
#def render_login_page():     
    # Render the login page
#    return render_template('index.html')
    
@app.route('/postitem', methods=['GET', 'POST'])
def postitem():
    if 'username' not in session:
        flash('You need to log in first', 'error')
        return redirect(url_for('login'))

    if request.method == 'POST':
        title = request.form['title']  # Add this line to retrieve the title from the form
        description = request.form['description']
        category = request.form['category']
        price = request.form['price']
        username = session.get('username')  # Assuming you have stored the username in the session after login

         # Get the current timestamp for itemcreated_at
        from datetime import datetime
        itemcreated_at = datetime.now()

        # Connect to the database
        cur = mysql.connection.cursor()

        # Insert data into the 'item' table
        cur.execute("""
            INSERT INTO item (title, description, category, price, username, itemcreated_at) 
            VALUES (%s, %s, %s, %s, %s, %s)""", 
            (title, description, category, price, username, itemcreated_at))
            
        # Commit the transaction and close the cursor
        mysql.connection.commit()
        cur.close()
        # Handle the form submission and item posting process
        # After successfully posting the item, redirect to the post item page
        flash('Item posted successfully', 'success')
        return redirect(url_for('postitem'))

    # Render the postitem page
    return render_template('postitem.html')

    
@app.route('/')
def home():
   # if 'username' in session:  # Check if the user is logged in
   # return redirect(url_for('postitem'))  # Redirect to the postitem route
   # else:
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
